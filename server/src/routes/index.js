// src/routes/index.js
import { Router } from "express";
import uploadRouter from "./upload.js";
import downloadRouter from "./download.js";
import browseRouter from "./browse.js";
import clipboardRouter from "./clipboard.js";
import zipRouter from "./zip.js";
import urlRouter from "./urlRouter.js";
const router = Router();

router.use("/upload", uploadRouter);
router.use("/download", downloadRouter);
router.use("/browse", browseRouter);
router.use("/clipboard", clipboardRouter);
router.use("/zip-files", zipRouter);
router.use("/url", urlRouter);

export default router;
