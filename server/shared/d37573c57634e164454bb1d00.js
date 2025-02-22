// src/utils/file.js
import archiver from "archiver";
import { pipeline } from "stream/promises";
import contentDisposition from "content-disposition";
import { basename } from "path";
import { createReadStream } from "fs";

export const createZipArchive = (compressionLevel) =>
  archiver("zip", { zlib: { level: compressionLevel } });

export const serveDirZip = async (filePath, res, zipCompressionLevel) => {
  const archive = createZipArchive(zipCompressionLevel);

  res.writeHead(200, {
    "Content-Type": "application/zip",
    "Content-disposition": contentDisposition(`${basename(filePath)}.zip`),
  });

  const promise = pipeline(archive, res);
  archive.directory(filePath, basename(filePath));
  archive.finalize();
  await promise;
};
