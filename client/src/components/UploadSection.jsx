import { useDropzone } from "react-dropzone";
import { FaFileUpload } from "react-icons/fa";
import ProgressBar from "./ProgressBar";

export default function UploadSection({ onDrop, uploadProgress }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
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
        {uploadProgress > 0 && <ProgressBar progress={uploadProgress} />}
      </div>
    </div>
  );
}
