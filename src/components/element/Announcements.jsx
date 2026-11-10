import { FaBullhorn } from "react-icons/fa6";
import { cn } from "../../_utilities/cn";

export default function Announcements({ announcements }) {
  return (
    <div
      className={cn(
        "flex-1",
        "w-fit min-w-fit xl:min-w-1/3 h-auto min-h-40 xl:min-h-60",
        "border border-primary rounded-md p-4",
        "flex flex-col justify-start items-start gap-3",
      )}
    >
      <div className="flex justify-center items-center gap-2">
        <div className="bg-gray-300 rounded-full border border-primary text-primary p-4">
          <FaBullhorn size={24} />
        </div>

        <h2
          className={cn(
            "text-xl text-primary font-semibold",
            "border-b-2 border-b-primary",
          )}
        >
          Announcement
        </h2>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-3">
        {announcements?.map((ann, i) => (
          <div
            key={i}
            className={cn(
              "w-full h-fit",
              "flex flex-col justify-start items-start gap-2",
              "border-b border-l border-primary rounded-md p-2",
              "hover:scale-103 hover:shadow hover:shadow-gray-300",
              "transition-all",
            )}
          >
            <h3
              className={cn(
                "text-black text-2xl font-medium",
                "border-b border-gray-700",
                "truncate",
              )}
            >
              {ann?.title}
            </h3>

            <span className="text-gray-700 text-sm text-justify">
              {ann.announcement}
            </span>
          </div>
        ))}

        <span
          className={cn(
            "w-full text-center",
            announcements.length > 0 && "hidden",
          )}
        >
          No Announcement right now.
        </span>
      </div>
    </div>
  );
}
