import { cn } from "../../_utilities/cn";
import { FaTrash } from "react-icons/fa6";

export default function ConfirmDelete({
  confirmDelete,
  setConfirmDelete,
  setRefresh,
}) {
  const { isOpen, message, action, id } = confirmDelete;

  const onClose = () => {
    setConfirmDelete({ ...confirmDelete, isOpen: false });
  };

  const onSubmit = async () => {
    try {
      await action(id);

      onClose();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "w-4/5 xl:w-3/10 h-fit",
          "bg-gray-200  rounded-xl shadow-sm shadow-gray-400",
          "pt-12 px-8 pb-4",
          "flex flex-col justify-start items-start gap-4",
        )}
      >
        <div className="p-4 rounded-full self-center text-red-600 border border-red-600 bg-gray-300">
          <FaTrash size={56} />
        </div>

        <h2 className={cn("text-xl text-black font-semibold")}>
          Are you sure, Delete this {message}?
        </h2>

        <div className={cn("w-full", "flex justify-end items-center gap-4")}>
          <button
            onClick={onClose}
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
            )}
          >
            No
          </button>
          <button
            onClick={() => onSubmit()}
            className={cn(
              "hover:bg-red-600 hover:text-white active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
            )}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
