// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const USERS_FILE = path.join(__dirname, "users.json");
const STATE_FILE = path.join(__dirname, "state.json");

function ensureUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
  }
}

function loadUsers() {
  ensureUsersFile();

  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8").trim();
    if (!raw || raw.length === 0) {
      fs.writeFileSync(USERS_FILE, "[]", "utf8");
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Cannot read users.json:", err);
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
    return [];
  }
}

function saveUsers(usersArray) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(usersArray, null, 2), "utf8");
}

function loadState() {
  const defaultState = { activeUser: null, waterLeftLiters: 10.0 };

  try {
    if (!fs.existsSync(STATE_FILE)) {
      fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2), "utf8");
      return { ...defaultState };
    }

    const raw = fs.readFileSync(STATE_FILE, "utf8").trim();
    if (!raw) return { ...defaultState };

    const parsed = JSON.parse(raw);
    const activeUser =
      parsed.activeUser && parsed.activeUser.username
        ? {
            username: String(parsed.activeUser.username),
            totalTodayMl: Number(Math.round(parsed.activeUser.totalTodayMl || 0)),
          }
        : null;

    const waterLeftLiters =
      typeof parsed.waterLeftLiters === "number" ? parsed.waterLeftLiters : 10.0;

    return { activeUser, waterLeftLiters };
  } catch (err) {
    console.error("Cannot read state.json:", err);
    fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2), "utf8");
    return { ...defaultState };
  }
}

function saveState() {
  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify({ activeUser, waterLeftLiters }, null, 2),
    "utf8"
  );
}

let users = loadUsers();
let { activeUser, waterLeftLiters } = loadState();

// REGISTER
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "username/password required" });

  const exists = users.find((u) => u.username === username);
  if (exists) return res.status(409).json({ message: "User already exists" });

  const newUser = { username, password, totalTodayMl: 0 };
  users.push(newUser);
  saveUsers(users);

  activeUser = { username: newUser.username, totalTodayMl: 0 };
  saveState();

  res.json({ message: "Registered & logged in", user: activeUser });
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const found = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!found)
    return res.status(401).json({ message: "Username and/or password incorrect" });

  activeUser = { username: found.username, totalTodayMl: found.totalTodayMl };
  saveState();

  console.log("[LOGIN]", activeUser);
  res.json({ message: "Login success", user: activeUser });
});

// LOGOUT
app.post("/api/logout", (req, res) => {
  activeUser = null;
  saveState();
  res.json({ message: "Logged out" });
});

// IOT STATUS
app.get("/api/iot/status", (req, res) => {
  if (!activeUser) {
    return res.json({ needLogin: true, line1: "Authentication", line2: "Please login..." });
  }

  res.json({
    needLogin: false,
    line1: `Left: ${waterLeftLiters.toFixed(1)}L`,
    line2: `${activeUser.username} : ${activeUser.totalTodayMl}ml`,
  });
});

// DEVICE UPDATE
app.post("/api/device/update", (req, res) => {
  const { usedMlPerTick } = req.body;
  const usedMl = Number(usedMlPerTick || 0);

  if (waterLeftLiters <= 0) {
    waterLeftLiters = 0;
    saveState();
    return res.json({
      message: "No water left",
      dry: true,
      waterLeftLiters,
      activeUser,
    });
  }

  const availableMl = Math.round(waterLeftLiters * 1000.0);
  const actualUsedMl = Math.min(usedMl, availableMl);

  waterLeftLiters -= actualUsedMl / 1000.0;
  if (waterLeftLiters < 0) waterLeftLiters = 0;

  if (activeUser && actualUsedMl > 0) {
    activeUser.totalTodayMl += actualUsedMl;

    const idx = users.findIndex(
      (u) => u.username === activeUser.username
    );
    if (idx !== -1) {
      users[idx].totalTodayMl = activeUser.totalTodayMl;
      saveUsers(users);
    }
  }

  saveState();

  return res.json({
    message: "Updated",
    dry: waterLeftLiters <= 0,
    waterLeftLiters,
    activeUser,
  });
});
// DEVICE RESET
app.post("/api/device/reset", (req, res) => {
  console.log("[RESET] request received");
  waterLeftLiters = 10.0;
  activeUser = null;

  saveState();
  console.log("[RESET] after soft reset =", { waterLeftLiters, activeUser });

  res.json({ message: "Soft reset done", waterLeftLiters, activeUser });
});

// DASHBOARD DATA
app.get("/api/dashboard", (req, res) => {
  res.json({
    waterLeftLiters,
    activeUser,
    users: users.map((u) => ({
      username: u.username,
      totalTodayMl: u.totalTodayMl,
    })),
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
