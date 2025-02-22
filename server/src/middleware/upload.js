import Formidable from "formidable";
import { config } from "../config/index.js";

export const createUploadMiddleware = (uploadDir, maxUploadSize) => {
  return Formidable({
    keepExtensions: true,
    uploadDir,
    maxFileSize: maxUploadSize,
    maxFields: config.maxFields,
  });
};
