export default function ProgressBar({ progress }) {
  return (
    <div className="mt-4">
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{progress}%</p>
    </div>
  );
}
