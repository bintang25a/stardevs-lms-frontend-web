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
import { lowerOrder, raiseOrder } from "../../_services/actions";
import { useState } from "react";

export default function AssignmentContent({
  classroom: classroomParams,
  openTrays,
  setOpenTrays,
  openMenu,
  setOpenMenu,
  setModalOpen,
  setEditId,
}) {
  const [classroom, setClassroom] = useState(classroomParams);

  const { sections, materials, announcements, assignments } = classroom;

  const sortedSections = [
    ...sections?.map((s) => ({ ...s, content_type: "section" })),
    { title: "No Sections", order: -1, id: null },
  ].sort((a, b) => a?.order - b?.order);

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

  const handleOpenMenu = (data) => {
    if (openMenu === data) {
      setOpenMenu("");
    } else {
      setOpenMenu(data);
    }
  };

  const handleRaiseLower = async (id, type, data, action = "raise") => {
    const currentData =
      type === "section"
        ? sortedSections?.find((s) => s.id === id)
        : data?.find((d) => d.id === id && d.content_type === type);

    const orderData = {
      classroom_id: classroom?.id,
      current_id: id,
      current_type: type,
      current_order: Number(currentData?.order),
      data,
    };

    try {
      const data =
        action === "raise"
          ? await raiseOrder(orderData)
          : await lowerOrder(orderData);

      setClassroom(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalOpen = (type, id) => {
    setModalOpen(type);
    setEditId(id);
  };

  const menuButtons = [
    {
      label: "Edit",
      action: handleModalOpen,
    },
    {
      label: "Delete",
    },
    {
      label: "Copy Link",
    },
    {
      label: "Raise",
      action: handleRaiseLower,
    },
    {
      label: "Lower",
      action: handleRaiseLower,
    },
  ];

  return (
    <main
      onClick={() => setOpenMenu("")}
      className={cn(
        "w-9/10 xl:w-6/10 py-4",
        "flex flex-col justify-start items-center gap-10 xl:gap-8",
      )}
    >
      {sortedSections.map((section, i) => {
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
              "hover:shadow-md hover:shadow-primary",
              "active:shadow-md active:shadow-primary",
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
                {section.date && isoToLongDate(section.date)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMenu(`section-${section.id}`);
                }}
                className={cn(
                  "p-3 rounded-full",
                  "absolute right-4",
                  "hover:bg-gray-200",
                  "transition-all cursor-pointer",
                  section.id === null && "hidden",
                )}
              >
                <FaEllipsisVertical size={16} />
              </button>

              <div
                className={cn(
                  "w-fit h-fit py-2",
                  "absolute right-0 xl:-right-20 bottom-16 xl:bottom-20 transition-all z-50",
                  "flex flex-col justify-start items-start gap-1",
                  "text-lg text-black",
                  "bg-gray-200 rounded-lg shadow-md shadow-gray-600",
                  openMenu !== `section-${section.id}` && "hidden",
                  i < 2 && "top-20",
                )}
              >
                {menuButtons.map((m, mi) => (
                  <button
                    key={mi}
                    className={cn(
                      "px-6 py-1 cursor-pointer hover:bg-gray-300 w-full",
                      "disabled:text-gray-500 text-left",
                      m.label === "Raise" && "border-t border-t-gray-400",
                    )}
                    disabled={
                      (m.label === "Raise" && i === 1) ||
                      (m.label === "Lower" && i === sortedSections.length - 1)
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      if (m.label === "Raise" || m.label === "Lower") {
                        m.action(
                          section?.id,
                          "section",
                          sortedSections.filter(
                            (s) => s.title !== "No Sections",
                          ),
                          m.label.toLowerCase(),
                        );
                      }

                      if (m.label === "Edit") {
                        m.action("section", section?.id);
                      }
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "flex flex-col w-full",
                "transition-all duration-100 ease-in-out",
                openTrays.includes(section?.id)
                  ? "max-h-125 opacity-100"
                  : "max-h-0 opacity-0",
              )}
            >
              {sortedContents?.map((content, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-full p-4 xl:px-8 xl:py-4 xl:pr-18",
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenMenu(`${content?.content_type}-${content.id}`);
                    }}
                    className={cn(
                      "p-3 rounded-full",
                      "absolute right-4",
                      "hover:bg-gray-200",
                      "transition-all cursor-pointer",
                    )}
                  >
                    <FaEllipsisVertical size={16} />
                  </button>

                  <div
                    className={cn(
                      "w-fit h-fit py-2",
                      "absolute right-0 xl:-right-20 bottom-16 xl:bottom-20 transition-all z-100",
                      "flex flex-col justify-start items-start gap-1",
                      "text-lg text-black",
                      "bg-gray-200 rounded-lg shadow-md shadow-gray-600",
                      openMenu !== `${content?.content_type}-${content.id}` &&
                        "hidden",
                      i < 2 && "top-20",
                    )}
                  >
                    {menuButtons.map((m, mi) => (
                      <button
                        key={mi}
                        className={cn(
                          "px-6 py-1 cursor-pointer hover:bg-gray-300 w-full",
                          "disabled:text-gray-500 text-left",
                          m.label === "Raise" && "border-t border-t-gray-400",
                        )}
                        disabled={
                          (m.label === "Raise" && i === 0) ||
                          (m.label === "Lower" &&
                            i === sortedContents.length - 1)
                        }
                        onClick={(e) => {
                          e.stopPropagation();

                          if (m.label === "Raise" || m.label === "Lower") {
                            m.action(
                              content?.id,
                              content?.content_type,
                              sortedContents,
                              m.label.toLowerCase(),
                            );
                          }

                          if (m.label === "Edit") {
                            m.action(content?.content_type, content?.id);
                          }
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}
