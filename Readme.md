Here’s the **complete documentation** for your file-sharing backend application. You can save this as a text file (e.g., `documentation.txt`) for future reference.

---

# **File-Sharing Backend Documentation**

This backend application is built using **Node.js** and **Express**. It provides APIs for file sharing, including features like file browsing, upload/download, clipboard sync, and ZIP creation. Below is an in-depth explanation of the codebase.

---

## **Table of Contents**

1. **Project Structure**
2. **Configuration**
3. **Middleware**
4. **Routes**
5. **Utilities**
6. **Error Handling**
7. **Security Measures**
8. **Testing with Postman**
9. **Future Improvements**

---

## **1. Project Structure**

The project is organized as follows:

```
src/
├── config/            # Configuration files
│   └── index.js
├── middleware/        # Custom middleware
│   ├── error.js
│   └── upload.js
├── routes/            # API routes
│   ├── browse.js
│   ├── clipboard.js
│   ├── download.js
│   ├── index.js
│   ├── upload.js
│   └── zip.js
├── utils/             # Utility functions
│   ├── file.js
│   ├── path.js
│   └── download.js
└── index.js           # Entry point
```

---

## **2. Configuration**

### **`config/index.js`**

- **Purpose**: Centralizes app configuration.
- **Key Settings**:
  - `defaultPort`: Server port (default: `8080`).
  - `defaultMaxUploadSize`: Max allowed file upload size (default: 16GB).
  - `defaultZipLevel`: ZIP compression level (default: `0`, no compression).
  - `maxFields`: Max number of fields in multipart forms (default: `1000`).
  - `debug`: Enables debug logging (default: `false`).

---

## **3. Middleware**

### **`middleware/error.js`**

- **Purpose**: Centralized error handling for Express routes.
- **Functions**:
  - `errorHandler`: Logs errors and sends a 500 response with the error message.
  - `asyncHandler`: Wraps async route handlers to catch errors and forward them to Express' error middleware.

### **`middleware/upload.js`**

- **Purpose**: Handles file uploads using `formidable`.
- **Functions**:
  - `createUploadMiddleware`: Configures `formidable` with settings like `uploadDir` and `maxUploadSize`.

---

## **4. Routes**

### **`routes/index.js`**

- **Purpose**: Combines all routes into a single router.
- **Routes**:
  - `/upload`: File uploads.
  - `/download`: File/folder downloads.
  - `/browse`: File/directory browsing.
  - `/clipboard`: Clipboard sync.
  - `/zip-files`: Dynamic ZIP creation.

### **`routes/browse.js`**

- **Endpoint**: `GET /browse`
- **Purpose**: List files/directories in the shared path.
- **Key Features**:
  - Accepts a path query parameter (`?p=...`) to navigate directories.
  - Sorts files/folders numerically.
  - Resolves symlinks but ignores those pointing outside the shared directory.
  - Returns a structured list of files with metadata (e.g., `isDir`, `path`).

### **`routes/clipboard.js`**

- **Endpoints**:
  - `POST /clipboard/paste`: Write text to the server’s clipboard or save it as a file.
  - `POST /clipboard/copy`: Read text from the server’s clipboard.
- **Use Case**: Sync clipboard content between devices connected to the server.

### **`routes/download.js`**

- **Endpoint**: `GET /download?f=<path>`
- **Purpose**: Download files or directories (as ZIP).
- **Key Features**:
  - Uses `serveDirZip` to compress directories on the fly.
  - Supports resumable downloads for large files (`Range` headers).
  - Validates paths to ensure they’re within the shared directory.

### **`routes/upload.js`**

- **Endpoint**: `POST /upload?path=<directory>`
- **Purpose**: Upload files to a specified directory.
- **Key Features**:
  - Uses `filenamify` to sanitize filenames.
  - Handles concurrent uploads with `pMap`.
  - Enforces a maximum upload size (`maxUploadSize`).

### **`routes/zip.js`**

- **Endpoint**: `GET /zip-files?files=<JSON array of paths>`
- **Purpose**: Generate a ZIP archive from multiple files/directories.
- **Key Features**:
  - Streams the ZIP directly to the response for efficiency.
  - Uses `content-disposition` to force a download with a filename.

---

## **5. Utilities**

### **`utils/path.js`**

- **Purpose**: Validate and resolve file paths safely.
- **Functions**:
  - `pathExists`: Checks if a file/directory exists.
  - `arePathsEqual`: Checks if two paths resolve to the same location.
  - `getFileAbsPath`: Resolves a relative path to an absolute path and ensures it stays within the `sharedPath`.

### **`utils/file.js`**

- **Purpose**: ZIP file creation and streaming.
- **Functions**:
  - `createZipArchive`: Creates a ZIP archive with a specified compression level.
  - `serveDirZip`: Streams a directory as a ZIP file to the client.

### **`utils/download.js`**

- **Purpose**: Handle resumable file downloads.
- **Functions**:
  - `serveResumableFileDownload`: Supports HTTP `Range` headers for partial downloads. Streams files efficiently.

---

## **6. Error Handling**

- **Global Error Handler**: `errorHandler` logs errors and sends a 500 response.
- **Async Error Handling**: `asyncHandler` wraps async route handlers to catch errors.

---

## **7. Security Measures**

- **Path Validation**: `getFileAbsPath` ensures paths stay within the `sharedPath`.
- **Symlink Handling**: Blocks symlinks pointing outside the `sharedPath`.
- **Filename Sanitization**: Uses `filenamify` to prevent invalid characters in filenames.

---

## **8. Testing with Postman**

### **Endpoints**:

1. **Browse Files**: `GET /browse?p=/`
2. **Upload Files**: `POST /upload?path=/`
3. **Download Files**: `GET /download?f=<path>`
4. **Create ZIP**: `GET /zip-files?files=<JSON array of paths>`
5. **Clipboard Sync**: `POST /clipboard/copy` and `POST /clipboard/paste`

### **Postman Setup**:

- Use `http://localhost:8080/api` as the base URL.
- For file uploads, use `multipart/form-data` with the `files` key.
- For ZIP creation, URL-encode the `files` array.

---

## **9. Future Improvements**

1. **Authentication**: Add user authentication to restrict access.
2. **Rate Limiting**: Prevent abuse with rate limiting on upload/download endpoints.
3. **File Thumbnails**: Generate thumbnails for images in `/browse` responses.
4. **Docker Support**: Containerize the app for easy deployment.

---

This documentation provides a comprehensive overview of the codebase. Save it as `documentation.txt` for future reference! 🚀
