"use strict";

// ══════════════════════════════════════════
// ENTRY POINT
// ══════════════════════════════════════════
window._appInit = function () {
  if (!window._firebase || typeof L === "undefined") {
    setTimeout(window._appInit, 200);
    return;
  }
  hideLoader();
  initAuth();
};
if (document.readyState === "complete") {
  setTimeout(() => window._appInit && window._appInit(), 100);
}

// ══════════════════════════════════════════
// GLOBALS
// ══════════════════════════════════════════
let map           = null;
let watchId       = null;
let locInterval   = null;
let rideUnsub     = null;
let searchUnsub   = null;
let histUnsub     = null;
let notifUnsub    = null;
let routeLayer    = null;
let etaInterval   = null;
let reqTimer      = null;

let currentUser   = null;
let myProfile     = null;
let myLat         = null;
let myLng         = null;
let isOnline      = false;
let activeRideId  = null;
let activeRide    = null;
let pendingRideId = null; // rider: ride they're being shown
let selectedRole  = null;
let starRating    = 0;

const markers     = {};   // uid → leaflet marker

// Fare config
const FARE = { base: 10, perKm: 5, min: 10 };

// ══════════════════════════════════════════
// LOADER
// ══════════════════════════════════════════
function hideLoader() {
  setTimeout(() => {
    const el = document.getElementById("loading-screen");
    if (el) { el.style.opacity = "0"; el.style.transition = "opacity 0.4s"; setTimeout(() => el.remove(), 400); }
  }, 2400);
}

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
let toastTimer = null;
function showToast(msg, duration = 2800) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), duration);
}

// ══════════════════════════════════════════
// SCREEN HELPERS
// ══════════════════════════════════════════
function showScreen(id) {
  ["loading-screen","auth-screen","profile-screen","app-screen"].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle("hidden", s !== id);
  });
}

// ══════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════
function initAuth() {
  const { auth, onAuthStateChanged } = window._firebase;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      const profile = await loadProfile(user.uid);
      if (profile) {
        myProfile = profile;
        showScreen("app-screen");
        initApp();
      } else {
        showScreen("profile-screen");
        prefillSetup(user);
      }
    } else {
      currentUser = null;
      myProfile   = null;
      activeRideId = null;
      cleanup();
      showScreen("auth-screen");
    }
  });

  // Google sign-in
  document.getElementById("google-signin-btn").addEventListener("click", async () => {
    const btn = document.getElementById("google-signin-btn");
    btn.classList.add("loading");
    btn.querySelector("span").textContent = "Signing in…";
    hideAuthError("auth-error");
    try {
      const { auth, GoogleAuthProvider, signInWithPopup } = window._firebase;
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") showAuthError("auth-error", "Sign-in failed. Try again.");
      btn.classList.remove("loading");
      btn.querySelector("span").textContent = "Continue with Google";
    }
  });
}

function prefillSetup(user) {
  const photo = document.getElementById("setup-photo");
  photo.src = user.photoURL || "";
  photo.style.display = user.photoURL ? "block" : "none";
  const nameEl = document.getElementById("setup-name");
  if (user.displayName) nameEl.value = user.displayName;
}

// ══════════════════════════════════════════
// PROFILE SETUP
// ══════════════════════════════════════════
(function bindSetupEvents() {
  // Role selection
  document.querySelectorAll(".role-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".role-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedRole = card.dataset.role;
      const riderFields = document.getElementById("rider-extra-fields");
      riderFields.classList.toggle("hidden", selectedRole !== "rider");
    });
  });

  // Save profile
  document.getElementById("save-profile-btn").addEventListener("click", saveNewProfile);
})();

async function saveNewProfile() {
  const name     = document.getElementById("setup-name").value.trim();
  const phone    = document.getElementById("setup-phone").value.trim();
  const whatsapp = document.getElementById("setup-whatsapp").value.trim() || phone;
  const tuition  = document.getElementById("setup-tuition").value.trim();
  const zone     = document.getElementById("setup-zone").value;
  const time     = document.getElementById("setup-time").value;
  const vehicle  = document.getElementById("setup-vehicle").value.trim();
  const vehicleNo= document.getElementById("setup-vehicle-no").value.trim();

  if (!selectedRole) { showAuthError("setup-error", "Please select Student or Rider."); return; }
  if (!name || !phone || !tuition || !zone) { showAuthError("setup-error", "Please fill all required fields."); return; }
  if (!/^\d{10}$/.test(phone)) { showAuthError("setup-error", "Enter a valid 10-digit phone number."); return; }

  const btn = document.getElementById("save-profile-btn");
  btn.classList.add("loading");

  try {
    const { db, doc, setDoc } = window._firebase;
    const profile = {
      uid: currentUser.uid,
      name, phone, whatsapp, tuition, zone, time,
      role: selectedRole,
      email: currentUser.email || "",
      photoURL: currentUser.photoURL || "",
      vehicle: vehicle || "",
      vehicleNo: vehicleNo || "",
      rating: 0, totalRatings: 0, totalRides: 0,
      upiId: "",
      createdAt: Date.now()
    };
    await setDoc(doc(db, "users", currentUser.uid), profile);
    myProfile = profile;
    showScreen("app-screen");
    initApp();
  } catch (err) {
    showAuthError("setup-error", "Could not save: " + err.message);
  } finally {
    btn.classList.remove("loading");
  }
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove("hidden"); }
}
function hideAuthError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

async function loadProfile(uid) {
  try {
    const { db, doc, getDoc } = window._firebase;
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}

// ══════════════════════════════════════════
// APP INIT
// ══════════════════════════════════════════
function initApp() {
  renderProfileUI();
  bindAppEvents();
  initMap();
  startGeolocation();
  listenActiveRide();
  listenNotifications();
  loadRideHistory();
  if (myProfile.role === "rider") listenSearchingRides();
  updateMapView();
}

function renderProfileUI() {
  // Header role badge
  const badge = document.getElementById("role-badge");
  badge.textContent = myProfile.role === "rider" ? "Rider" : "Student";
  badge.className = "role-badge " + (myProfile.role === "rider" ? "rider" : "student");

  // Nav photo
  const navPhoto = document.getElementById("nav-profile-photo");
  navPhoto.src = myProfile.photoURL || "";
  if (!myProfile.photoURL) navPhoto.style.display = "none";

  // Profile view
  document.getElementById("profile-photo-big").src = myProfile.photoURL || "";
  document.getElementById("profile-display-name").textContent = myProfile.name;
  const roleTag = document.getElementById("profile-display-role");
  roleTag.textContent = myProfile.role === "rider" ? "🏍️ Rider" : "🎓 Student";
  roleTag.className = "role-tag-big" + (myProfile.role === "rider" ? " rider-tag" : "");

  document.getElementById("pi-phone").textContent   = "+91 " + myProfile.phone;
  document.getElementById("pi-wa").textContent      = "+91 " + myProfile.whatsapp;
  document.getElementById("pi-tuition").textContent = myProfile.tuition;
  document.getElementById("pi-zone").textContent    = "Zone " + myProfile.zone;
  document.getElementById("pi-time").textContent    = myProfile.time || "—";
  document.getElementById("pi-rating").textContent  = myProfile.totalRatings > 0
    ? (myProfile.rating / myProfile.totalRatings).toFixed(1) + " ★"
    : "New";
  document.getElementById("pi-rides").textContent   = myProfile.totalRides || 0;

  if (myProfile.role === "rider" && myProfile.vehicle) {
    document.getElementById("pi-vehicle").textContent = myProfile.vehicle + " · " + myProfile.vehicleNo;
  } else {
    document.getElementById("pi-vehicle-row").style.display = "none";
  }

  // Rides tab title
  document.getElementById("rides-tab-title").textContent = myProfile.role === "rider" ? "My Rides" : "My Rides";

  // Show rider-specific sections
  if (myProfile.role === "rider") {
    document.getElementById("rider-requests-section").classList.remove("hidden");
  }
}

function updateMapView() {
  const isRider = myProfile.role === "rider";
  document.getElementById("student-actions").classList.toggle("hidden", isRider);
  document.getElementById("rider-actions").classList.toggle("hidden", !isRider);
}

// ══════════════════════════════════════════
// MAP
// ══════════════════════════════════════════
function initMap() {
  if (map) { map.remove(); map = null; }
  map = L.map("map", { zoomControl: true, attributionControl: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19
  }).addTo(map);
}

function makeMarkerIcon(color, letter) {
  return L.divIcon({
    html: `<div style="
      background:${color};color:#0c1219;
      width:34px;height:34px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-family:'Syne',sans-serif;font-weight:800;font-size:14px;
      border:3px solid rgba(0,0,0,0.25);
      box-shadow:0 2px 8px rgba(0,0,0,0.4);">${letter}</div>`,
    className: "", iconSize: [34, 34], iconAnchor: [17, 17]
  });
}

function updateMyMarker(lat, lng) {
  if (!map) return;
  const color = myProfile.role === "rider" ? "#ff8c42" : "#00e5a0";
  const letter = (myProfile.name || "?")[0].toUpperCase();
  if (markers["me"]) {
    markers["me"].setLatLng([lat, lng]);
  } else {
    markers["me"] = L.marker([lat, lng], { icon: makeMarkerIcon(color, letter), zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`<strong>You (${myProfile.role})</strong><br>${myProfile.name}`);
  }
}

function updateOtherMarker(uid, data) {
  if (!map || !data.lat || !data.lng) return;
  const color = data.role === "rider" ? "#ff8c42" : "#4a9eff";
  const letter = (data.name || "?")[0].toUpperCase();
  if (markers[uid]) {
    markers[uid].setLatLng([data.lat, data.lng]);
  } else {
    markers[uid] = L.marker([data.lat, data.lng], { icon: makeMarkerIcon(color, letter) })
      .addTo(map)
      .bindPopup(`<strong>${data.name}</strong><br>${data.role === "rider" ? "🏍️ Rider" : "🎓 Student"}<br>${data.tuition || ""}`);
  }
}

function removeMarker(uid) {
  if (markers[uid]) { map.removeLayer(markers[uid]); delete markers[uid]; }
}

// ══════════════════════════════════════════
// GEOLOCATION
// ══════════════════════════════════════════
function startGeolocation() {
  if (!navigator.geolocation) { setMapStatus("⚠ Geolocation not supported"); return; }
  navigator.geolocation.getCurrentPosition(onLocSuccess, onLocError, { enableHighAccuracy: true, timeout: 10000 });
  watchId = navigator.geolocation.watchPosition(onLocSuccess, onLocError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 });
  locInterval = setInterval(() => { if (myLat && (isOnline || myProfile.role === "student")) pushLocation(); }, 8000);
}

function onLocSuccess(pos) {
  const { latitude: lat, longitude: lng } = pos.coords;
  myLat = lat; myLng = lng;
  setMapStatus("📍 Location active");
  updateMyMarker(lat, lng);
  if (!map._loaded) map.setView([lat, lng], 15);
  else if (!activeRideId) map.panTo([lat, lng]);
  listenNearbyUsers();
  // Push location so others can see us
  pushLocation();
}

function onLocError(err) { setMapStatus("⚠ " + err.message); }
function setMapStatus(msg) {
  const el = document.getElementById("map-status-text");
  if (el) el.textContent = msg;
}

async function pushLocation() {
  if (!currentUser || !myLat || !myProfile) return;
  try {
    const { db, doc, setDoc } = window._firebase;
    await setDoc(doc(db, "locations", currentUser.uid), {
      uid:      currentUser.uid,
      name:     myProfile.name,
      role:     myProfile.role,
      tuition:  myProfile.tuition,
      zone:     myProfile.zone,
      phone:    myProfile.phone,
      lat:      myLat,
      lng:      myLng,
      online:   isOnline || myProfile.role === "student",
      ts:       Date.now()
    });
  } catch {}
}

// ══════════════════════════════════════════
// NEARBY USERS (map markers)
// ══════════════════════════════════════════
let nearbyUnsub = null;
function listenNearbyUsers() {
  if (nearbyUnsub) nearbyUnsub();
  const { db, collection, onSnapshot, query, where } = window._firebase;
  const q = query(collection(db, "locations"), where("online", "==", true));
  nearbyUnsub = onSnapshot(q, snap => {
    const seen = new Set();
    let count = 0;
    snap.forEach(d => {
      const data = d.data();
      if (d.id === currentUser.uid) return;
      seen.add(d.id);
      updateOtherMarker(d.id, data);
      count++;
    });
    // Remove gone markers
    Object.keys(markers).forEach(uid => {
      if (uid !== "me" && uid !== "route" && !seen.has(uid)) removeMarker(uid);
    });
    const el = document.getElementById("nearby-count");
    if (el) el.textContent = count + " nearby";
  });
}

// ══════════════════════════════════════════
// ROUTE DRAWING (OSRM)
// ══════════════════════════════════════════
async function drawRoute(fromLat, fromLng, toLat, toLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.routes || !data.routes[0]) return null;
    const coords   = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
    const duration = data.routes[0].duration;
    const distance = data.routes[0].distance;
    if (routeLayer) map.removeLayer(routeLayer);
    routeLayer = L.polyline(coords, { color: "#00e5a0", weight: 4, opacity: 0.8 }).addTo(map);
    map.fitBounds(routeLayer.getBounds(), { padding: [60, 60] });
    return { duration, distance };
  } catch { return null; }
}

function clearRoute() {
  if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
}

// ══════════════════════════════════════════
// ETA COUNTDOWN
// ══════════════════════════════════════════
function startETA(seconds) {
  clearInterval(etaInterval);
  let rem = Math.round(seconds);
  setETA(rem);
  etaInterval = setInterval(() => {
    rem -= 1;
    if (rem <= 0) { clearInterval(etaInterval); return; }
    setETA(rem);
  }, 1000);
}

function setETA(sec) {
  const el = document.getElementById("rp-eta");
  if (!el) return;
  if (sec < 60) el.textContent = sec + "s";
  else el.textContent = Math.ceil(sec / 60) + " min";
}

function calcFare(distMeters) {
  const km = distMeters / 1000;
  return Math.max(FARE.min, Math.round(FARE.base + km * FARE.perKm));
}

// ══════════════════════════════════════════
// HAVERSINE DISTANCE
// ══════════════════════════════════════════
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ══════════════════════════════════════════
// STUDENT: BOOK RIDE
// ══════════════════════════════════════════
document.getElementById("book-ride-btn").addEventListener("click", () => {
  if (!myLat) { showToast("📍 Waiting for location…"); return; }
  if (activeRideId) { showToast("You already have an active ride"); showRidePanel(); return; }
  bookRide();
});

async function bookRide() {
  try {
    const { db, collection, addDoc, serverTimestamp } = window._firebase;
    const fare = calcFare(500); // estimated
    const rideRef = await addDoc(collection(db, "rides"), {
      studentId:       currentUser.uid,
      studentName:     myProfile.name,
      studentPhone:    myProfile.phone,
      studentWhatsapp: myProfile.whatsapp,
      studentPhoto:    myProfile.photoURL || "",
      studentLat:      myLat,
      studentLng:      myLng,
      tuition:         myProfile.tuition,
      zone:            myProfile.zone,
      riderId:         null,
      riderName:       null,
      riderPhone:      null,
      riderWhatsapp:   null,
      riderPhoto:      null,
      riderVehicle:    null,
      riderVehicleNo:  null,
      riderLat:        null,
      riderLng:        null,
      status:          "searching",
      fare:            fare,
      paymentMethod:   "cash",
      createdAt:       serverTimestamp(),
      updatedAt:       serverTimestamp()
    });
    activeRideId = rideRef.id;
    showRidePanel();
    showRPState("rp-searching");
    listenActiveRide();
    showToast("🔍 Looking for riders…");
  } catch (err) {
    showToast("Error: " + err.message);
  }
}

// Cancel search
document.getElementById("cancel-search-btn").addEventListener("click", () => cancelRide("Student cancelled"));
document.getElementById("cancel-ride-student-btn")?.addEventListener("click", () => cancelRide("Student cancelled"));

// ══════════════════════════════════════════
// RIDER: ONLINE TOGGLE
// ══════════════════════════════════════════
document.getElementById("online-toggle-btn").addEventListener("click", () => {
  isOnline = !isOnline;
  const btn   = document.getElementById("online-toggle-btn");
  const label = document.getElementById("online-label");
  btn.classList.toggle("online", isOnline);
  btn.classList.toggle("offline", !isOnline);
  label.textContent = isOnline ? "I'm Online" : "Go Online";
  pushLocation();
  showToast(isOnline ? "🟢 You're now online — riders can see you" : "⚫ You're offline");
});

// ══════════════════════════════════════════
// RIDER: LISTEN FOR SEARCHING RIDES
// ══════════════════════════════════════════
function listenSearchingRides() {
  if (searchUnsub) searchUnsub();
  const { db, collection, onSnapshot, query, where } = window._firebase;
  const q = query(collection(db, "rides"), where("status", "==", "searching"));
  searchUnsub = onSnapshot(q, snap => {
    const list = document.getElementById("rider-requests-list");
    list.innerHTML = "";
    let hasRequests = false;

    snap.forEach(d => {
      const ride = { id: d.id, ...d.data() };
      if (ride.studentId === currentUser.uid) return; // own booking
      if (activeRideId) return; // already on a ride
      hasRequests = true;

      // distance from rider to student
      const dist = (myLat && ride.studentLat)
        ? haversine(myLat, myLng, ride.studentLat, ride.studentLng).toFixed(1)
        : "?";
      const fare = ride.fare || calcFare(parseFloat(dist) * 1000 || 500);

      // Show incoming request in panel if not already shown
      if (!pendingRideId && !activeRideId) {
        pendingRideId = ride.id;
        showIncomingRidePanel(ride, dist, fare);
      }

      // Also show in rides tab
      const card = document.createElement("div");
      card.className = "request-card";
      card.innerHTML = `
        <div class="request-card-name">${escHtml(ride.studentName)}</div>
        <div class="request-card-meta">📍 ${dist} km · 🏫 ${escHtml(ride.tuition)} · 💰 ₹${fare}</div>
        <div class="request-card-actions">
          <button class="btn-reject-sm" data-id="${ride.id}">Reject</button>
          <button class="btn-accept-sm" data-id="${ride.id}">Accept Ride</button>
        </div>`;
      card.querySelector(".btn-accept-sm").addEventListener("click", () => acceptRide(ride.id, ride));
      card.querySelector(".btn-reject-sm").addEventListener("click", () => {
        if (pendingRideId === ride.id) { pendingRideId = null; hideRidePanel(); }
      });
      list.appendChild(card);
    });

    if (!hasRequests) list.innerHTML = `<div class="empty-state"><p>No open requests</p><small>Go online and wait for students to book</small></div>`;
  });
}

function showIncomingRidePanel(ride, dist, fare) {
  document.getElementById("rr-student-avatar").textContent = (ride.studentName || "?")[0].toUpperCase();
  document.getElementById("rr-student-name").textContent   = ride.studentName || "—";
  document.getElementById("rr-student-tuition").textContent= ride.tuition || "—";
  document.getElementById("rr-distance").textContent       = dist + " km away";
  document.getElementById("rr-tuition").textContent        = ride.tuition || "—";
  document.getElementById("rr-fare").textContent           = "₹" + fare + " (estimated)";

  showRidePanel();
  showRPState("rp-rider-request");
  startRequestTimer(ride.id, ride);
}

function startRequestTimer(rideId, ride) {
  clearInterval(reqTimer);
  let t = 30;
  const arc = document.getElementById("rr-timer-arc");
  const num = document.getElementById("rr-timer-num");
  const circumference = 113;
  reqTimer = setInterval(() => {
    t--;
    num.textContent = t;
    arc.setAttribute("stroke-dashoffset", ((30 - t) / 30) * circumference);
    if (t <= 0) {
      clearInterval(reqTimer);
      pendingRideId = null;
      hideRidePanel();
    }
  }, 1000);
}

document.getElementById("accept-ride-btn").addEventListener("click", async () => {
  if (!pendingRideId) return;
  clearInterval(reqTimer);
  await acceptRide(pendingRideId, null);
});

document.getElementById("reject-ride-btn").addEventListener("click", () => {
  clearInterval(reqTimer);
  pendingRideId = null;
  hideRidePanel();
  showToast("Request rejected");
});

async function acceptRide(rideId, rideData) {
  try {
    const { db, doc, runTransaction } = window._firebase;
    const rideRef = doc(db, "rides", rideId);
    await runTransaction(db, async (t) => {
      const snap = await t.get(rideRef);
      if (!snap.exists() || snap.data().status !== "searching") throw new Error("Ride no longer available");
      t.update(rideRef, {
        riderId:        currentUser.uid,
        riderName:      myProfile.name,
        riderPhone:     myProfile.phone,
        riderWhatsapp:  myProfile.whatsapp,
        riderPhoto:     myProfile.photoURL || "",
        riderVehicle:   myProfile.vehicle || "",
        riderVehicleNo: myProfile.vehicleNo || "",
        riderLat:       myLat,
        riderLng:       myLng,
        status:         "accepted",
        acceptedAt:     Date.now()
      });
    });
    activeRideId = rideId;
    pendingRideId = null;
    clearInterval(reqTimer);
    isOnline = false;
    pushLocation();
    listenActiveRide();
    showToast("✅ Ride accepted!");
    addNotification(rideData?.studentId, "🏍️ Rider found!", `${myProfile.name} (${myProfile.vehicle || "Rider"}) is on the way.`);
  } catch (err) {
    showToast("⚠ " + err.message);
    pendingRideId = null;
    hideRidePanel();
  }
}

// ══════════════════════════════════════════
// ACTIVE RIDE LISTENER
// ══════════════════════════════════════════
function listenActiveRide() {
  if (rideUnsub) rideUnsub();
  if (!activeRideId) {
    // Check Firestore for any active ride for this user
    resumeActiveRide();
    return;
  }
  const { db, doc, onSnapshot } = window._firebase;
  rideUnsub = onSnapshot(doc(db, "rides", activeRideId), snap => {
    if (!snap.exists()) { activeRideId = null; hideRidePanel(); return; }
    activeRide = { id: snap.id, ...snap.data() };
    handleRideUpdate(activeRide);
  });
}

async function resumeActiveRide() {
  // On app load, check if there's an active ride
  const { db, collection, query, where, getDocs } = window._firebase;
  const field = myProfile.role === "student" ? "studentId" : "riderId";
  const statuses = ["searching", "accepted", "arriving", "picked_up"];
  try {
    for (const status of statuses) {
      const q = query(collection(db, "rides"), where(field, "==", currentUser.uid), where("status", "==", status));
      const snap = await getDocs(q);
      if (!snap.empty) {
        activeRideId = snap.docs[0].id;
        listenActiveRide();
        return;
      }
    }
  } catch {}
}

function handleRideUpdate(ride) {
  showRidePanel();
  const isStudent = myProfile.role === "student";
  const isRider   = myProfile.role === "rider";

  switch (ride.status) {
    case "searching":
      showRPState("rp-searching");
      break;

    case "accepted":
      if (isStudent) {
        showStudentAcceptedPanel(ride);
        // Draw route from rider to student
        if (ride.riderLat && myLat) {
          drawRoute(ride.riderLat, ride.riderLng, myLat, myLng).then(r => {
            if (r) startETA(r.duration);
          });
        }
      } else {
        showRiderActivePanel(ride, "accepted");
      }
      updateRideStatusSteps("accepted");
      break;

    case "arriving":
      if (isStudent) {
        showStudentAcceptedPanel(ride);
        if (ride.riderLat && myLat) {
          drawRoute(ride.riderLat, ride.riderLng, myLat, myLng).then(r => {
            if (r) startETA(r.duration);
          });
        }
      } else {
        showRiderActivePanel(ride, "arriving");
      }
      updateRideStatusSteps("arriving");
      break;

    case "picked_up":
      if (isStudent) {
        showStudentAcceptedPanel(ride);
      } else {
        showRiderActivePanel(ride, "picked_up");
      }
      updateRideStatusSteps("picked_up");
      clearRoute();
      break;

    case "completed":
      showCompletedPanel(ride);
      clearRoute();
      clearInterval(etaInterval);
      break;

    case "cancelled":
      activeRideId = null;
      activeRide = null;
      hideRidePanel();
      clearRoute();
      clearInterval(etaInterval);
      showToast("Ride was cancelled");
      break;
  }
}

// ══════════════════════════════════════════
// PANEL STATES
// ══════════════════════════════════════════
function showStudentAcceptedPanel(ride) {
  showRPState("rp-accepted-student");
  document.getElementById("rp-rider-avatar").textContent = (ride.riderName || "?")[0].toUpperCase();
  document.getElementById("rp-rider-name").textContent   = ride.riderName || "—";
  document.getElementById("rp-rider-vehicle").textContent= ride.riderVehicle ? ride.riderVehicle + " · " + ride.riderVehicleNo : "Rider";

  const callEl = document.getElementById("rp-call-rider");
  const waEl   = document.getElementById("rp-wa-rider");
  if (ride.riderPhone) {
    callEl.href = "tel:+91" + ride.riderPhone;
    waEl.href   = "https://wa.me/91" + ride.riderPhone + "?text=" + encodeURIComponent(`Hi ${ride.riderName}, I'm waiting for my ride on TuiGo!`);
  }
  // Update rider marker
  if (ride.riderLat) updateOtherMarker("active-rider", { lat: ride.riderLat, lng: ride.riderLng, name: ride.riderName, role: "rider" });
}

function showRiderActivePanel(ride, status) {
  showRPState("rp-rider-active");
  document.getElementById("rp-student-avatar").textContent  = (ride.studentName || "?")[0].toUpperCase();
  document.getElementById("rp-student-name").textContent    = ride.studentName || "—";
  document.getElementById("rp-student-tuition").textContent = ride.tuition || "—";
  document.getElementById("rp-student-zone").textContent    = "Zone " + (ride.zone || "—");

  const callEl = document.getElementById("rp-call-student");
  const waEl   = document.getElementById("rp-wa-student");
  if (ride.studentPhone) {
    callEl.href = "tel:+91" + ride.studentPhone;
    waEl.href   = "https://wa.me/91" + ride.studentPhone + "?text=" + encodeURIComponent(`Hi ${ride.studentName}, I'm your TuiGo rider. I'm on my way!`);
  }

  // Navigate to student
  const navBtn = document.getElementById("rp-navigate-btn");
  if (ride.studentLat) {
    navBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${ride.studentLat},${ride.studentLng}`;
  }

  // Draw route: rider → student (for arriving), update rider location
  if (status === "accepted" || status === "arriving") {
    pushRiderLocationToRide();
    if (ride.studentLat && myLat) {
      drawRoute(myLat, myLng, ride.studentLat, ride.studentLng);
    }
  }

  // Status button text
  const statusBtn = document.getElementById("rider-status-btn");
  if (status === "accepted" || status === "arriving") {
    statusBtn.textContent = "Mark Picked Up";
    statusBtn.onclick = () => updateRideStatus("picked_up");
  } else if (status === "picked_up") {
    statusBtn.textContent = "Mark Arrived / Complete";
    statusBtn.onclick = () => updateRideStatus("completed");
    clearRoute();
  }
}

function showCompletedPanel(ride) {
  showRPState("rp-completed");
  const fare = ride.fare || 0;
  document.getElementById("fare-summary").textContent = "Fare: ₹" + fare;
  // Payment
  if (ride.riderWhatsapp && myProfile.role === "student") {
    document.getElementById("upi-id-display").textContent = "+91" + ride.riderWhatsapp + "@upi";
    document.getElementById("upi-pay-link").href = `upi://pay?pa=${ride.riderWhatsapp}@upi&pn=${ride.riderName}&am=${fare}&cu=INR`;
  }
}

async function pushRiderLocationToRide() {
  if (!activeRideId || !myLat) return;
  try {
    const { db, doc, updateDoc } = window._firebase;
    await updateDoc(doc(db, "rides", activeRideId), {
      riderLat: myLat, riderLng: myLng,
      status: "arriving"
    });
  } catch {}
}

async function updateRideStatus(newStatus) {
  if (!activeRideId) return;
  try {
    const { db, doc, updateDoc } = window._firebase;
    const update = { status: newStatus, updatedAt: Date.now() };
    if (newStatus === "completed") {
      update.completedAt = Date.now();
      update.fare        = calcFare(activeRide?.distance || 1000);
      // Increment total rides
      await updateDoc(doc(db, "users", currentUser.uid), { totalRides: (myProfile.totalRides || 0) + 1 });
      myProfile.totalRides = (myProfile.totalRides || 0) + 1;
      // Notify student
      addNotification(activeRide?.studentId, "✅ Arrived!", "Your ride is complete. Please rate your rider.");
    }
    await updateDoc(doc(db, "rides", activeRideId), update);
  } catch (err) {
    showToast("Error: " + err.message);
  }
}

async function cancelRide(reason) {
  if (!activeRideId) return;
  try {
    const { db, doc, updateDoc } = window._firebase;
    await updateDoc(doc(db, "rides", activeRideId), {
      status: "cancelled",
      cancelReason: reason,
      cancelledAt: Date.now()
    });
    activeRideId = null;
    activeRide = null;
    hideRidePanel();
    clearRoute();
    clearInterval(etaInterval);
    showToast("Ride cancelled");
  } catch (err) {
    showToast("Error: " + err.message);
  }
}

// Rider cancel
document.getElementById("cancel-ride-rider-btn")?.addEventListener("click", () => cancelRide("Rider cancelled"));

// Done & Rate
document.getElementById("done-ride-btn").addEventListener("click", () => {
  const finishedRideId = activeRideId;
  const finishedRide   = activeRide;
  activeRideId = null;
  activeRide   = null;
  hideRidePanel();
  clearInterval(etaInterval);
  // Show rating
  const toRateName = myProfile.role === "student"
    ? finishedRide?.riderName
    : finishedRide?.studentName;
  openRatingModal(finishedRideId, toRateName);
  // Update profile ride count
  document.getElementById("pi-rides").textContent = myProfile.totalRides;
});

// ══════════════════════════════════════════
// RIDE STATUS STEPS (student view)
// ══════════════════════════════════════════
function updateRideStatusSteps(status) {
  const steps    = ["accepted", "arriving", "picked_up", "arrived"];
  const stepEls  = ["rss-accepted", "rss-arriving", "rss-onway", "rss-arrived"];
  const lineEls  = ["rss-line1", "rss-line2", "rss-line3"];
  const idx = steps.indexOf(status);

  stepEls.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("active", "done");
    if (i < idx) el.classList.add("done");
    else if (i === idx) el.classList.add("active");
  });
  lineEls.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("done", i < idx);
  });
}

// ══════════════════════════════════════════
// PANEL SHOW/HIDE HELPERS
// ══════════════════════════════════════════
function showRidePanel() {
  document.getElementById("active-ride-panel").classList.remove("hidden");
}
function hideRidePanel() {
  document.getElementById("active-ride-panel").classList.add("hidden");
  hideAllRPStates();
}
function showRPState(id) {
  hideAllRPStates();
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}
function hideAllRPStates() {
  document.querySelectorAll(".rp-state").forEach(el => el.classList.add("hidden"));
}

// ══════════════════════════════════════════
// RATING
// ══════════════════════════════════════════
function openRatingModal(rideId, name) {
  starRating = 0;
  document.getElementById("rating-for-name").textContent = name ? "Rate " + name : "Rate your ride";
  document.querySelectorAll(".star").forEach(s => s.classList.remove("active"));
  document.getElementById("rating-comment").value = "";
  document.getElementById("rating-modal").classList.remove("hidden");

  document.querySelectorAll(".star").forEach(star => {
    star.onclick = () => {
      starRating = parseInt(star.dataset.val);
      document.querySelectorAll(".star").forEach(s => s.classList.toggle("active", parseInt(s.dataset.val) <= starRating));
    };
  });

  document.getElementById("submit-rating-btn").onclick = async () => {
    if (starRating === 0) { showToast("Please select a rating"); return; }
    await submitRating(rideId, starRating);
  };
  document.getElementById("skip-rating-btn").onclick = () => {
    document.getElementById("rating-modal").classList.add("hidden");
  };
}

async function submitRating(rideId, stars) {
  try {
    const { db, doc, updateDoc, getDoc } = window._firebase;
    const isStudent = myProfile.role === "student";
    const ride = activeRide || {};

    // Get the person being rated
    const ratedUid = isStudent ? ride.riderId : ride.studentId;
    if (!ratedUid) { document.getElementById("rating-modal").classList.add("hidden"); return; }

    // Update ride doc
    const ratingField = isStudent ? "studentRating" : "riderRating";
    await updateDoc(doc(db, "rides", rideId), { [ratingField]: stars });

    // Update user's rating
    const userSnap = await getDoc(doc(db, "users", ratedUid));
    if (userSnap.exists()) {
      const u = userSnap.data();
      const newTotal    = (u.totalRatings || 0) + 1;
      const newRating   = (u.rating || 0) + stars;
      await updateDoc(doc(db, "users", ratedUid), { rating: newRating, totalRatings: newTotal });
    }

    document.getElementById("rating-modal").classList.add("hidden");
    showToast("⭐ Rating submitted! Thanks.");
  } catch (err) {
    showToast("Error: " + err.message);
  }
}

// ══════════════════════════════════════════
// PAYMENT CHIPS
// ══════════════════════════════════════════
document.querySelectorAll(".pay-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".pay-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const isUPI = chip.dataset.pay === "upi";
    document.getElementById("upi-info").classList.toggle("hidden", !isUPI);
    if (activeRideId) {
      const { db, doc, updateDoc } = window._firebase;
      updateDoc(doc(db, "rides", activeRideId), { paymentMethod: chip.dataset.pay }).catch(() => {});
    }
  });
});

// ══════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════
async function addNotification(uid, title, body) {
  if (!uid) return;
  try {
    const { db, collection, addDoc } = window._firebase;
    await addDoc(collection(db, "notifications", uid, "items"), {
      title, body, read: false, ts: Date.now()
    });
  } catch {}
}

function listenNotifications() {
  if (notifUnsub) notifUnsub();
  const { db, collection, onSnapshot, query, orderBy, limit } = window._firebase;
  const q = query(
    collection(db, "notifications", currentUser.uid, "items"),
    orderBy("ts", "desc"),
    limit(30)
  );
  notifUnsub = onSnapshot(q, snap => {
    const list = document.getElementById("notif-list");
    let unread = 0;
    list.innerHTML = "";
    if (snap.empty) {
      list.innerHTML = `<div class="empty-state"><p>No notifications</p></div>`;
      updateNotifBadge(0);
      return;
    }
    snap.forEach(d => {
      const n = d.data();
      if (!n.read) unread++;
      const el = document.createElement("div");
      el.className = "notif-item" + (!n.read ? " unread" : "");
      el.innerHTML = `
        <div class="notif-icon">🔔</div>
        <div class="notif-body">
          <div class="notif-text"><strong>${escHtml(n.title)}</strong> ${escHtml(n.body)}</div>
          <div class="notif-time">${timeAgo(n.ts)}</div>
        </div>`;
      el.addEventListener("click", () => {
        const { db, doc, updateDoc } = window._firebase;
        updateDoc(doc(db, "notifications", currentUser.uid, "items", d.id), { read: true }).catch(() => {});
        el.classList.remove("unread");
      });
      list.appendChild(el);
    });
    updateNotifBadge(unread);
  });
}

function updateNotifBadge(count) {
  const badge = document.getElementById("notif-badge");
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

// ══════════════════════════════════════════
// RIDE HISTORY
// ══════════════════════════════════════════
function loadRideHistory() {
  if (histUnsub) histUnsub();
  const { db, collection, onSnapshot, query, where, orderBy, limit } = window._firebase;
  const field = myProfile.role === "student" ? "studentId" : "riderId";
  const q = query(
    collection(db, "rides"),
    where(field, "==", currentUser.uid),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  histUnsub = onSnapshot(q, snap => {
    const list = document.getElementById("ride-history-list");
    list.innerHTML = "";
    if (snap.empty) {
      list.innerHTML = `<div class="empty-state"><p>No rides yet</p></div>`;
      return;
    }
    snap.forEach(d => {
      const r  = d.data();
      const ts = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0);
      const other = myProfile.role === "student" ? r.riderName : r.studentName;
      const chipClass = r.status === "completed" ? "chip-completed"
        : r.status === "cancelled" ? "chip-cancelled"
        : r.status === "searching" ? "chip-searching" : "chip-active";

      const el = document.createElement("div");
      el.className = "ride-card";
      el.innerHTML = `
        <div class="ride-card-header">
          <div>
            <div class="ride-card-title">${escHtml(r.tuition || "—")}</div>
            <div class="ride-card-meta">
              ${other ? `<span>${escHtml(other)}</span>` : ""}
              <span>₹${r.fare || "—"}</span>
              <span>Zone ${r.zone || "—"}</span>
            </div>
          </div>
          <div>
            <div class="ride-status-chip ${chipClass}">${r.status}</div>
            <div class="ride-card-date">${ts.toLocaleDateString()}</div>
          </div>
        </div>`;
      list.appendChild(el);
    });
  }, () => {});
}

// ══════════════════════════════════════════
// APP EVENT BINDINGS
// ══════════════════════════════════════════
function bindAppEvents() {
  // Tab navigation
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view-content").forEach(v => {
        v.classList.remove("active");
        v.classList.add("hidden");
      });
      const target = document.getElementById("view-" + view);
      if (target) { target.classList.remove("hidden"); target.classList.add("active"); }
      if (view === "map" && map) setTimeout(() => map.invalidateSize(), 100);
    });
  });

  // Notif button → go to notifs tab
  document.getElementById("notif-btn").addEventListener("click", () => {
    document.querySelector('[data-view="notifs"]').click();
  });

  // Profile nav button → go to profile tab
  document.getElementById("profile-nav-btn").addEventListener("click", () => {
    document.querySelector('[data-view="profile"]').click();
  });

  // Sign out
  document.getElementById("signout-btn").addEventListener("click", async () => {
    cleanup();
    const { auth, signOut, db, doc, setDoc } = window._firebase;
    try {
      await setDoc(doc(db, "locations", currentUser.uid), { online: false, ts: Date.now() }, { merge: true });
    } catch {}
    await signOut(auth);
  });

  // Edit profile
  document.getElementById("edit-profile-btn").addEventListener("click", () => {
    openEditProfileModal();
  });
  document.getElementById("edit-profile-close").addEventListener("click", () => {
    document.getElementById("edit-profile-modal").classList.add("hidden");
  });
  document.getElementById("update-profile-btn").addEventListener("click", updateProfile);
}

function openEditProfileModal() {
  document.getElementById("ep-name").value       = myProfile.name || "";
  document.getElementById("ep-phone").value      = myProfile.phone || "";
  document.getElementById("ep-whatsapp").value   = myProfile.whatsapp || "";
  document.getElementById("ep-tuition").value    = myProfile.tuition || "";
  document.getElementById("ep-zone").value       = myProfile.zone || "A";
  document.getElementById("ep-time").value       = myProfile.time || "";
  document.getElementById("ep-vehicle").value    = myProfile.vehicle || "";
  document.getElementById("ep-vehicle-no").value = myProfile.vehicleNo || "";
  document.getElementById("edit-profile-modal").classList.remove("hidden");
}

async function updateProfile() {
  const name      = document.getElementById("ep-name").value.trim();
  const phone     = document.getElementById("ep-phone").value.trim();
  const whatsapp  = document.getElementById("ep-whatsapp").value.trim() || phone;
  const tuition   = document.getElementById("ep-tuition").value.trim();
  const zone      = document.getElementById("ep-zone").value;
  const time      = document.getElementById("ep-time").value;
  const vehicle   = document.getElementById("ep-vehicle").value.trim();
  const vehicleNo = document.getElementById("ep-vehicle-no").value.trim();
  if (!name || !phone || !tuition) { showToast("Please fill required fields"); return; }
  try {
    const { db, doc, updateDoc } = window._firebase;
    const update = { name, phone, whatsapp, tuition, zone, time, vehicle, vehicleNo };
    await updateDoc(doc(db, "users", currentUser.uid), update);
    myProfile = { ...myProfile, ...update };
    renderProfileUI();
    document.getElementById("edit-profile-modal").classList.add("hidden");
    showToast("✅ Profile updated!");
  } catch (err) {
    showToast("Error: " + err.message);
  }
}

// ══════════════════════════════════════════
// CLEANUP (sign out / unmount)
// ══════════════════════════════════════════
function cleanup() {
  if (watchId) navigator.geolocation.clearWatch(watchId);
  clearInterval(locInterval);
  clearInterval(etaInterval);
  clearInterval(reqTimer);
  [rideUnsub, searchUnsub, histUnsub, notifUnsub, nearbyUnsub].forEach(u => u && u());
  rideUnsub = searchUnsub = histUnsub = notifUnsub = nearbyUnsub = null;
  activeRideId = null; activeRide = null; isOnline = false;
  if (map) { map.remove(); map = null; }
  Object.keys(markers).forEach(k => delete markers[k]);
}

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function escHtml(s) {
  if (!s) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function timeAgo(ts) {
  if (!ts) return "";
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return Math.floor(sec/60) + "m ago";
  if (sec < 86400) return Math.floor(sec/3600) + "h ago";
  return Math.floor(sec/86400) + "d ago";
}
