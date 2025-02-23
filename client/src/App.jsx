import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import FileBrowser from "./components/FileBrowser";
import ClipboardSection from "./components/ClipboardSection";

const STATIC_URL = "http://localhost:8081";

export default function App() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [BACKEND_URL, setBACKEND_URL] = useState("");

  const fetchBackendURL = async () => {
    const response = await axios.get(`${STATIC_URL}/config`);
    setBACKEND_URL(response.data.url);
  };

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
  }, [currentPath, BACKEND_URL]);

  useEffect(() => {
    fetchBackendURL();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header currentPath={currentPath} />
      <ClipboardSection backendUrl={BACKEND_URL} />
      <UploadSection onDrop={onDrop} uploadProgress={uploadProgress} />
      <FileBrowser
        files={files}
        selectedFiles={selectedFiles}
        toggleSelection={toggleSelection}
        downloadFiles={downloadFiles}
        fetchFiles={() => fetchFiles(currentPath)}
        currentPath={currentPath}
      />
    </div>
  );
}
