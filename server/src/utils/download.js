import { createReadStream } from "fs";
import { promises as fs } from "fs";
import { basename } from "path";
import parseRange from "range-parser";
import contentDisposition from "content-disposition";
import { pipeline } from "stream/promises";

export async function serveResumableFileDownload({
  filePath,
  range,
  res,
  forceDownload,
}) {
  if (forceDownload) {
    res.set("Content-disposition", contentDisposition(basename(filePath)));
  }

  const { size: fileSize } = await fs.stat(filePath);

  if (range) {
    const subranges = parseRange(fileSize, range);
    if (
      typeof subranges === "number" ||
      subranges.type !== "bytes" ||
      subranges.length !== 1
    ) {
      throw new Error("Invalid range request");
    }

    const { start, end } = subranges[0];
    const contentLength = end - start + 1;

    res.status(206).set({
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "application/octet-stream",
    });

    await pipeline(createReadStream(filePath, { start, end }), res);
  } else {
    res.set({
      "Content-Length": fileSize,
    });

    await pipeline(createReadStream(filePath), res);
  }
}
