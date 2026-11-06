import { useEffect } from "react";
import { FaCheck } from "react-icons/fa6";

export default function NotificationToast({
  isOpen,
  onClose,
  title = "Berhasil!",
  message = "Aksi Anda telah berhasil disimpan.",
  duration = 10000,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed bottom-5 right-5 z-50 
        max-w-sm w-full bg-white border border-gray-100 rounded-xl shadow-2xl p-4 
        flex items-start gap-3 transform transition-all duration-300 ease-out origin-bottom-right
        ${isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95"}
      `}
    >
      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
        <FaCheck />
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-600 mt-0.5">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none cursor-pointer"
      >
        &times;
      </button>
    </div>
  );
}
