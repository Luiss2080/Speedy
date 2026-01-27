const { spawn, exec } = require("child_process");
const os = require("os");
const path = require("path");

// 1. Get Local IP (IPv4, not internal, prefers Wi-Fi/Ethernet)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let preferredIP = "";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4
      if (iface.family === "IPv4" && !iface.internal) {
        // Prefer addresses that look like standard local ones (192.168.x.x or 10.x.x.x or 172.x.x.x)
        // Over VM adapters which might be present.
        // Simple heuristic: If we don't have one yet, take it.
        // If we have one, and this one is 'Wi-Fi' or 'Ethernet', take priority.

        if (!preferredIP) {
          preferredIP = iface.address;
        } else if (
          name.toLowerCase().includes("wi-fi") ||
          name.toLowerCase().includes("ethernet")
        ) {
          preferredIP = iface.address;
        }
      }
    }
  }
  return preferredIP || "127.0.0.1";
}

const localIP = getLocalIP();
console.log(
  `\x1b[32m[Auto-Start]\x1b[0m Detected Local IP: \x1b[36m${localIP}\x1b[0m`,
);

// 2. Start Backend
const backendPath = path.join(__dirname, "backend");
console.log(
  `\x1b[32m[Auto-Start]\x1b[0m Starting Backend Server in new window...`,
);

// Windows: Use 'start' command to open new terminal windows
// We use 'cmd /c' to execute and keep window open if possible or just run 'node server.js'
exec(
  `start cmd /k "cd /d ${backendPath} && echo Starting Backend on ${localIP}... && npm start"`,
  (err) => {
    if (err) console.error("Failed to start backend:", err);
  },
);

// 3. Start Frontend (Expo)
// We set REACT_NATIVE_PACKAGER_HOSTNAME to the detected IP
console.log(
  `\x1b[32m[Auto-Start]\x1b[0m Starting Expo Frontend with IP config...`,
);

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: localIP,
  EXPO_DEVTOOLS_LISTEN_ADDRESS: localIP,
};

exec(
  `start cmd /k "echo Setting Expo IP to ${localIP}... && set REACT_NATIVE_PACKAGER_HOSTNAME=${localIP} && npm start"`,
  { env: env },
  (err) => {
    if (err) console.error("Failed to start frontend:", err);
  },
);

console.log(
  `\x1b[32m[Auto-Start]\x1b[0m Services launching. Check the new terminal windows!`,
);
