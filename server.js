const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let waterLeft = 10000;
let logs = [];
let users = [];

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password required" });
  } else if (users.find((u) => u.username === username)) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  else{
    return res
      .status(400)
      .json({ success: false, message: "Username or password wrong!" });
  }

  users.push({ username, password });
  console.log("🆕 Registered user:", username);
  return res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  console.log("👤 User logged in:", username);
  return res.json({ success: true });
});

app.get("/api/status", (req, res) => {
  return res.json({
    waterLeft,
    users: users.map((user) => {
      const usedWater = logs
        .filter((log) => log.user === user.username)
        .reduce((acc, log) => acc + log.used, 0);
      return { name: user.username, useWater: usedWater };
    }),
  });
});

app.post("/api/device/update", (req, res) => {
  const { used, username } = req.body;

  waterLeft = Math.max(0, waterLeft - used);
  logs.push({ user: username || "anonymous", used, time: new Date() });

  const existingUser = users.find((u) => u.username === username);
  if (!existingUser) {
    users.push({ username, waterUsed: 0 });
  }

  res.json({ ok: true, waterLeft });
});

app.post("/api/device/reset", (req, res) => {
  waterLeft = 10000;
  logs = [];
  res.json({ ok: true });
});

// Endpoint Login
app.post("/api/login", (req, res) => {
  const { username } = req.body;
  res.json({ success: !!username });
});

app.post("/api/check-login", (req, res) => {
  const { username } = req.body;

  if (username) {
    return res.json({ success: true, username });
  }

  res.status(400).json({ success: false, message: "Not logged in" });
});

app.listen(3000, () => console.log("✅ Express server running on port 3000"));
