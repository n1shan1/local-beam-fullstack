// src/utils/getLocalIP.js
import os from "os";

export function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const interfaceName in nets) {
    for (const net of nets[interfaceName]) {
      // Select the first non-internal IPv4 address
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}
