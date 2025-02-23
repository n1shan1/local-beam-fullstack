export default function Header({ currentPath }) {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-gray-800">File Sharing</h1>
      <p className="text-gray-600 mt-2">Current path: {currentPath}</p>
    </header>
  );
}
