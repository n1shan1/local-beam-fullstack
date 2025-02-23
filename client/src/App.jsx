import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './styles/index.css'; // Ensure this path is correct

function App() {
  const [files, setFiles] = useState([]); // Track all uploaded files
  const [showNotification, setShowNotification] = useState(false); // Control notification visibility
  const [showUploadButton, setShowUploadButton] = useState(false); // Control upload button visibility
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [uploadSuccess, setUploadSuccess] = useState(false); // Control upload success message

  // Handle file selection
  const handleFileChange = (event) => {
    try {
      const selectedFiles = Array.from(event.target.files); // Convert FileList to an array
      const newFiles = []; // Store non-duplicate files

      selectedFiles.forEach((selectedFile) => {
        // Check if the file already exists
        if (files.some((file) => file.name === selectedFile.name)) {
          console.log('Duplicate file detected:', selectedFile.name);
          setShowNotification(true); // Show notification
          setTimeout(() => setShowNotification(false), 3000); // Hide notification after 3 seconds
        } else {
          newFiles.push(selectedFile); // Add non-duplicate files to the list
        }
      });

      // Add new files to the state
      if (newFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setShowUploadButton(true); // Show the upload button
      }
    } catch (error) {
      console.error('Error handling file change:', error);
    }
  };

  // Remove a file
  const handleRemoveFile = (fileName) => {
    try {
      const updatedFiles = files.filter((file) => file.name !== fileName);
      setFiles(updatedFiles);

      // Hide the upload button if no files are left
      if (updatedFiles.length === 0) {
        setShowUploadButton(false);
      }
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  // Handle file upload
  const handleUploadFiles = () => {
    try {
      // Simulate file upload
      setTimeout(() => {
        setFiles([]); // Clear the files
        setShowUploadButton(false); // Hide the upload button
        setUploadSuccess(true); // Show success message
        setTimeout(() => setUploadSuccess(false), 5000); // Hide success message after 5 seconds
      }, 1000); // Simulate a 1-second upload process
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="main-container">
        {/* Container for Add File, Search, Upload Buttons, and File List */}
        <div className="file-management-container">
          {/* Add File and Upload Buttons */}
          <div className="controls-container">
            {/* Add File Button */}
            <div className="file-upload-section">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                multiple
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="file-upload-button">
                Add File
              </label>
            </div>

            {/* Upload Button */}
            {showUploadButton && (
              <div className="upload-button-container">
                <button className="upload-button" onClick={handleUploadFiles}>
                  Upload Files
                </button>
              </div>
            )}
          </div>

          {/* Search Input */}
          {files.length > 0 && (
            <div className="file-search-section">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="file-list-container">
              <div className="uploaded-files-container">
                {filteredFiles.length === 0 ? (
                  <p className="no-files-message">No files uploaded yet.</p>
                ) : (
                  filteredFiles.map((file, index) => (
                    <div key={index} className="file-box">
                      <span>{file.name}</span>
                      <button
                        className="remove-file-button"
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Box */}
      {showNotification && (
        <div className="notification-box">
          <p>The same file is already uploaded!</p>
        </div>
      )}

      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="upload-success-box">
          <p>Files uploaded successfully!</p>
        </div>
      )}
    </div>
  );
}

export default App;