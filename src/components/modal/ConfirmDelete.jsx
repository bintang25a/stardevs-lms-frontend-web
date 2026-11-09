import { useState } from "react";
import { cn } from "../../_utilities/cn";

export default function ConfirmDelete({ isOpen, onClose, handleSubmit }) {
  if (!isOpen) return;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "w-4/5 xl:w-2/5 h-fit",
          "bg-gray-200  rounded-xl shadow-sm shadow-gray-400",
          "pt-12 px-8 pb-4",
          "flex flex-col justify-start items-start gap-4",
        )}
      >
        <h2 className={cn("text-xl text-primary font-semibold")}>
          Delete this data?
        </h2>

        <div className={cn("w-full", "flex justify-end items-center gap-4")}>
          <button
            // onClick={}
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
            )}
          >
            Batal
          </button>
          <button
            // onClick={() => handleSubmit()}
            className={cn(
              "hover:bg-red-600 hover:text-white active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
            )}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
