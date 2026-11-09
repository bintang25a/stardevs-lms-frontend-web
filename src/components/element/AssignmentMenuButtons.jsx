import { deleteAnnouncement } from "../../_services/announcements";
import { deleteAssignment } from "../../_services/assignments";
import { deleteMaterial } from "../../_services/material";
import { deleteSection } from "../../_services/sections";
import { cn } from "../../_utilities/cn";

export default function AssignmentMenuButtons({
  user,
  menuButtons,
  sectionId,
  contentType,
  contentId,
  sortedData,
  openMenu,
  setOpenMenu,
  idx,
}) {
  const disabledIdx = contentType !== "section" ? 0 : 1;

  const deleteActions = {
    assignment: deleteAssignment,
    material: deleteMaterial,
    announcement: deleteAnnouncement,
    section: deleteSection,
  };

  return (
    <div
      className={cn(
        "w-fit h-fit py-2",
        "absolute right-0 xl:-right-20 bottom-16 xl:bottom-20 transition-all z-50",
        "flex flex-col justify-start items-start gap-1",
        "text-lg text-black",
        "bg-gray-200 rounded-lg shadow-md shadow-gray-600",
        openMenu !== `${contentType}-${contentId}` && "hidden",
        idx < 2 && "top-20",
      )}
    >
      {menuButtons.map((m, mi) => (
        <button
          key={mi}
          disabled={
            (m.label === "Raise" && idx === 0 + disabledIdx) ||
            (m.label === "Lower" &&
              idx === sortedData.length - 1 + disabledIdx) ||
            !m.role.includes(user?.role)
          }
          className={cn(
            "px-6 py-1 cursor-pointer hover:bg-gray-300 w-full",
            "disabled:text-gray-500 text-left",
            m.label === "Raise" && "border-t border-t-gray-400",
            !m.role.includes(user?.role) && "hidden",
          )}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpenMenu("");

            if (m.label === "Raise" || m.label === "Lower") {
              m.action(
                contentId,
                contentType,
                sortedData,
                m.label.toLowerCase(),
              );
            }

            if (m.label === "Edit") {
              m.action(contentType, contentId);
            }

            if (m.label === "Copy Link") {
              m.action(sectionId);
            }

            if (m.label === "Delete") {
              m.action({
                isOpen: true,
                message: contentType,
                action: deleteActions[contentType],
                id: contentId,
              });
            }
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
