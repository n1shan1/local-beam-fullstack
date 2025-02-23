// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { resolve, join } from "path";
import { config } from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { returnURL } from "./index.js";

// Load environment variables early
dotenv.config();

// Define CORS options, using environment variables to allow flexibility
const corsOptions = {
  origin: "*", // Comma-separated list of allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent across origins
  optionsSuccessStatus: 200, // For legacy browser support
};

export function createApp({
  sharedPath: sharedPathIn,
  port = config.defaultPort,
  maxUploadSize = config.defaultMaxUploadSize,
  zipCompressionLevel = config.defaultZipLevel,
}) {
  const app = express();

  const sharedPath = sharedPathIn ? resolve(sharedPathIn) : process.cwd();

  // Store configuration in app.locals for access in routes
  app.locals.sharedPath = sharedPath;
  app.locals.maxUploadSize = maxUploadSize;
  app.locals.zipCompressionLevel = zipCompressionLevel;

  // Middleware
  app.use(cors(corsOptions)); // Apply enhanced CORS settings
  if (config.debug) app.use(morgan("dev")); // Log requests in debug mode
  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
  app.use("/api", routes);

  const clientBuildPath = resolve(process.cwd(), "public");
  app.use(express.static(clientBuildPath));

  // For any route not handled by the API, serve index.html (typical for SPAs)
  app.get("*", (req, res) => {
    res.sendFile(join(clientBuildPath, "index.html"));
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export function createConfigApp() {
  const configApp = express();
  const url = returnURL();
  configApp.use(cors(corsOptions)); // Apply the same enhanced CORS settings here
  if (config.debug) configApp.use(morgan("dev")); // Log requests in debug mode
  configApp.use(express.json()); // Parse JSON request bodies
  configApp.use(express.urlencoded({ extended: true }));
  configApp.get("/config", (req, res) => {
    res.json({ url: returnURL() });
  });

  return configApp;
}
