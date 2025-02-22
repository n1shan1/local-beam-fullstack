import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './styles/index.css'; // Ensure this path is correct

function App() {
  const [files, setFiles] = useState([]); // Track all uploaded files
  const [showNotification, setShowNotification] = useState(false); // Control notification visibility

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile.name);

    // Check if the file already exists
    if (files.some((file) => file.name === selectedFile.name)) {
      console.log('Duplicate file detected!');
      setShowNotification(true); // Show notification
      setTimeout(() => setShowNotification(false), 3000); // Hide notification after 3 seconds
      return;
    }

    // Add the new file to the list
    console.log('Adding new file:', selectedFile.name);
    setFiles([...files, selectedFile]);
  };

  const handleRemoveFile = (fileName) => {
    // Remove the file from the list
    setFiles(files.filter((file) => file.name !== fileName));
  };

  return (
    <div className="app-container">
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* File Upload Section */}
        <div className="file-upload-section">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="file-upload-button">
            Add File
          </label>
        </div>

        {/* Display Uploaded Files */}
        <div className="uploaded-files-container">
          {files.length === 0 ? (
            <p className="no-files-message">No files uploaded yet.</p>
          ) : (
            files.map((file, index) => (
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

        {/* Notification Box */}
        {showNotification && (
          <div className="notification-box">
            <p>The same file is already uploaded!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;