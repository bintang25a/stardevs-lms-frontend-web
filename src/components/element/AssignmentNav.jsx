import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { useState } from "react";

export default function AssignmentNav({
  user,
  setModalOpen,
  toggleExpand,
  openTrays,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  const handleToggleExpand = () => {
    setTrayOpen(toggleExpand());
  };

  return (
    <nav
      className={cn(
        "w-9/10 xl:w-6/10",
        "flex justify-between items-center",
        "pb-4 border-b border-b-primary",
      )}
    >
      <div className={cn("w-fit", "flex flex-col items-start", "relative")}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-fit flex justify-between items-center gap-2",
            "bg-gray-300 rounded-full px-5 xl:px-3 py-2",
            "text-md xl:text-lg text-black font-light truncate",
            "hover:bg-gray-400 active:scale-95 transition-all cursor-pointer",
            user.role === "praktikan" && "hidden",
          )}
        >
          <div className="flex items-center gap-2">
            <FaPlus size={20} />
            <span>Create</span>
          </div>

          <FaChevronDown
            size={16}
            className={cn(
              "transition-transform duration-300 ease-in-out",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </button>

        <div
          className={cn(
            "w-fit flex flex-col gap-1.5 overflow-hidden transition-all duration-300 ease-in-out absolute",
            isOpen
              ? "max-h-62.5 opacity-100 mt-12 p-2 bg-gray-100 rounded-xl shadow-md z-50"
              : "max-h-0 opacity-0 mt-0 p-0 ",
          )}
        >
          <button
            onClick={() => setModalOpen("section")}
            className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Section
          </button>
          <button
            onClick={() => setModalOpen("announcement")}
            className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Announcement
          </button>
          <button
            onClick={() => setModalOpen("material")}
            className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Material
          </button>
          <button
            onClick={() => setModalOpen("assignment")}
            className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Assignment
          </button>
        </div>
      </div>

      <button
        onClick={handleToggleExpand}
        className={cn(
          "w-fit flex justify-between items-center gap-2 relative",
          "rounded-full px-5 xl:px-3 py-2",
          "text-md xl:text-lg text-primary font-light truncate",
          "hover:bg-thirdnary active:bg-thirdnary active:scale-95 transition-all cursor-pointer",
        )}
      >
        <div className={cn("flex", trayOpen ? "flex-col" : "flex-col-reverse")}>
          <FaChevronDown size={8} />
          <FaChevronUp size={8} />
        </div>

        <span>
          {trayOpen || openTrays.length > 0 ? "Collapse All" : "Expand All"}
        </span>
      </button>
    </nav>
  );
}
