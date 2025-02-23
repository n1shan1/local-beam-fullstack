import { FaRedoAlt } from "react-icons/fa";
import FileList from "./FileList";

export default function FileBrowser({
  files,
  selectedFiles,
  toggleSelection,
  downloadFiles,
  fetchFiles,
  currentPath,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg transition-all hover:shadow-xl">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <button
          onClick={fetchFiles}
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
      <FileList
        files={files}
        selectedFiles={selectedFiles}
        toggleSelection={toggleSelection}
      />
    </div>
  );
}
