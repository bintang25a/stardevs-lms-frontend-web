import { FaChevronDown, FaChevronUp, FaFilter, FaPlus } from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { useState } from "react";

export default function AssignmentNav({
  user,
  setModalOpen,
  toggleExpand,
  openTrays,
  setFilter,
  filter,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  const handleToggleExpand = () => {
    setTrayOpen(toggleExpand());
  };

  const handleClick = (menu) => {
    const isFilter = user.role === "praktikan";

    if (isFilter) {
      setFilter(menu !== "section" ? menu : "");

      toggleExpand(true);
    } else {
      setModalOpen(menu);
    }

    setIsOpen(false);
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
          )}
        >
          <div className="flex items-center gap-2">
            {user.role === "praktikan" ? (
              <>
                <FaFilter size={20} />

                <span className={cn("hidden md:block", !filter && "block")}>
                  Filter
                </span>

                <span className={cn("hidden md:block", !filter && "md:hidden")}>
                  :
                </span>

                {filter ? `${filter}` : ""}
              </>
            ) : (
              <>
                <FaPlus size={20} /> Create
              </>
            )}
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
            onClick={() => handleClick("section")}
            className={cn(
              "w-full px-4 py-2",
              "text-left",
              "rounded-lg transition-colors cursor-pointer",
              "hover:bg-gray-200",
              user?.role === "praktikan" && !filter && "hidden",
            )}
          >
            {user?.role === "praktikan" ? "No Filter" : "Section"}
          </button>
          <button
            onClick={() => handleClick("announcement")}
            className={cn(
              "w-full px-4 py-2",
              "text-left",
              "rounded-lg transition-colors cursor-pointer",
              "hover:bg-gray-200",
            )}
          >
            Announcement
          </button>
          <button
            onClick={() => handleClick("material")}
            className={cn(
              "w-full px-4 py-2",
              "text-left",
              "rounded-lg transition-colors cursor-pointer",
              "hover:bg-gray-200",
            )}
          >
            Material
          </button>
          <button
            onClick={() => handleClick("assignment")}
            className={cn(
              "w-full px-4 py-2",
              "text-left",
              "rounded-lg transition-colors cursor-pointer",
              "hover:bg-gray-200",
            )}
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
