/**
 * TuiGo — app.js
 * Full MVP: Auth, Realtime Map, Matching, Filters, Call/WhatsApp
 * Uses Firebase (Firestore + Phone Auth) + Leaflet.js (OpenStreetMap)
 */

"use strict";

// ══════════════════════════════════════════
// WAIT FOR FIREBASE + LEAFLET TO BE READY
// ══════════════════════════════════════════
window._appInit = function () {
  if (!window._firebase || typeof L === "undefined") {
    console.warn("TuiGo: dependencies not ready, retrying…");
    setTimeout(window._appInit, 200);
    return;
  }
  hideLoader();
  initAuth();
};

// If window already loaded before script executes
if (document.readyState === "complete") {
  setTimeout(() => window._appInit && window._appInit(), 100);
}

// ══════════════════════════════════════════
// GLOBALS
// ══════════════════════════════════════════
let map               = null;
let watchId           = null;
let locationInterval  = null;
let unsubscribeSnap   = null;

let currentUser       = null;   // Firebase auth user
let myProfile         = null;   // Firestore profile
let myLat             = null;
let myLng             = null;
let isGoing           = false;

const markers         = {};     // userId → Leaflet marker
let allStudents       = [];     // raw Firestore docs (excluding self)
let filteredStudents  = [];

// Active filters
const activeFilters = {
  zone:    "all",
  tuition: "",
  match:   "all"
};

// ══════════════════════════════════════════
// LOADER
// ══════════════════════════════════════════
function hideLoader() {
  setTimeout(() => {
    const el = document.getElementById("loading-screen");
    if (el) { el.style.opacity = "0"; el.style.transition = "opacity 0.4s"; setTimeout(() => el.remove(), 400); }
  }, 2200);
}

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
let toastTimer = null;
function showToast(msg, duration = 2500) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), duration);
}

// ══════════════════════════════════════════
// AUTH FLOW
// ══════════════════════════════════════════
function initAuth() {
  const { auth, onAuthStateChanged } = window._firebase;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      const profile = await loadProfile(user.uid);
      if (profile) {
        myProfile = profile;
        showApp();
      } else {
        showScreen("auth");
        showAuthStep("profile");
        // Pre-fill name from Google account
        const nameInput = document.getElementById("profile-name");
        if (nameInput && user.displayName) nameInput.value = user.displayName;
      }
    } else {
      currentUser = null;
      myProfile = null;
      showScreen("auth");
      showAuthStep("google");
    }
  });

  bindAuthEvents();
}

function bindAuthEvents() {
  // Google Sign-In
  document.getElementById("google-signin-btn").addEventListener("click", async () => {
    const btn = document.getElementById("google-signin-btn");
    btn.classList.add("loading");
    btn.querySelector("span").textContent = "Signing in…";
    hideAuthError();

    try {
      const { auth, GoogleAuthProvider, signInWithPopup } = window._firebase;
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      await signInWithPopup(auth, provider);
      // onAuthStateChanged fires and handles next steps
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        showAuthError("Google sign-in failed. Try again.");
      }
      btn.classList.remove("loading");
      btn.querySelector("span").textContent = "Continue with Google";
    }
  });

  // Save profile
  document.getElementById("save-profile-btn").addEventListener("click", saveNewProfile);
}

async function saveNewProfile() {
  const name    = document.getElementById("profile-name").value.trim();
  const tuition = document.getElementById("profile-tuition").value.trim();
  const time    = document.getElementById("profile-time").value;
  const zone    = document.getElementById("profile-zone").value;

  if (!name || !tuition || !zone) { showAuthError("Please fill all fields."); return; }

  const btn = document.getElementById("save-profile-btn");
  btn.textContent = "Saving…"; btn.classList.add("loading");

  try {
    const { db, doc, setDoc } = window._firebase;
    const profile = {
      uid:     currentUser.uid,
      email:   currentUser.email || "",
      name, tuition, time, zone,
      createdAt: Date.now()
    };
    await setDoc(doc(db, "users", currentUser.uid), profile);
    myProfile = profile;
    showApp();
  } catch (err) {
    showAuthError("Could not save profile: " + err.message);
  } finally {
    btn.textContent = "Save & Start"; btn.classList.remove("loading");
  }
}

async function loadProfile(uid) {
  try {
    const { db, doc, getDoc } = window._firebase;
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}

function showAuthStep(step) {
  document.querySelectorAll(".auth-step").forEach(el => el.classList.add("hidden"));
  const el = document.getElementById("auth-step-" + step);
  if (el) el.classList.remove("hidden");
}
function showAuthError(msg) {
  const el = document.getElementById("auth-error");
  el.textContent = msg;
  el.classList.remove("hidden");
}
function hideAuthError() {
  document.getElementById("auth-error").classList.add("hidden");
}

// ══════════════════════════════════════════
// SCREEN MANAGEMENT
// ══════════════════════════════════════════
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  const el = document.getElementById(name + "-screen");
  if (el) el.classList.remove("hidden");
}

function showApp() {
  showScreen("app");
  initTabs();
  initMap();
  startGeolocation();
  startFirestoreListener();
  bindAppEvents();
  populateProfileModal();
}

// ══════════════════════════════════════════
// TABS
// ══════════════════════════════════════════
function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
      document.getElementById("tab-" + tab).classList.remove("hidden");
      if (tab === "map" && map) setTimeout(() => map.invalidateSize(), 100);
    });
  });
}

// ══════════════════════════════════════════
// MAP INIT
// ══════════════════════════════════════════
function initMap() {
  if (map) return;
  map = L.map("map", {
    zoomControl: true,
    attributionControl: true,
    center: [22.5726, 88.3639], // Default: Kolkata
    zoom: 14
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© <a href='https://openstreetmap.org'>OSM</a>",
    maxZoom: 19
  }).addTo(map);
}

// ══════════════════════════════════════════
// GEOLOCATION
// ══════════════════════════════════════════
function startGeolocation() {
  if (!navigator.geolocation) {
    setMapStatus("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {
    enableHighAccuracy: true, timeout: 10000, maximumAge: 0
  });

  // Also watch for continuous updates
  watchId = navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, {
    enableHighAccuracy: true, timeout: 10000, maximumAge: 5000
  });

  // Push to Firestore every 7 seconds (rate-limit for Firestore writes)
  locationInterval = setInterval(() => {
    if (myLat !== null && isGoing) pushMyLocation();
  }, 7000);
}

function onLocationSuccess(pos) {
  const { latitude: lat, longitude: lng } = pos.coords;
  myLat = lat; myLng = lng;
  setMapStatus("📍 Location active");
  updateMyMarker(lat, lng);
  map.setView([lat, lng], 15);
  applyFiltersAndRender();
}

function onLocationError(err) {
  setMapStatus("⚠ Location unavailable — " + err.message);
}

function setMapStatus(msg) {
  const el = document.getElementById("map-status-text");
  if (el) el.textContent = msg;
}

// ══════════════════════════════════════════
// MY MARKER (self)
// ══════════════════════════════════════════
function updateMyMarker(lat, lng) {
  if (!map) return;
  const id = "me_" + currentUser.uid;
  if (markers[id]) {
    markers[id].setLatLng([lat, lng]);
  } else {
    const icon = createMarkerIcon("me");
    markers[id] = L.marker([lat, lng], { icon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`<div class='map-popup'><div class='popup-name'>📍 You (${myProfile.name})</div><div class='popup-tuition'>${myProfile.tuition}</div></div>`);
  }
}

// ══════════════════════════════════════════
// PUSH MY LOCATION TO FIRESTORE
// ══════════════════════════════════════════
async function pushMyLocation() {
  if (!currentUser || myLat === null) return;
  try {
    const { db, doc, setDoc, serverTimestamp } = window._firebase;
    await setDoc(doc(db, "locations", currentUser.uid), {
      userId:   currentUser.uid,
      name:     myProfile.name,
      phone:    myProfile.phone,
      lat:      myLat,
      lng:      myLng,
      tuition:  myProfile.tuition,
      time:     myProfile.time,
      zone:     myProfile.zone,
      status:   isGoing,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Location push error:", e.message);
  }
}

// ══════════════════════════════════════════
// "I'M GOING" TOGGLE
// ══════════════════════════════════════════
async function toggleGoing() {
  isGoing = !isGoing;
  const btn = document.getElementById("going-toggle");
  if (isGoing) {
    btn.classList.add("active");
    await pushMyLocation();
    showToast("✅ You're now visible to nearby students!");
  } else {
    btn.classList.remove("active");
    // Update status to false in Firestore
    try {
      const { db, doc, updateDoc } = window._firebase;
      await updateDoc(doc(db, "locations", currentUser.uid), { status: false });
    } catch {}
    showToast("🔕 You're now hidden from others.");
  }
}

// ══════════════════════════════════════════
// FIRESTORE REALTIME LISTENER
// ══════════════════════════════════════════
function startFirestoreListener() {
  const { db, collection, onSnapshot } = window._firebase;

  unsubscribeSnap = onSnapshot(
    collection(db, "locations"),
    (snapshot) => {
      const students = [];
      snapshot.forEach(d => {
        const data = d.data();
        if (data.userId === currentUser.uid) return;   // skip self
        if (!data.status) return;                      // skip hidden users
        if (!data.lat || !data.lng) return;
        students.push({ id: d.id, ...data });
      });
      allStudents = students;
      applyFiltersAndRender();
    },
    (err) => console.warn("Snapshot error:", err.message)
  );
}

// ══════════════════════════════════════════
// HAVERSINE DISTANCE (km)
// ══════════════════════════════════════════
function haversine(lat1, lng1, lat2, lng2) {
  const R   = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a   = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function toRad(deg) { return deg * Math.PI / 180; }

// ══════════════════════════════════════════
// MATCHING LOGIC
// ══════════════════════════════════════════
function getMatchType(student) {
  if (!myProfile) return "other";
  const sameTuition = student.tuition &&
    myProfile.tuition &&
    student.tuition.trim().toLowerCase() === myProfile.tuition.trim().toLowerCase();
  if (sameTuition) return "same";
  if (myLat !== null) {
    const dist = haversine(myLat, myLng, student.lat, student.lng);
    if (dist <= 1) return "route";
  }
  return "other";
}

function getFare(match) {
  if (match === "same")  return "FREE 🎉";
  if (match === "route") return "~₹10";
  return "Negotiate";
}

function getZoneFromDist(dist) {
  if (dist <= 2) return "A";
  if (dist <= 4) return "B";
  if (dist <= 6) return "C";
  return "D";
}

// ══════════════════════════════════════════
// APPLY FILTERS & RE-RENDER
// ══════════════════════════════════════════
function applyFiltersAndRender() {
  if (!allStudents) return;

  filteredStudents = allStudents.filter(s => {
    // Compute distance
    const dist = (myLat !== null)
      ? haversine(myLat, myLng, s.lat, s.lng)
      : Infinity;
    s._dist  = dist;
    s._match = getMatchType(s);
    s._zone  = getZoneFromDist(dist);

    // Zone filter
    if (activeFilters.zone !== "all" && s._zone !== activeFilters.zone) return false;

    // Tuition filter
    if (activeFilters.tuition) {
      const tq = activeFilters.tuition.toLowerCase();
      if (!s.tuition || !s.tuition.toLowerCase().includes(tq)) return false;
    }

    // Match filter
    if (activeFilters.match !== "all" && s._match !== activeFilters.match) return false;

    return true;
  });

  // Sort by distance
  filteredStudents.sort((a, b) => a._dist - b._dist);

  renderMap();
  renderList();
  updateNearbyCount();
}

// ══════════════════════════════════════════
// RENDER MAP MARKERS
// ══════════════════════════════════════════
function renderMap() {
  if (!map) return;

  // Remove stale markers
  const activeIds = new Set(filteredStudents.map(s => s.id));
  activeIds.add("me_" + currentUser?.uid);

  Object.keys(markers).forEach(id => {
    if (!activeIds.has(id)) {
      map.removeLayer(markers[id]);
      delete markers[id];
    }
  });

  // Add/update markers
  filteredStudents.forEach(s => {
    const icon   = createMarkerIcon(s._match);
    const distTx = s._dist < Infinity ? s._dist.toFixed(2) + " km away" : "";
    const phone  = s.phone || "";
    const waLink = phone ? `https://wa.me/${phone.replace(/\D/g,"")}` : "#";
    const callHref = phone ? `tel:${phone}` : "#";

    const popupHtml = `
      <div class="map-popup">
        <div class="popup-name">${escHtml(s.name)}</div>
        <div class="popup-tuition">${escHtml(s.tuition || "")}</div>
        <div class="popup-dist">${distTx}</div>
        <div class="popup-actions">
          <a href="${callHref}" class="popup-btn popup-btn-call">📞 Call</a>
          <a href="${waLink}" target="_blank" class="popup-btn popup-btn-wa">💬 WhatsApp</a>
        </div>
      </div>`;

    if (markers[s.id]) {
      markers[s.id].setLatLng([s.lat, s.lng]);
      markers[s.id].setIcon(icon);
    } else {
      markers[s.id] = L.marker([s.lat, s.lng], { icon })
        .addTo(map)
        .on("click", () => openStudentModal(s));
    }
    markers[s.id].bindPopup(popupHtml);
  });
}

// ══════════════════════════════════════════
// CUSTOM MARKER ICONS
// ══════════════════════════════════════════
const MARKER_COLORS = {
  same:  "#00e5a0",
  route: "#f5c518",
  other: "#4a9eff",
  me:    "#ff4d6d"
};

function createMarkerIcon(type) {
  const color = MARKER_COLORS[type] || MARKER_COLORS.other;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <ellipse cx="14" cy="34" rx="6" ry="2" fill="rgba(0,0,0,0.3)"/>
      <path d="M14 0C6.268 0 0 6.268 0 14c0 5.4 3.06 10.08 7.5 12.48L14 36l6.5-9.52C25.94 24.08 29 19.4 29 14 29 6.268 21.732 0 14 0z" fill="${color}" opacity="0.9"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36]
  });
}

// ══════════════════════════════════════════
// RENDER STUDENT LIST
// ══════════════════════════════════════════
function renderList() {
  const container = document.getElementById("student-list");
  const countEl   = document.getElementById("list-count");
  countEl.textContent = filteredStudents.length;

  if (filteredStudents.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <p>No students found nearby</p>
        <small>Try adjusting filters or toggle "I'm Going"</small>
      </div>`;
    return;
  }

  container.innerHTML = filteredStudents.map(s => {
    const initial  = (s.name || "?")[0].toUpperCase();
    const distTx   = s._dist < Infinity ? s._dist.toFixed(2) : "?";
    const matchTag = tagHTML(s._match);
    const zoneTag  = `<span class="tag tag-zone">Zone ${s._zone}</span>`;
    const avatarColor = colorFromName(s.name);

    return `
      <div class="student-card" data-id="${s.id}" role="button" tabindex="0">
        <div class="student-avatar" style="border-color:${MARKER_COLORS[s._match]}; color:${MARKER_COLORS[s._match]}">
          ${initial}
        </div>
        <div class="student-info">
          <div class="student-name">${escHtml(s.name)}</div>
          <div class="student-tuition">${escHtml(s.tuition || "—")}</div>
          <div class="student-meta">${matchTag}${zoneTag}</div>
        </div>
        <div class="student-right">
          <div class="student-dist">${distTx}<small>km</small></div>
        </div>
      </div>`;
  }).join("");

  // Click handlers
  container.querySelectorAll(".student-card").forEach(card => {
    const handler = () => {
      const s = filteredStudents.find(x => x.id === card.dataset.id);
      if (s) openStudentModal(s);
    };
    card.addEventListener("click", handler);
    card.addEventListener("keydown", e => { if (e.key === "Enter") handler(); });
  });
}

function tagHTML(match) {
  if (match === "same")  return `<span class="tag tag-same">Same Tuition</span>`;
  if (match === "route") return `<span class="tag tag-route">Same Route</span>`;
  return `<span class="tag tag-other">Other</span>`;
}

// ══════════════════════════════════════════
// NEARBY COUNT
// ══════════════════════════════════════════
function updateNearbyCount() {
  const el = document.getElementById("nearby-count");
  if (el) el.textContent = filteredStudents.length + " nearby";
}

// ══════════════════════════════════════════
// STUDENT DETAIL MODAL
// ══════════════════════════════════════════
function openStudentModal(s) {
  const distTx = s._dist < Infinity ? s._dist.toFixed(2) + " km" : "Unknown";
  const email  = s.email || "";

  document.getElementById("modal-name").textContent    = s.name || "—";
  document.getElementById("modal-tuition").textContent = s.tuition || "—";
  document.getElementById("modal-dist").textContent    = distTx;
  document.getElementById("modal-zone").textContent    = "Zone " + (s._zone || "?");
  document.getElementById("modal-time").textContent    = s.time || "—";
  document.getElementById("modal-fare").textContent    = getFare(s._match);
  document.getElementById("modal-avatar").textContent  = (s.name || "?")[0].toUpperCase();
  document.getElementById("modal-avatar").style.color  = MARKER_COLORS[s._match];
  document.getElementById("modal-avatar").style.borderColor = MARKER_COLORS[s._match];

  // Tags
  document.getElementById("modal-tags").innerHTML = tagHTML(s._match) + `<span class="tag tag-zone">Zone ${s._zone}</span>`;

  // Email / WhatsApp (using Gmail compose as the "call" equivalent)
  const callBtn = document.getElementById("modal-call-btn");
  const waBtn   = document.getElementById("modal-whatsapp-btn");
  if (email) {
    callBtn.href  = "mailto:" + email;
    callBtn.style.pointerEvents = "auto";
    waBtn.href    = "mailto:" + email + "?subject=TuiGo%20Ride%20Share";
    waBtn.style.pointerEvents   = "auto";
  } else {
    callBtn.href = "#";
    waBtn.href   = "#";
  }

  // Show on map button
  document.getElementById("show-on-map-btn").onclick = () => {
    closeModal("student-modal");
    switchTab("map");
    setTimeout(() => {
      map.setView([s.lat, s.lng], 16);
      if (markers[s.id]) markers[s.id].openPopup();
    }, 200);
  };

  document.getElementById("student-modal").classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// ══════════════════════════════════════════
// PROFILE MODAL
// ══════════════════════════════════════════
function populateProfileModal() {
  if (!myProfile) return;
  document.getElementById("edit-name").value    = myProfile.name    || "";
  document.getElementById("edit-tuition").value = myProfile.tuition || "";
  document.getElementById("edit-time").value    = myProfile.time    || "";
  document.getElementById("edit-zone").value    = myProfile.zone    || "A";
  const av = document.getElementById("profile-avatar-display");
  if (av) av.textContent = (myProfile.name || "?")[0].toUpperCase();
}

async function updateProfile() {
  const name    = document.getElementById("edit-name").value.trim();
  const tuition = document.getElementById("edit-tuition").value.trim();
  const time    = document.getElementById("edit-time").value;
  const zone    = document.getElementById("edit-zone").value;
  if (!name || !tuition) { showToast("⚠ Name and tuition required"); return; }

  try {
    const { db, doc, updateDoc } = window._firebase;
    await updateDoc(doc(db, "users", currentUser.uid), { name, tuition, time, zone });
    myProfile = { ...myProfile, name, tuition, time, zone };
    showToast("✅ Profile updated!");
    closeModal("profile-modal");
    if (isGoing) pushMyLocation();
    applyFiltersAndRender();
  } catch (e) {
    showToast("Error: " + e.message);
  }
}

// ══════════════════════════════════════════
// APP EVENT BINDINGS
// ══════════════════════════════════════════
function bindAppEvents() {
  // Going toggle
  document.getElementById("going-toggle").addEventListener("click", toggleGoing);

  // Modal closes
  document.getElementById("modal-close").addEventListener("click", () => closeModal("student-modal"));
  document.getElementById("profile-modal-close").addEventListener("click", () => closeModal("profile-modal"));

  // Overlay click-outside
  document.getElementById("student-modal").addEventListener("click", function(e) {
    if (e.target === this) closeModal("student-modal");
  });
  document.getElementById("profile-modal").addEventListener("click", function(e) {
    if (e.target === this) closeModal("profile-modal");
  });

  // Profile button
  document.getElementById("profile-btn").addEventListener("click", () => {
    populateProfileModal();
    document.getElementById("profile-modal").classList.remove("hidden");
  });

  // Update profile
  document.getElementById("update-profile-btn").addEventListener("click", updateProfile);

  // Sign out
  document.getElementById("signout-btn").addEventListener("click", async () => {
    const { auth, signOut } = window._firebase;
    // Set status to false first
    try {
      const { db, doc, updateDoc } = window._firebase;
      await updateDoc(doc(db, "locations", currentUser.uid), { status: false });
    } catch {}
    if (watchId) navigator.geolocation.clearWatch(watchId);
    clearInterval(locationInterval);
    if (unsubscribeSnap) unsubscribeSnap();
    await signOut(auth);
  });

  // Filter events
  document.querySelectorAll("#zone-filter .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#zone-filter .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilters.zone = chip.dataset.zone;
    });
  });

  document.querySelectorAll("#match-filter .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#match-filter .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilters.match = chip.dataset.match;
    });
  });

  document.getElementById("apply-filter-btn").addEventListener("click", () => {
    activeFilters.tuition = document.getElementById("tuition-filter").value.trim();
    applyFiltersAndRender();
    switchTab("list");
    showToast("Filters applied!");
  });

  document.getElementById("reset-filter-btn").addEventListener("click", () => {
    activeFilters.zone    = "all";
    activeFilters.tuition = "";
    activeFilters.match   = "all";
    document.getElementById("tuition-filter").value = "";
    document.querySelectorAll("#zone-filter .chip").forEach((c, i) => {
      c.classList.toggle("active", i === 0);
    });
    document.querySelectorAll("#match-filter .chip").forEach((c, i) => {
      c.classList.toggle("active", i === 0);
    });
    applyFiltersAndRender();
    showToast("Filters reset");
  });
}

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === name);
  });
  document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
  document.getElementById("tab-" + name).classList.remove("hidden");
  if (name === "map" && map) setTimeout(() => map.invalidateSize(), 100);
}

function escHtml(str) {
  if (!str) return "";
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function colorFromName(name) {
  if (!name) return "#444";
  const colors = ["#00e5a0","#4a9eff","#f5c518","#ff4d6d","#c77dff","#ff9a3c"];
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function sanitizeFirebaseError(msg) {
  if (!msg) return "Unknown error";
  if (msg.includes("quota")) return "SMS quota exceeded. Try later.";
  if (msg.includes("invalid-phone")) return "Invalid phone number.";
  if (msg.includes("too-many-requests")) return "Too many attempts. Please wait.";
  if (msg.includes("network")) return "Network error. Check connection.";
  return msg.split("(")[0].trim();
}
