// src/index.js
import { createApp, createConfigApp } from "./app.js";
import qrcode from "qrcode-terminal";
import os from "os";

let CURRENT_URL = "";

function displayServerInfo(port) {
  const interfaces = os.networkInterfaces();
  console.log(interfaces);
  const urls = Object.values(interfaces)
    .flatMap((addresses) => addresses || [])
    .filter(
      ({ family, address }) => family === "IPv4" && address !== "127.0.0.1"
    )
    .map(({ address }) => `http://${address}:${port}/api`); //filter out ht 1p4v address and add port number to the address that is not IPv6

  if (urls.length === 0) return;

  console.log("Backend server is running. Access the API at:");
  urls.forEach((url) => {
    console.log("\nScan this QR code on your phone or enter", url, "\n");
    qrcode.generate(url);
  });
  CURRENT_URL = urls[0];
  if (urls.length > 1) {
    console.log(
      "Note that there are multiple QR codes above, one for each network interface. (scroll up)"
    );
  }
}

export function startServer(config, configData) {
  const app = createApp(config);
  const configApp = createConfigApp(configData);
  const server = app.listen(config.port, () => {
    console.log(`Sharing path: ${config.sharedPath}`);
    console.log(`Max upload size: ${config.maxUploadSize}`);
    console.log(`Server running on port ${config.port}`);
    displayServerInfo(config.port);
  });
  const configServer = configApp.listen(configData.port, () => {
    console.log(`Config server running on port ${configData.port}`);
  });
  return { server, configServer };
}

export const returnURL = () => {
  return CURRENT_URL;
};

// Start the server with default config
const config = {
  sharedPath: "./shared", // Directory to share files from
  port: 8080, // Port to run the backend server on
  maxUploadSize: "10MB", // Max file upload size
  zipCompressionLevel: 6, // ZIP compression level
};
const configData = {
  port: 8081,
};
startServer(config, configData);
