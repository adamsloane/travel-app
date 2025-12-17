# Travel App V0

A local-first React travel app built for personal use and rapid iteration.

This project is intentionally **not validated** and **not production-ready** — the goal is momentum, learning, and building something I actually use.

---

## 🧭 What this is
- A multi-screen React app (Vite + React Router)
- Tailwind for styling
- Local-only data (no backend yet)
- Designed to grow later (Supabase / auth / sharing if desired)

---

## 🚀 Getting started (local)

### Run the app
```bash
cd ~/Desktop/travel-app
npm run dev
Open:

arduino
Copy code
http://localhost:5173/
🗂 Project structure (important)
powershell
Copy code
src/
├── App.jsx              # App shell + routing
├── main.jsx             # React bootstrap (don’t touch)
├── index.css            # Tailwind import
│
├── screens/             # Full pages / routes
│   ├── home.jsx
│   ├── trips.jsx
│   ├── trip.jsx
│   └── shared_itinerary.jsx
│
├── components/          # Reusable UI
│   └── nav.jsx
│
└── data/                # Local data / mocks
    └── trips.js
Rule of thumb:

screens = pages

components = reusable UI

data = temporary local data (will become localStorage / backend later)

🧪 Dev home screen
The homepage (/) acts as a dev launchpad with direct links to all screens.
This is intentional for fast iteration and demos.

🎨 Styling
Tailwind is fully configured

If styles disappear, check:

vite.config.js includes @tailwindcss/vite

src/index.css contains:

css
Copy code
@import "tailwindcss";
🔀 Navigation
Uses react-router-dom

Routes live in App.jsx

Import paths must match filenames exactly (case + underscores matter)

💾 Version control (very important)
Save a checkpoint
bash
Copy code
git add .
git commit -m "Describe change"
git push
Commit whenever:

Something works

You’re about to try something risky

You’d be annoyed if you lost progress

Undo uncommitted changes
bash
Copy code
git checkout -- path/to/file.jsx
🔐 GitHub auth note
Pushing uses a GitHub Personal Access Token, not a password.
If prompted again, paste the token as the password.

🧠 Guiding principles
Build first, validate later

Optimize for momentum

V0 should feel real, not perfect

Personal usefulness > market proof
