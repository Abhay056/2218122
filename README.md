# URL Shortner Using React and Material UI

A fully client-side URL shortener built with React and Material UI. Shorten multiple URLs with optional custom shortcodes and expiration times. All data is stored in localStorage, and redirection/statistics are handled via React Router. All actions are logged using middleware (no console.log used).

---

## ✨ Features
🚀 Shorten up to 5 URLs at once

✏️ Optional custom shortcode and validity period (default: 30 minutes)

🧠 Unique shortcode generation (client-managed)

🔁 Client-side redirection using React Router

📊 Statistics page showing:

Original & shortened URLs

Creation & expiration times

Click count with timestamps

💾 Persistent data with localStorage

📋 Logging middleware for all key actions (no direct console logging)

---

## 📁 Project Structure

src/
├── App.jsx          // Main app logic, routing, pages & components
├── main.jsx         // Entry point, initializes React Router
└── logging.js       // Middleware for logging actions using environment variables

---

## 🌐 Deployment
This app is fully static and can be deployed to any static hosting service like:

GitHub Pages

Netlify

Vercel

Firebase Hosting

---

## 🧪 Future Enhancements
Custom domain support

Analytics dashboard (charts, device/browser info)

Password-protected links

QR code generation

---

### Commands to run
```
cd Frontend_Test_Submission && npm install
```
```
cd Logging_Middleware && npm install
```
```
cd Frontend_Test_Submission && npm install @mui/icons-material && react-router-dom
```
```
npm run dev
```