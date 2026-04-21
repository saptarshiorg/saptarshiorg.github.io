# TuiGo — Setup & Deployment Guide

## 1. FIREBASE PROJECT SETUP

### Step 1 — Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project" → Name it **tuigo** → Continue
3. Disable Google Analytics (optional) → Create project

---

### Step 2 — Enable Google Authentication
1. In Firebase Console → Build → **Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Click **Google** → Enable toggle → Set project support email → Save

---

### Step 3 — Create Firestore Database
1. Build → **Firestore Database** → Create database
2. Select **Start in test mode** (for development)
3. Choose your region (e.g., asia-south1 for India)
4. Click Done

---

### Step 4 — Add Authorized Domain (IMPORTANT)
1. Authentication → Settings → **Authorized domains**
2. Add:
   - `localhost`
   - `YOUR_GITHUB_USERNAME.github.io`

---

### Step 5 — Get Firebase Config
1. Project settings (gear icon) → General
2. Scroll to "Your apps" → Add Web App (click `</>`)
3. Name it "TuiGo Web" → Register app
4. Copy the `firebaseConfig` object

---

### Step 6 — Paste Config into index.html
Open `index.html`, find this section (around line 170):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace with YOUR actual values from Firebase Console.

---

## 2. FIRESTORE SECURITY RULES

Go to **Firestore → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{userId} {
      allow read:  if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Locations: authenticated users can read all, write only their own
    match /locations/{userId} {
      allow read:  if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**.

---

## 3. DEPLOY ON GITHUB PAGES

### Step 1 — Create GitHub Repo
1. Go to https://github.com → New repository
2. Name: `tuigo`
3. Set to **Public**
4. Create repository

### Step 2 — Push Files
```bash
git init
git add .
git commit -m "Initial TuiGo MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tuigo.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Repository → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Save

Your app will be live at:
`https://YOUR_USERNAME.github.io/tuigo/`

---

## 4. TESTING TIPS

### Test locally:
- Open `index.html` via a local server (e.g. `npx serve .`) — Google OAuth requires a proper origin
- Click "Continue with Google" → sign in with any Google account
- Complete your profile → app loads with live map

### Test on GitHub Pages:
- Push code, enable Pages, visit your `github.io` URL
- Make sure the domain is added to Firebase Authorized Domains

---

## 5. FILE STRUCTURE

```
tuigo/
├── index.html      ← Main app + Firebase init
├── style.css       ← All styles
├── app.js          ← All logic
└── SETUP.md        ← This guide
```

---

## 6. FEATURE SUMMARY

| Feature | Status |
|---|---|
| Google Sign-In Auth | ✅ Firebase Google OAuth |
| User Profile (name, tuition, zone, time) | ✅ Firestore |
| Live Location every 7s | ✅ Geolocation + Firestore |
| Real-time Map | ✅ Leaflet + onSnapshot |
| No duplicate markers | ✅ Marker map keyed by userId |
| "I'm Going" toggle | ✅ status field in Firestore |
| Same tuition → FREE (green) | ✅ Matching logic |
| Within 1km → ₹10 (yellow) | ✅ Haversine formula |
| Others → blue markers | ✅ |
| Haversine distance | ✅ JS implementation |
| Email button | ✅ mailto: link with Google email |
| Message button | ✅ mailto: compose link |
| Student list with distance | ✅ Sorted by distance |
| Filter by Zone | ✅ A/B/C zones |
| Filter by Tuition | ✅ Text search |
| Filter by Match type | ✅ same/route/other |
| Mobile-first responsive | ✅ |
| No backend server needed | ✅ Serverless / GitHub Pages |

---

## 7. SCALING NOTES

- Firestore `onSnapshot` efficiently handles 50+ concurrent users
- Location writes are rate-limited to every 7 seconds per user
- All filtering is done client-side after Firestore load
- For 200+ users, add a geohash-based Firestore query to limit reads

---

## 8. TROUBLESHOOTING

**Google sign-in popup blocked?**
- Allow popups for your domain in browser settings
- On mobile, the popup may open as a new tab — this is normal

**"auth/unauthorized-domain" error?**
- Add your domain to Firebase Auth → Settings → Authorized Domains

**Map not showing?**
- Check browser console for CSP errors
- Ensure Leaflet CDN loads (check internet)

**Location not updating?**
- Allow location permission in browser
- On iOS Safari, enable location under Settings → Safari

**"auth/configuration-not-found"?**
- Confirm Google Sign-In is enabled in Firebase Auth → Sign-in method

**Firestore permission denied?**
- Check Firestore Rules are published correctly
