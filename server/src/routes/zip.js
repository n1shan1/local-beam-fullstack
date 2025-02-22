// src/routes/zip.js
import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { getFileAbsPath } from "../utils/path.js";
import { createZipArchive } from "../utils/file.js";
import { pipeline } from "stream/promises";
import contentDisposition from "content-disposition";
import pMap from "p-map";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const zipFileName = `${new Date()
      .toISOString()
      .replace(/^(\d+-\d+-\d+)T(\d+):(\d+):(\d+).*$/, "$1 $2.$3.$3")}.zip`;
    const { files: filesJson } = req.query;
    if (typeof filesJson !== "string")
      throw new Error("Invalid files parameter");

    const files = JSON.parse(filesJson);
    if (!Array.isArray(files)) throw new Error("Files must be an array");

    const archive = createZipArchive(req.app.locals.zipCompressionLevel);

    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-Disposition": contentDisposition(zipFileName),
    });

    const promise = pipeline(archive, res);

    await pMap(
      files,
      async (file) => {
        if (typeof file !== "string") throw new Error("Invalid file path");
        const absPath = await getFileAbsPath(file, req.app.locals.sharedPath);
        archive.file(absPath, { name: file });
      },
      { concurrency: 1 }
    );

    archive.finalize();
    await promise;
  })
);

export default router;
