const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json");

let waterLeft = 10000; // ml
let logs = [];

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  const raw = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(raw);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function addUser(username, password) {
  const users = loadUsers();
  const exists = users.find(u => u.username === username);
  if (exists) return false;
  users.push({ username, password });
  saveUsers(users);
  return true;
}

function checkUser(username, password) {
  const users = loadUsers();
  return users.find(u => u.username === username && u.password === password);
}

function consumeWater(username, usedMl) {
  if (usedMl < 0) usedMl = 0;
  waterLeft = Math.max(0, waterLeft - usedMl);
  logs.push({
    user: username || "anonymous",
    used: usedMl,
    time: new Date().toISOString(),
  });
  return { waterLeft, logs };
}

function resetWater() {
  waterLeft = 10000;
  logs = [];
  return { waterLeft, logs };
}

function summarizeUsagePerUser() {
  const usageMap = {};
  for (const entry of logs) {
    if (!usageMap[entry.user]) {
      usageMap[entry.user] = 0;
    }
    usageMap[entry.user] += entry.used;
  }
  return Object.entries(usageMap).map(([name, totalUsed]) => ({
    name,
    useWater: totalUsed, // ml
  }));
}

function getStatus() {
  return {
    waterLeft,
    logs,
    users: summarizeUsagePerUser(),
  };
}

module.exports = {
  addUser,
  checkUser,
  consumeWater,
  resetWater,
  getStatus,
};
