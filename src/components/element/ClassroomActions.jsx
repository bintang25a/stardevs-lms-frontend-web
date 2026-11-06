import { cn } from "../../_utilities/cn";

export default function ClassroomActions({ setModalOpen }) {
  const actions = [
    {
      label: "Create Section",
      value: "section",
    },
    {
      label: "Create Announcement",
      value: "announcement",
    },
    {
      label: "Create Material",
      value: "material",
    },
    {
      label: "Create Assignment",
      value: "assignment",
    },
  ];

  return (
    <div
      className={cn(
        "flex-1 xl:flex-0",
        "w-fit min-w-fit h-fit min-h-40 xl:min-h-60",
        "shadow-md shadow-gray-500 border border-primary  rounded-md p-4",
        "flex flex-col gap-4",
      )}
    >
      <h2 className={cn("text-lg text-primary font-bold")}>Action Buttons</h2>

      <div
        className={cn(
          "w-fit h-fit",
          "flex flex-wrap xl:flex-nowrap xl:flex-col justify-start items-start gap-2",
        )}
      >
        {actions.map((item, i) => (
          <button
            key={i}
            onClick={() => setModalOpen(item.value)}
            className={cn(
              "w-full min-w-fit h-fit flex-1",
              "text-md text-white text-left font-light",
              "border border-white rounded-lg shadow-xs shadow-gray-400 bg-secondary",
              "hover:scale-105 hover:bg-white hover:text-primary active:scale-95",
              "p-2 xl:px-4 transition-all truncate cursor-pointer",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
