// src/routes/download.js
import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { getFileAbsPath } from "../utils/path.js";
import { serveDirZip } from "../utils/file.js";
import { serveResumableFileDownload } from "../utils/download.js"; // Add this line
import { promises as fs } from "fs";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { f } = req.query;
    if (typeof f !== "string") throw new Error("Invalid file path");

    const filePath = await getFileAbsPath(f, req.app.locals.sharedPath);
    const forceDownload = req.query["forceDownload"] === "true";

    const lstat = await fs.lstat(filePath);
    if (lstat.isDirectory()) {
      await serveDirZip(filePath, res, req.app.locals.zipCompressionLevel);
    } else {
      const { range } = req.headers;
      await serveResumableFileDownload({ filePath, range, res, forceDownload });
    }
  })
);

export default router;
