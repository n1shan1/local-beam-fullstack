// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { resolve } from "path";

import { config } from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";

export function createApp({
  sharedPath: sharedPathIn,
  port = config.defaultPort,
  maxUploadSize = config.defaultMaxUploadSize,
  zipCompressionLevel = config.defaultZipLevel,
}) {
  const app = express();
  const sharedPath = sharedPathIn ? resolve(sharedPathIn) : process.cwd();

  // Store config in app.locals for access in routes
  app.locals.sharedPath = sharedPath;
  app.locals.maxUploadSize = maxUploadSize;
  app.locals.zipCompressionLevel = zipCompressionLevel;

  // Middleware
  dotenv.config();
  app.use(cors()); // Enable CORS
  if (config.debug) app.use(morgan("dev")); // Log requests in debug mode
  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

  // Routes
  app.use("/api", routes);

  // Error handling
  app.use(errorHandler);

  return app;
}
