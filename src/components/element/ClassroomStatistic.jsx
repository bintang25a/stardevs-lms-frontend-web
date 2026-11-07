import {
  FaBook,
  FaClipboardList,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa6";
import { cn } from "../../_utilities/cn";

export default function ClassroomStatistic({ classroom }) {
  const statistics = [
    {
      icon: <FaUserGraduate size={16} />,
      label: "Total Assistants",
      value: classroom?.total_assistants,
      color: "bg-green-500",
    },
    {
      icon: <FaUsers size={16} />,
      label: "Total Members",
      value: classroom?.total_students,
      color: "bg-red-500",
    },
    {
      icon: <FaBook size={16} />,
      label: "Total Materials",
      value: classroom?.total_materials,
      color: "bg-orange-500",
    },
    {
      icon: <FaClipboardList size={16} />,
      label: "Total Assignments",
      value: classroom?.total_assignments,
      color: "bg-blue-500",
    },
  ];

  return (
    <div
      className={cn(
        "flex-1",
        "w-fit min-w-fit xl:min-w-1/2 h-auto min-h-40 xl:min-h-60 border border-primary rounded-md p-4",
        "grid grid-cols-2 items-stretch justify-start gap-4",
      )}
    >
      {statistics.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-md p-4 xl:p-2",
            "flex flex-col gap-4 xl:gap-2 justify-center items-center",
            "relative transition-all",
            `${item.color}`,
            "hover:scale-105 hover:shadow hover:shadow-gray-600",
          )}
        >
          <div
            className={cn(
              "w-fit h-fit p-2 bg-white rounded-md",
              "absolute top-4 left-4 xl:top-2 xl:left-2",
            )}
          >
            {item.icon}
          </div>
          <h3
            className={cn(
              "text-center text-6xl xl:text-4xl font-bold text-white",
            )}
          >
            {item.value}
          </h3>
          <span
            className={cn(
              "text-center text-md font-semibold text-white truncate",
            )}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
