import { useState } from "react";
import { cn } from "../../_utilities/cn";

export default function AddClassroom({ setModalOpen, user }) {
  const [isJoin, setIsJoin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    schedule: "",
    assistant_ids: [user.id],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "w-4/5 xl:w-2/5 h-fit",
          "bg-gray-200  rounded-xl shadow-sm shadow-gray-400",
          "pt-12 px-8 pb-4",
          "flex flex-col justify-start items-start gap-4"
        )}
      >
        <h2 className={cn("text-xl text-primary font-semibold")}>
          {isJoin ? "Gabung kelas" : "Buat kelas"}
        </h2>

        <div className={cn("w-full", "flex justify-start items-center gap-2")}>
          <label
            htmlFor="join"
            className={cn("text-sm text-normal text-gray-500")}
          >
            Punya kode kelas? Gabung
          </label>
          <input
            name="join"
            id="join"
            type="checkbox"
            onChange={(e) => setIsJoin(e.target.checked)}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="name"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Class Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Praktikum Pemrograman Berbasi Web"
            onChange={handleChange}
            value={formData.name}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary"
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="code"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Class Code *
          </label>
          <input
            type="text"
            name="code"
            id="code"
            placeholder="PBW-A1-2026"
            onChange={handleChange}
            value={formData.code}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary"
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="schedule"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Schedule
          </label>
          <input
            type="datetime-local"
            name="schedule"
            id="schedule"
            onChange={handleChange}
            value={formData.schedule}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary"
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="description"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Description
          </label>
          <textarea
            rows={6}
            type="text"
            name="description"
            id="description"
            onChange={handleChange}
            value={formData.description}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary"
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
              "text-lg text-primary font-medium"
            )}
          >
            Batal
          </button>
          <button
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium"
            )}
          >
            {isJoin ? "Gabung" : "Buat"}
          </button>
        </div>
      </div>
    </div>
  );
}
