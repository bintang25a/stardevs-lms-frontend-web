import { useOutletContext } from "react-router-dom";
import { cn } from "../../../_utilities/cn";

export default function members() {
  const { user, classroom, setModalOpen, setEditId, setRefresh } =
    useOutletContext();

  console.log(classroom);

  return (
    <div
      className={cn(
        "w-full h-full p-4",
        "flex flex-col gap-2 xl:gap-3 justify-start items-center",
        "overflow-auto",
      )}
    ></div>
  );
}
