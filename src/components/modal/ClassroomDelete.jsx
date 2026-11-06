import { useState } from "react";
import { cn } from "../../_utilities/cn";

export default function ClassroomDelete({
  setModalOpen,
  user,
  handleSubmit,
  message,
  data,
}) {
  const [code, setCode] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;

    setCode(value);
  };

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
          {data?.isLeft ? "Keluar Kelas" : "Hapus Kelas"}
        </h2>

        {message && (
          <span className={cn("text-sm text-red-600")}>{message}</span>
        )}

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="code"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Please retype "<span className="font-bold">{data?.code}</span>" to
            Confirm
            {user?.role === "praktikan" ? " left" : " delete"} Classroom
          </label>
          <input
            type="text"
            name="code"
            id="code"
            onChange={handleChange}
            value={code}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary",
            )}
          />
        </div>

        <div className={cn("w-full", "flex justify-end items-center gap-4")}>
          <button
            onClick={() => setModalOpen((prev) => !prev)}
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
            onClick={() =>
              handleSubmit({ ...data, typed_code: code }, "delete")
            }
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
