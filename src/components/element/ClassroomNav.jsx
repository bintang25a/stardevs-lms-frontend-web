import { Link, useParams } from "react-router-dom";
import { cn } from "../../_utilities/cn";

export default function ClassroomNav() {
  const { id } = useParams();

  const pathname = window.location.pathname;
  const path = pathname.split("/")[3];

  return (
    <nav
      className={cn(
        "w-full h-fit px-4 py-0 pt-1",
        "flex justify-start items-center gap-4",
        "border-b border-b-gray-500",
        "text-md font-medium text-primary",
      )}
    >
      <Link
        to={`/classrooms/${id}`}
        replace
        className={cn(
          "w-fit h-fit",
          "px-2 py-4 rounded-t-lg",
          "hover:bg-gray-300 transition-all",
          "border-b-4 border-transparent",
          !path && " border-thirdnary text-thirdnary",
        )}
      >
        Control Panel
      </Link>
      <Link
        to={`/classrooms/${id}/assignments`}
        replace
        className={cn(
          "w-fit h-fit",
          "px-2 py-4 rounded-t-lg",
          "hover:bg-gray-300 transition-all",
          "border-b-4 border-transparent",
          path === "assignments" && " border-thirdnary text-thirdnary",
        )}
      >
        Assignment
      </Link>
      <Link
        to={`/classrooms/${id}/members`}
        replace
        className={cn(
          "w-fit h-fit",
          "px-2 py-4 rounded-t-lg",
          "hover:bg-gray-300 transition-all",
          "border-b-4 border-transparent",
          path === "members" && " border-thirdnary text-thirdnary",
        )}
      >
        Member
      </Link>
    </nav>
  );
}
