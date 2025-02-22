import { Router } from "express";
import { join } from "path";
import pMap from "p-map";
import { promises as fs } from "fs";
import { asyncHandler } from "../middleware/error.js";
import { getFileAbsPath } from "../utils/path.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const browseRelPath = req.query["p"] || "/";
    if (typeof browseRelPath !== "string") throw new Error("Invalid path");

    const browseAbsPath = await getFileAbsPath(
      browseRelPath,
      req.app.locals.sharedPath
    );

    let readdirEntries = await fs.readdir(browseAbsPath, {
      withFileTypes: true,
    });
    readdirEntries.sort((a, b) =>
      new Intl.Collator(undefined, { numeric: true }).compare(a.name, b.name)
    );

    const entries = (
      await pMap(
        readdirEntries,
        async (entry) => {
          try {
            const entryRelPath = join(browseRelPath, entry.name);
            const entryAbsPath = join(browseAbsPath, entry.name);
            const entryRealPath = await fs.realpath(entryAbsPath);

            if (!entryRealPath.startsWith(req.app.locals.sharedPath)) {
              console.warn(
                "Ignoring symlink pointing outside shared path",
                entryRealPath
              );
              return [];
            }

            const stat = await fs.lstat(entryRealPath);
            return [
              {
                path: entryRelPath,
                isDir: stat.isDirectory(),
                fileName: entry.name,
              },
            ];
          } catch (err) {
            console.warn(err.message);
            return [];
          }
        },
        { concurrency: 10 }
      )
    ).flat();

    res.send({
      files: [
        { path: join(browseRelPath, ".."), fileName: "..", isDir: true },
        ...entries,
      ],
      cwd: browseRelPath,
      sharedPath: req.app.locals.sharedPath,
    });
  })
);

export default router;
