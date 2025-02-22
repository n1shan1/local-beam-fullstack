// src/config/index.js
export const config = {
  maxFields: 1000,
  debug: false,
  defaultPort: 8080,
  defaultMaxUploadSize: 16 * 1024 * 1024 * 1024, // 16GB
  defaultZipLevel: 0,
};

// src/utils/path.js
import { join, relative, resolve } from "path";
import { promises as fs } from "fs";
import isPathInside from "is-path-inside";

export const pathExists = async (path) => {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

export const arePathsEqual = (path1, path2) => relative(path1, path2) === "";

export const getFileAbsPath = async (relPath, sharedPath) => {
  if (relPath == null) return sharedPath;
  const absPath = join(sharedPath, join("/", relPath));
  const realPath = await fs.realpath(absPath);
  if (
    !(isPathInside(realPath, sharedPath) || arePathsEqual(realPath, sharedPath))
  ) {
    throw new Error(
      `Path must be within shared path ${realPath} ${sharedPath}`
    );
  }
  return realPath;
};
