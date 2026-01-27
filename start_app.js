const { spawn } = require("child_process");
const os = require("os");
const path = require("path");

// 1. Get Local IP (IPv4, not internal, prefers Wi-Fi/Ethernet)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let preferredIP = "";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
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
  `\x1b[32m[Expo Helper]\x1b[0m Detected Local IP: \x1b[36m${localIP}\x1b[0m`,
);
console.log(
  `\x1b[32m[Expo Helper]\x1b[0m Launching Expo in current terminal...`,
);

// 2. Start Expo in current process with inherited STDIO (preserves QR code colors and interactivity)
const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: localIP,
  EXPO_DEVTOOLS_LISTEN_ADDRESS: localIP,
};

// Spawn 'npm start'
const expoProcess = spawn(
  /^win/.test(process.platform) ? "npm.cmd" : "npm",
  ["start"],
  {
    stdio: "inherit",
    env: env,
  },
);

expoProcess.on("close", (code) => {
  console.log(`Expo process exited with code ${code}`);
  process.exit(code);
});
