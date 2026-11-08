import {
  FaBook,
  FaBullhorn,
  FaChevronDown,
  FaClipboardList,
  FaEllipsisVertical,
} from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { isoToLongDate } from "../../_utilities/isoToLongDate";
import { isoToLongDateTime } from "../../_utilities/isoToLongDateTime";

export default function AssignmentContent({
  classroom,
  openTrays,
  setOpenTrays,
}) {
  const { sections, materials, announcements, assignments } = classroom;

  const unassignedMaterials = materials
    ?.filter((item) => !item.section_id)
    ?.map((item) => ({
      ...item,
      content_type: "material",
    }));

  const unassignedAssignments = assignments
    ?.filter((item) => !item.section_id)
    ?.map((item) => ({
      ...item,
      content_type: "assignment",
    }));

  const unassignedAnnouncements = announcements
    ?.filter((item) => !item.section_id)
    ?.map((item) => ({
      ...item,
      content_type: "announcement",
    }));

  const noSections = [
    ...unassignedAnnouncements,
    ...unassignedAssignments,
    ...unassignedMaterials,
  ];

  const sortedSections = [...sections].sort((a, b) => a?.order - b?.order);

  const icon = (type) => {
    if (type === "assignment") {
      return <FaClipboardList size={20} />;
    }

    if (type === "announcement") {
      return <FaBullhorn size={20} />;
    }

    if (type === "material") {
      return <FaBook size={20} />;
    }
  };

  const handleToggleTrays = (id, length) => {
    if (length < 1) return;

    if (openTrays.includes(id)) {
      setOpenTrays((prev) => prev.filter((p) => p !== id));
    } else {
      setOpenTrays((prev) => [...prev, id]);
    }
  };

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    alert("Kerennn");
  };

  return (
    <main
      className={cn(
        "w-9/10 xl:w-6/10 py-4",
        "flex flex-col justify-start items-center gap-10 xl:gap-8",
      )}
    >
      {sortedSections.map((section) => {
        const sectionMaterials = materials
          ?.filter((item) => item.section_id === section.id)
          ?.map((item) => ({
            ...item,
            content_type: "material",
          }));

        const sectionAnnouncements = announcements
          ?.filter((item) => item.section_id === section.id)
          ?.map((item) => ({
            ...item,
            content_type: "announcement",
          }));

        const sectionAssignments = assignments
          ?.filter((item) => item.section_id === section.id)
          ?.map((item) => ({
            ...item,
            content_type: "assignment",
          }));

        const contents = [
          ...sectionMaterials,
          ...sectionAnnouncements,
          ...sectionAssignments,
        ];

        const sortedContents = [...contents].sort(
          (a, b) => a?.order - b?.order,
        );

        return (
          <div
            key={section?.id}
            className={cn(
              "w-full",
              "rounded-xl",
              "flex flex-col",
              "transition-all cursor-pointer",
              "hover:shadow-md hover:shadow-primary hover:overflow-hidden",
              "active:shadow-md active:shadow-primary active:overflow-hidden",
            )}
          >
            <div
              onClick={() =>
                handleToggleTrays(section?.id, sortedContents?.length)
              }
              className={cn(
                "w-full p-4 xl:p-8 xl:pr-32",
                "transition-all relative cursor-pointer",
                "flex justify-between items-center",
                "border-b border-b-secondary",
                "hover:bg-gray-100",
              )}
            >
              <h2 className={cn("text-primary text-xl font-medium truncate")}>
                {section?.title}
              </h2>

              <span className={cn("hidden xl:block")}>
                {isoToLongDate(section.date)}
              </span>

              <button
                className={cn(
                  "p-3 rounded-full",
                  "absolute right-16",
                  "hover:bg-gray-200",
                  "transition-all cursor-pointer",
                  openTrays.includes(section?.id) && "rotate-180",
                  sortedContents?.length < 1 && "hidden",
                )}
              >
                <FaChevronDown size={16} />
              </button>

              <button
                onClick={handleOpenMenu}
                className={cn(
                  "p-3 rounded-full",
                  "absolute right-4",
                  "hover:bg-gray-200",
                  "transition-all cursor-pointer",
                )}
              >
                <FaEllipsisVertical size={16} />
              </button>
            </div>

            <div
              className={cn(
                "flex flex-col w-full",
                "overflow-hidden transition-all duration-100 ease-in-out",
                openTrays.includes(section?.id)
                  ? "max-h-125 opacity-100"
                  : "max-h-0 opacity-0",
              )}
            >
              {sortedContents?.map((content) => (
                <div
                  className={cn(
                    "w-full p-4 xl:px-8 xl:py-4 xl:pr-32",
                    "flex justify-between items-center",
                    "border-b border-b-secondary",
                    "hover:bg-gray-100 active:bg-gray-100 transition-none",
                    "cursor-pointer relative",
                  )}
                >
                  <h2
                    className={cn(
                      "text-gray-700 text-md font-normal truncate",
                      "flex items-center justify-center gap-2",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-gray-300 p-2 rounded-full",
                        "text-primary",
                      )}
                    >
                      {icon(content.content_type)}
                    </div>

                    <span>{content?.title}</span>
                  </h2>

                  <span className={cn("hidden xl:block text-sm font-light")}>
                    {content?.ended_at &&
                      `Due: ${isoToLongDateTime(content?.ended_at)}`}
                  </span>

                  <button
                    onClick={handleOpenMenu}
                    className={cn(
                      "p-3 rounded-full",
                      "absolute right-4",
                      "hover:bg-gray-200",
                      "transition-all cursor-pointer",
                    )}
                  >
                    <FaEllipsisVertical size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}
