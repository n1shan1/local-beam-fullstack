import { useState } from "react";
import axios from "axios";
import { FaPaste, FaCopy } from "react-icons/fa";
import Toast from "./Toast";

export default function ClipboardSection({ backendUrl }) {
  const [clipboardText, setClipboardText] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handlePaste = async (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    try {
      await axios.post(`${backendUrl}/clipboard/paste`, { clipboard: text });
      setClipboardText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Paste failed:", error);
    }
  };

  const handleCopy = async () => {
    try {
      const response = await axios.post(`${backendUrl}/clipboard/copy`);
      setClipboardText(response.data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Clipboard Sync</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            onPaste={handlePaste}
            placeholder="Paste here to sync clipboard"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            <FaCopy className="inline-block mr-2" />
            Copy
          </button>
        </div>
        {clipboardText && (
          <div className="p-4 bg-gray-50 rounded-lg transition-all">
            <p className="text-gray-700">{clipboardText}</p>
          </div>
        )}
      </div>
      {showToast && <Toast message="Clipboard synced successfully!" />}
    </div>
  );
}
