import { cn } from "../../_utilities/cn";

export default function ClassroomHeader({ classroom }) {
  return (
    <div
      className={cn(
        "flex-1",
        "w-fit max-w-full xl:min-w-2/3 h-fit min-h-40 xl:min-h-60 bg-secondary rounded-md p-4",
        "flex flex-col justify-start items-start",
        "text-white",
      )}
    >
      <h1 className={cn("text-lg md:text-xl xl:text-4xl font-bold mb-2")}>
        {classroom?.name} | {classroom?.code}
      </h1>
      <h2 className={cn("text-md md:text-lg font-light truncate")}>
        Schedule : {classroom?.schedule}
      </h2>
    </div>
  );
}
