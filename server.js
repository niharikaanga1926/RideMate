const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

const usersFile = path.join(__dirname, "users.json");

// --- User Management ---
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf-8");
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Signup
app.post("/signup", (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password)
    return res.json({ success: false, message: "All fields required" });

  let users = readUsers();
  if (users.find((u) => u.phone === phone))
    return res.json({ success: false, message: "User already exists" });

  users.push({ name, phone, password });
  saveUsers(users);
  res.json({ success: true, message: "Signup successful!" });
});

// Login
app.post("/login", (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password)
    return res.json({ success: false, message: "All fields required" });

  let users = readUsers();
  const user = users.find((u) => u.phone === phone);
  if (!user) return res.json({ success: false, message: "User not found" });
  if (user.password !== password)
    return res.json({ success: false, message: "Invalid password" });

  res.json({ success: true, message: "Login successful!", user });
});

// --- Rides ---
const vehicles = {
  Auto: { capacity: 3 },
  "Electric Auto": { capacity: 3 },
  Car: { capacity: 4 },
};

const names = ["Ravi", "Aisha", "Kumar", "Meena", "John"];
const phones = [
  "9876543210",
  "8765432109",
  "7654321098",
  "6543210987",
  "9123456780",
];
const conditions = ["Good", "Very Good", "Excellent"];

function getDistance() {
  return Math.floor(Math.random() * 10) + 3;
}

// Generate rides including Electric Auto
function generateRides(vehicleType) {
  const rides = [];
  for (let i = 0; i < 5; i++) {
    const dist = getDistance();
    const v = vehicles[vehicleType];

    // For electric auto, add random charge 20–100%
    let charge = vehicleType === "Electric Auto" ? Math.floor(Math.random() * 81) + 20 : undefined;

    rides.push({
      driver: names[Math.floor(Math.random() * names.length)],
      phone: phones[Math.floor(Math.random() * phones.length)],
      vehicleNo:
        vehicleType === "Electric Auto"
          ? `EV09EA${1000 + i}`
          : vehicleType === "Auto"
          ? `AP09AU${1000 + i}`
          : `AP09CA${2000 + i}`,
      type: vehicleType,
      rating: (Math.random() * 2 + 3).toFixed(1),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      distance: dist,
      eta: Math.floor(dist / 0.5),
      passengers: 0,
      capacity: v.capacity,
      fare:
        vehicleType === "Electric Auto"
          ? 15 + 6 * dist
          : vehicleType === "Auto"
          ? 15 + 6 * dist
          : 40 + 10 * dist,
      charge,
      maxDistance: vehicleType === "Electric Auto" ? Math.floor(charge * 0.5) : undefined,
    });
  }
  return rides;
}

let activeRides = [];
let sharedRides = [];

// Find rides (regular + shared)
app.post("/findRides", (req, res) => {
  const { pickup, drop, vehicleType } = req.body;
  if (!pickup || !drop)
    return res.json({ success: false, message: "Pickup and drop required" });

  activeRides = generateRides(vehicleType);

  const ridesToSend = activeRides.concat(
    sharedRides.filter((r) => r.type === vehicleType)
  );

  res.json({ success: true, rides: ridesToSend });
});

// Book ride
app.post("/bookRide", (req, res) => {
  const { rideIndex } = req.body;
  const combinedRides = activeRides.concat(sharedRides);
  if (rideIndex === undefined || !combinedRides[rideIndex])
    return res.json({ success: false, message: "Ride not found" });

  const ride = combinedRides[rideIndex];

  // Restrict booking if Electric Auto charge <20
  if (ride.type === "Electric Auto" && ride.charge < 20)
    return res.json({ success: false, message: "Electric Auto charge too low" });

  if (ride.passengers >= ride.capacity)
    return res.json({ success: false, message: "Ride full" });

  ride.passengers++;
  res.json({ success: true, ride });
});

// Share ride
app.post("/shareRide", (req, res) => {
  const { pickup, drop, vehicleType, seats, owner, phone, charge } = req.body;
  if (!pickup || !drop || !vehicleType || !seats || !owner || !phone)
    return res.json({ success: false, message: "All fields required" });

  if (vehicleType === "Electric Auto" && charge < 20)
    return res.json({ success: false, message: "Electric Auto charge too low" });

  const dist = getDistance();
  const fare =
    vehicleType === "Electric Auto"
      ? 15 + 6 * dist
      : vehicleType === "Auto"
      ? 15 + 6 * dist
      : 40 + 10 * dist;

  const newRide = {
    owner,
    phone,
    pickup,
    drop,
    type: vehicleType,
    vehicleNo:
      vehicleType === "Electric Auto"
        ? `EV09EA${1000 + sharedRides.length}`
        : vehicleType === "Auto"
        ? `AP09AU${1000 + sharedRides.length}`
        : `AP09CA${2000 + sharedRides.length}`,
    passengers: 0,
    capacity: parseInt(seats),
    distance: dist,
    eta: Math.floor(dist / 0.5),
    fare,
    rating: (Math.random() * 2 + 3).toFixed(1),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    charge: vehicleType === "Electric Auto" ? charge : undefined,
    maxDistance: vehicleType === "Electric Auto" ? Math.floor(charge * 0.5) : undefined,
  };

  sharedRides.push(newRide);
  res.json({ success: true, message: "Ride shared successfully" });
});

// SOS
app.post("/sos", (req, res) => {
  const { ride } = req.body;
  console.log("🚨 SOS received for ride:", ride);
  res.json({ success: true, message: "🚨 SOS sent successfully! Help is on the way." });
});

// Default route to login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/login.html"));
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);

