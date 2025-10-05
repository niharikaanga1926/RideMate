🚗 AutoMitra

A full-stack ride-sharing platform built with Node.js, Express, and Leaflet.js that connects drivers and passengers through real-time location tracking and efficient route sharing.

📘 Overview

AutoMitra is a smart, web-based ride-sharing application designed to simplify and optimize daily commuting.
The platform enables drivers to publish available rides and passengers to search, book, and join them conveniently.
By integrating Leaflet.js maps and the Geolocation API, AutoMitra provides real-time location tracking, ensuring efficient ride coordination and promoting eco-friendly travel.

🌟 Key Features

🗺️ Interactive Maps – Real-time location tracking using Leaflet.js and Geolocation API

🚘 Ride Management – Drivers can create and manage available rides

🔍 Ride Search – Passengers can find nearby rides based on route and time

💾 Local Storage Integration – Stores temporary ride and user information locally

🔐 Express Backend APIs – Lightweight, fast, and scalable Node.js server

🌍 CORS Enabled – Allows seamless interaction between frontend and backend

⚡ Socket.io Ready – Supports real-time features such as live ride updates (optional)

🧰 Technology Stack
Component	Technology / Library	Purpose
Frontend	HTML, CSS, JavaScript	Structure, styling, interactivity
Frontend	Leaflet.js	Map rendering & ride tracking
Frontend	Geolocation API	Retrieve current user location
Frontend	localStorage	Temporary ride data storage
Backend	Node.js	Server runtime environment
Backend	Express.js	API development framework
Backend	CORS	Enable cross-origin requests
Backend	FS & JSON	File-based user data handling
Assets	auto.png	Background and branding image
⚙️ Installation & Setup

Follow the steps below to run AutoMitra locally:

# 1. Create project directory
mkdir desktop
cd desktop

# 2. Initialize project
mkdir AutoMitraApp
cd AutoMitraApp

# 3. Initialize Node.js
npm init -y

# 4. Install required dependencies
npm install express cors
npm install socket.io  # optional for live updates

# 5. Start the server
node server.js


Once setup is complete, open your browser and navigate to:
👉 http://localhost:5000

🧩 Project Structure
AutoMitra/
│
├── server.js               # Express server configuration
├── users.json              # Temporary user data
├── auto.png                # Background/branding image
├── /frontend
│   ├── index.html          # Main user interface
│   ├── style.css           # Styling and layout
│   └── script.js           # Core logic, map, geolocation
└── package.json            # Node.js metadata and dependencies

💡 How It Works

Users access AutoMitra and share their current location.

Drivers can post rides including route, timing, and seat availability.

Passengers can search and join rides based on their preferences.

Temporary ride data is stored locally using localStorage.

Backend APIs manage ride details and communication between users.

🚀 Future Enhancements

📍 Integration with MongoDB or MySQL for persistent storage

🔐 Secure authentication using JWT

💬 Real-time driver–passenger chat system

💳 Online payment and booking confirmation

🤖 AI-based route matching for optimized ride pairing
