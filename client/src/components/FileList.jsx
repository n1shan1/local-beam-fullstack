import FileItem from "./FileItem";

export default function FileList({ files, selectedFiles, toggleSelection }) {
  return (
    <div className="p-4">
      {files?.map((file) => (
        <FileItem
          key={file.path}
          file={file}
          isSelected={selectedFiles.has(file.path)}
          onToggleSelection={() => toggleSelection(file.path)}
        />
      ))}
    </div>
  );
}
