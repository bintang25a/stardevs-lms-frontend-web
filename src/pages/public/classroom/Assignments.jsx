import { useOutletContext } from "react-router-dom";
import { cn } from "../../../_utilities/cn";

export default function Assignments() {
  const { classroom } = useOutletContext();
  console.log(classroom);
  return (
    <div
      className={cn("w-full h-full p-4", "flex flex-wrap gap-2 content-start")}
    ></div>
  );
}
