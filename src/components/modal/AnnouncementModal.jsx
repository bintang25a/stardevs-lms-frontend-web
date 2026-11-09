import { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa6";
import { showAnnouncement } from "../../_services/announcements";
import { cn } from "../../_utilities/cn";
import { isoToLongDateTime } from "../../_utilities/isoToLongDateTime";

export default function AnnouncementModal({ isOpen, id, setSettings }) {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await showAnnouncement(id);
        setAnnouncement(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id && isOpen) {
      fetchData();
    }
  }, [id, isOpen]);

  const onClose = () => {
    setSettings((prev) => ({
      ...prev,
      isOpen: false,
      id: null,
    }));

    setAnnouncement(null);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4",
        "transition-opacity duration-300 ease-out",
        isOpen && announcement
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "w-4/5 xl:w-2/5 h-fit max-h-4/5",
          "bg-gray-200 rounded-xl shadow-sm shadow-gray-400",
          "pt-12 px-8 pb-4",
          "flex flex-col justify-start items-start gap-4",
          "overflow-auto",
        )}
      >
        <div className="flex justify-center items-center gap-2">
          <div className="bg-gray-300 rounded-full border border-primary text-primary p-4">
            <FaBullhorn size={32} />
          </div>

          <h2
            className={cn(
              "text-xl text-primary font-semibold",
              "border-b-2 border-b-primary",
            )}
          >
            {announcement?.title}
          </h2>
        </div>

        <div
          className={cn(
            "w-full min-h-40 p-3",
            "border border-gray-700 rounded-xl",
            "text-sm text-gray-600 font-light text-justify",
          )}
        >
          {announcement?.announcement}
        </div>

        <span className="text-gray-600 text-sm font-normal truncate">
          <span className="text-gray-800 font-medium">Created at: </span>
          {isoToLongDateTime(announcement?.created_at)}
        </span>

        <div
          className={cn("w-full mt-2", "flex justify-end items-center gap-4")}
        >
          <button
            onClick={onClose}
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
            )}
          >
            Close Announcement
          </button>
        </div>
      </div>
    </div>
  );
}
