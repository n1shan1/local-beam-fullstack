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
} from "react-icons/fa";

function App() {
  // State management
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log(BACKEND_URL);
  // File upload handling
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));

      try {
        const response = await axios.post(
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
    [currentPath]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // File fetching
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

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  // File selection handling
  const toggleSelection = (path) => {
    const newSelection = new Set(selectedFiles);
    newSelection.has(path) ? newSelection.delete(path) : newSelection.add(path);
    setSelectedFiles(newSelection);
  };

  // Download handling
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">File Sharing</h1>
        <p className="text-gray-600">Current path: {currentPath}</p>
      </header>

      {/* Upload Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center 
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
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={() => fetchFiles(currentPath)}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaRedoAlt className="inline-block mr-2" />
            Refresh
          </button>
          {selectedFiles.size > 0 && (
            <button
              onClick={downloadFiles}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Download Selected
            </button>
          )}
        </div>

        {/* File List */}
        <div className="p-4">
          {files.map((file) => (
            <div
              key={file.path}
              className={`p-3 hover:bg-gray-50 rounded flex items-center 
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
                  {file.fileName}
                </button>
              ) : (
                <div className="flex items-center">
                  <FaFileAlt className="mr-2 text-gray-500" />
                  <span className="text-gray-700">{file.fileName}</span>
                </div>
              )}
              <div className="ml-auto flex space-x-4">
                {file.isDir ? (
                  <button
                    title="Download as ZIP"
                    className="text-gray-400 hover:text-gray-600"
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
                    className="text-gray-400 hover:text-gray-600"
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
