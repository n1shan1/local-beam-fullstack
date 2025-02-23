import {
  FaFileAlt,
  FaFolder,
  FaFileArchive,
  FaFileDownload,
} from "react-icons/fa";

export default function FileItem({ file, isSelected, onToggleSelection }) {
  const { path, fileName, isDir } = file;

  return (
    <div
      className={`p-3 hover:bg-gray-50 rounded-lg flex items-center transition-all
        ${isSelected ? "bg-blue-50" : ""}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelection}
        className="mr-4"
      />
      {isDir ? (
        <button className="flex items-center text-blue-500 hover:text-blue-600">
          <FaFolder className="mr-2" />
          {fileName}
        </button>
      ) : (
        <div className="flex items-center">
          <FaFileAlt className="mr-2 text-gray-500" />
          <span className="text-gray-700">{fileName}</span>
        </div>
      )}
      <div className="ml-auto flex space-x-4">
        {isDir ? (
          <button
            title="Download as ZIP"
            className="text-gray-400 hover:text-gray-600 transition-all"
          >
            <FaFileArchive />
          </button>
        ) : (
          <button
            title="Download"
            className="text-gray-400 hover:text-gray-600 transition-all"
          >
            <FaFileDownload />
          </button>
        )}
      </div>
    </div>
  );
}
