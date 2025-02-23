import { useEffect } from "react";

export default function Toast({ message }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("toast").classList.add("hidden");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="toast"
      className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
    >
      {message}
    </div>
  );
}
