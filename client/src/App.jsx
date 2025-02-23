import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  FaFileArchive,
  FaFileDownload,
  FaFileAlt,
  FaFolder,
  FaFileUpload,
  FaSpinner,
  FaShareAlt,
  FaRedoAlt,
  FaCopy,
} from "react-icons/fa";

const STATIC_URL = "http://localhost:8081";

export default function FileSharingApp() {
  // State management
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [BACKEND_URL, setBACKEND_URL] = useState("");
  const [clipboardText, setClipboardText] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Fetch backend URL
  const fetchBackendURL = async () => {
    try {
      const response = await axios.get(`${STATIC_URL}/config`);
      setBACKEND_URL(response.data.url);
    } catch (error) {
      console.error("Failed to fetch backend URL:", error);
    }
  };

  // File upload handling
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));

      try {
        await axios.post(
          `${BACKEND_URL}/upload?path=${currentPath}`,
          formData,
          {
            onUploadProgress: (progress) => {
              setUploadProgress(
                Math.round((progress.loaded / progress.total) * 100)
              );
            },
          }
        );
        fetchFiles(currentPath);
        setUploadProgress(0);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    },
    [currentPath, BACKEND_URL]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // File operations
  const fetchFiles = async (path) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/browse`, {
        params: { p: path },
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const toggleSelection = (path) => {
    const newSelection = new Set(selectedFiles);
    newSelection.has(path) ? newSelection.delete(path) : newSelection.add(path);
    setSelectedFiles(newSelection);
  };

  const downloadFiles = async () => {
    if (selectedFiles.size === 1) {
      const path = [...selectedFiles][0];
      window.open(
        `${BACKEND_URL}/download?f=${path}${
          path.endsWith("/") ? "" : "&forceDownload=true"
        }`,
        "_blank"
      );
    } else if (selectedFiles.size > 1) {
      const filesArray = Array.from(selectedFiles);
      window.open(
        `${BACKEND_URL}/zip-files?files=${encodeURIComponent(
          JSON.stringify(filesArray)
        )}`,
        "_blank"
      );
    }
  };

  // Clipboard operations
  const handlePaste = async (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    try {
      await axios.post(`${BACKEND_URL}/clipboard/paste`, { clipboard: text });
      setClipboardText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Paste failed:", error);
    }
  };

  const handleCopy = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/clipboard/copy`);
      setClipboardText(response.data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Initial setup
  useEffect(() => {
    fetchBackendURL();
  }, []);

  useEffect(() => {
    if (BACKEND_URL) fetchFiles(currentPath);
  }, [currentPath, BACKEND_URL]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">File Sharing</h1>
        <p className="text-gray-600 mt-2">Current path: {currentPath}</p>
      </header>

      {/* Clipboard Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-lg transition-all hover:shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Clipboard Sync
        </h2>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              onPaste={handlePaste}
              placeholder="Paste here to sync clipboard"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleCopy}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              <FaCopy className="inline-block mr-2" />
              Copy
            </button>
          </div>
          {clipboardText && (
            <div className="p-4 bg-gray-50 rounded-lg transition-all">
              <p className="text-gray-700">{clipboardText}</p>
            </div>
          )}
        </div>
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all">
            Clipboard synced!
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-lg transition-all hover:shadow-xl">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center transition-all
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          <input {...getInputProps()} />
          <FaFileUpload className="text-4xl text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">
            {isDragActive
              ? "Drop files here"
              : "Drag & drop files, or click to select"}
          </p>
          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* File Browser */}
      <div className="bg-white rounded-lg shadow-lg transition-all hover:shadow-xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={() => fetchFiles(currentPath)}
            className="text-gray-600 hover:text-gray-800 flex items-center transition-all"
          >
            <FaRedoAlt className="mr-2" />
            Refresh
          </button>
          {selectedFiles.size > 0 && (
            <button
              onClick={downloadFiles}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Download Selected
            </button>
          )}
        </div>
        <div className="p-4">
          {files?.map((file) => {
            const decodedFileName = decodeURIComponent(file.fileName);
            return (
              <div
                key={file.path}
                className={`p-3 hover:bg-gray-50 rounded-lg flex items-center transition-all
                  ${selectedFiles.has(file.path) ? "bg-blue-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.path)}
                  onChange={() => toggleSelection(file.path)}
                  className="mr-4"
                />
                {file.isDir ? (
                  <button
                    onClick={() => setCurrentPath(file.path)}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <FaFolder className="mr-2" />
                    {decodedFileName}
                  </button>
                ) : (
                  <div className="flex items-center">
                    <FaFileAlt className="mr-2 text-gray-500" />
                    <span className="text-gray-700">{decodedFileName}</span>
                  </div>
                )}
                <div className="ml-auto flex space-x-4">
                  {file.isDir ? (
                    <button
                      title="Download as ZIP"
                      className="text-gray-400 hover:text-gray-600 transition-all"
                      onClick={() =>
                        window.open(
                          `${BACKEND_URL}/download?f=${file.path}`,
                          "_blank"
                        )
                      }
                    >
                      <FaFileArchive />
                    </button>
                  ) : (
                    <button
                      title="Download"
                      className="text-gray-400 hover:text-gray-600 transition-all"
                      onClick={() =>
                        window.open(
                          `${BACKEND_URL}/download?f=${file.path}&forceDownload=true`,
                          "_blank"
                        )
                      }
                    >
                      <FaFileDownload />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
