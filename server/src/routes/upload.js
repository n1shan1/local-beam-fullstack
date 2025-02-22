// src/routes/upload.js
import { Router } from "express";
import bodyParser from "body-parser";
import filenamify from "filenamify";
import pMap from "p-map";
import { join } from "path";

import { asyncHandler } from "../middleware/error.js";
import { getFileAbsPath, pathExists } from "../utils/path.js";
import { createUploadMiddleware } from "../middleware/upload.js";

const router = Router();

router.post(
  "/",
  bodyParser.json(),
  asyncHandler(async (req, res) => {
    const uploadDirPathIn = req.query["path"] || "/";
    const uploadDirPath = await getFileAbsPath(
      uploadDirPathIn,
      req.app.locals.sharedPath
    );

    const form = createUploadMiddleware(
      uploadDirPath,
      req.app.locals.maxUploadSize
    );

    form.parse(req, async (err, _fields, { files: filesIn }) => {
      if (err) {
        console.error("Upload failed", err);
        res.status(400).send({ error: { message: err.message } });
        return;
      }

      if (filesIn) {
        const files = Array.isArray(filesIn) ? filesIn : [filesIn];
        console.log("Uploaded files to", uploadDirPath);
        files.forEach((f) =>
          console.log(f.originalFilename, `(${f.size} bytes)`)
        );

        await pMap(
          files,
          async (file) => {
            try {
              const targetPath = join(
                uploadDirPath,
                filenamify(file.originalFilename || "file", { maxLength: 255 })
              );
              if (!(await pathExists(targetPath)))
                await fs.rename(file.filepath, targetPath);
            } catch (err2) {
              console.error(`Failed to rename ${file.originalFilename}`, err2);
            }
          },
          { concurrency: 10 }
        );
      }
      res.end();
    });
  })
);

export default router;
