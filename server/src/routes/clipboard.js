// src/routes/clipboard.js
import { Router } from "express";
import bodyParser from "body-parser";
import clipboardy from "clipboardy";
import { join } from "path";
import { promises as fs } from "fs";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

router.post(
  "/paste",
  bodyParser.urlencoded({ extended: false }),
  asyncHandler(async (req, res) => {
    if (req.body.saveAsFile === "true") {
      await fs.writeFile(
        join(req.app.locals.sharedPath, `client-clipboard-${Date.now()}.txt`),
        req.body.clipboard
      );
    } else {
      await clipboardy.write(req.body.clipboard);
    }
    res.end();
  })
);

router.post(
  "/copy",
  asyncHandler(async (_req, res) => {
    res.send(await clipboardy.read());
  })
);

export default router;
