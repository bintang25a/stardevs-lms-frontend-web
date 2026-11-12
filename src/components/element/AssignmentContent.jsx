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
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AssignmentMenuButtons from "./AssignmentMenuButtons";
import ConfirmDelete from "../modal/ConfirmDelete";
import AnnouncementModal from "../modal/AnnouncementModal";

export default function AssignmentContent({
  user,
  classroom: classroomParams,
  openTrays,
  setOpenTrays,
  openMenu,
  setOpenMenu,
  setModalOpen,
  setEditData,
  setRefresh,
}) {
  const [classroom, setClassroom] = useState(classroomParams);

  const { sections, materials, announcements, assignments } = classroom;
  const currentUrl = window.location.href;

  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get("section");

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    message: "",
    action: null,
    id: null,
  });

  const [announcement, setAnnouncement] = useState({ isOpen: false, id: null });

  useEffect(() => {
    if (sectionId) {
      setOpenTrays((prev) => [...prev, Number(sectionId)]);
    }
  }, [sectionId]);

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

  const handleModalOpen = (type, data) => {
    setModalOpen(type);
    setEditData(data);
  };

  const handleCopyUrl = (id) => {
    const cleanUrl = currentUrl?.split("?")[0];

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(cleanUrl + `?section=${id}`)
        .catch((err) => console.error("Gagal menyalin: ", err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = id ? cleanUrl + `?section=${id}` : cleanUrl;

      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");

        console.log(successful);
      } catch (err) {
        console.error("Gagal menjalankan fallback copy: ", err);
      } finally {
        handleMenuOpen();
      }

      document.body.removeChild(textArea);
    }
  };

  const menuButtons = [
    {
      label: "Edit",
      action: handleModalOpen,
      role: ["asisten"],
    },
    {
      label: "Delete",
      action: setConfirmDelete,
      role: ["asisten"],
    },
    {
      label: "Copy Link",
      action: handleCopyUrl,
      role: ["praktikan", "asisten"],
    },
    {
      label: "Raise",
      action: handleRaiseLower,
      role: ["asisten"],
    },
    {
      label: "Lower",
      action: handleRaiseLower,
      role: ["asisten"],
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

        if (sortedContents.length < 1 && section.title === "No Sections") {
          return;
        }

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
                  e.preventDefault();
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

              <AssignmentMenuButtons
                idx={i}
                user={user}
                menuButtons={menuButtons}
                sectionId={section?.id}
                contentType={"section"}
                contentId={section?.id}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                sortedData={sortedSections.filter(
                  (s) => s.title !== "No Sections",
                )}
              />
            </div>

            <div
              className={cn(
                "flex flex-col w-full",
                "transition-all duration-100 ease-in-out",
                openTrays.includes(section?.id)
                  ? "max-h-125 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden",
              )}
            >
              {sortedContents?.map((content, i) => {
                const isAnnouncement = content?.content_type === "announcement";

                const DynamicTag = isAnnouncement ? "div" : "a";

                const dynamicProps = isAnnouncement
                  ? {
                      onClick: () =>
                        setAnnouncement({ isOpen: true, id: content?.id }),
                    }
                  : {
                      href: `${content?.content_type}s/${content?.id}`,
                      target: "_blank",
                    };

                return (
                  <DynamicTag
                    {...dynamicProps}
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
                        e.preventDefault();
                        handleOpenMenu(
                          `${content?.content_type}-${content.id}`,
                        );
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

                    <AssignmentMenuButtons
                      idx={i}
                      user={user}
                      menuButtons={menuButtons}
                      sectionId={section?.id}
                      contentType={content?.content_type}
                      contentId={content?.id}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                      sortedData={sortedContents}
                    />
                  </DynamicTag>
                );
              })}
            </div>
          </div>
        );
      })}

      <AnnouncementModal
        isOpen={announcement?.isOpen}
        id={announcement?.id}
        setSettings={setAnnouncement}
      />

      <ConfirmDelete
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        setRefresh={setRefresh}
      />
    </main>
  );
}
