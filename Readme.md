# File Sharing Application

A full-stack application for secure file sharing and clipboard synchronization across devices, built with Node.js/Express backend and React frontend.

![App Screenshot](https://github.com/n1shan1/STATIC-REPO/blob/master/images/local-beam.png)

## Features

- **File Management**
  - Upload multiple files/folders
  - Browse directory structure
  - Download single files or directories (as ZIP)
  - Bulk file selection and download
- **Clipboard Sync**
  - Cross-device text synchronization
  - Real-time paste/copy operations
- **Security**
  - Path validation to prevent directory traversal
  - File name sanitization
- **Modern UI**
  - Drag & drop file upload
  - Progress indicators
  - Responsive design

## Technologies

- **Backend**: Node.js, Express, Axios
- **Frontend**: React, Tailwind CSS, React Dropzone
- **Utilities**: Formidable (file upload), Archiver (ZIP creation)
- **Dev Tools**: Vite, PM2, Docker

## Installation

### Prerequisites

- Node.js v16+
- npm v8+
- Python 3.8+ (for some native dependencies)

```bash
# Clone repository
git clone https://github.com/yourusername/file-sharing-app.git
cd file-sharing-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Build frontend
npm run build

# Copy build to backend
cp -r dist ../backend/public
```

## Configuration

Create `.env` file in backend directory:

```env
PORT=8080
SHARED_PATH=./shared
MAX_UPLOAD_SIZE=17179869184  # 16GB in bytes
ZIP_COMPRESSION_LEVEL=6
DEBUG=true
```

## Running the Application

```bash
# Start backend server
cd backend
npm start

# Start frontend (development)
cd ../frontend
npm run dev
```

## API Documentation

### File Operations

#### 1. Browse Directory

```http
GET /api/browse?p={path}
```

- **Parameters**:
  - `p`: Directory path (URL encoded)
- **Response**:
  ```json
  {
    "files": [
      {
        "path": "/docs",
        "fileName": "docs",
        "isDir": true
      }
    ],
    "cwd": "/",
    "sharedPath": "/absolute/path/to/shared"
  }
  ```

#### 2. File Upload

```http
POST /api/upload?path={directory}
```

- **Parameters**:
  - `path`: Target directory (optional, default: "/")
- **Body**: `multipart/form-data` with files
- **Success Response**: `200 OK`

#### 3. File Download

```http
GET /api/download?f={path}&forceDownload={true|false}
```

- **Parameters**:
  - `f`: File/directory path (URL encoded)
  - `forceDownload`: Force file download (skip preview)
- **Response**: File stream

#### 4. ZIP Creation

```http
GET /api/zip-files?files={json_array}
```

- **Parameters**:
  - `files`: JSON array of paths
  ```bash
  Example: files=%5B%22/file1.txt%22,%20%22/folder1%22%5D
  ```
- **Response**: ZIP file stream

### Clipboard Operations

#### 1. Paste to Server

```http
POST /api/clipboard/paste
```

- **Body**:
  ```json
  {
    "clipboard": "Text to sync",
    "saveAsFile": false
  }
  ```
- **Success Response**: `200 OK`

#### 2. Copy from Server

```http
POST /api/clipboard/copy
```

- **Response**:
  ```json
  "Synced clipboard text"
  ```

## Deployment

### PM2 (Production)

```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

### Docker

```dockerfile
FROM node:16-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
COPY frontend/dist ./public

EXPOSE 8080
CMD ["node", "src/server.js"]
```

## Security Considerations

1. **Access Control**: Not production-ready! Add:
   ```javascript
   // Basic authentication example
   app.use((req, res, next) => {
     if (req.headers.authorization !== API_KEY) {
       return res.status(401).send("Unauthorized");
     }
     next();
   });
   ```
2. **Rate Limiting**: Implement using express-rate-limit
3. **HTTPS**: Mandatory for production deployments

## Troubleshooting

Common Issues:

```bash
# File uploads failing
1. Check MAX_UPLOAD_SIZE in .env
2. Verify disk space: df -h
3. Check file permissions: chmod -R 755 shared

# Network errors
1. Disable ad-blockers/browser extensions
2. Verify CORS configuration
3. Check firewall settings
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-component`
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push to branch: `git push origin feature/new-component`
5. Submit pull request

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**Need Help?**  
Open an issue or contact [your-email@domain.com](mailto:nishantdev03@gmail.com)
