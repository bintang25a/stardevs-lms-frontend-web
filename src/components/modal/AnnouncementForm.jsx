import { useState } from "react";
import { cn } from "../../_utilities/cn";
import { createAnnouncement } from "../../_services/announcements";

export default function AnnouncementForm({
  isOpen,
  isEdit = false,
  data,
  classroom,
  setModalOpen,
  setIsLoading,
  setShowToast,
}) {
  const tempForm = {
    title: data?.title ?? "",
    announcement: data?.announcement ?? "",
    classroom_id: data?.classroom_id ?? "",
    section_id: data?.section_id ?? "",
    order: data?.order ?? "",
    _method: data && "PUT",
  };

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(tempForm);

  const sections = classroom?.sections || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const fd = {
      ...formData,
      classroom_id: String(classroom?.id),
      order: 0,
    };

    try {
      setIsLoading(true);

      const res = await createAnnouncement(fd);

      setShowToast({ isOpen: true, title: "Success", message: res?.message });
      setFormData(tempForm);
      setMessage("");
      onClose();
    } catch (error) {
      console.log(error);

      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setModalOpen(null);
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "w-4/5 xl:w-2/5 h-fit max-h-4/5",
          "bg-gray-200  rounded-xl shadow-sm shadow-gray-400",
          "pt-12 px-8 pb-4",
          "flex flex-col justify-start items-start gap-4",
        )}
      >
        <h2 className={cn("text-xl text-primary font-semibold")}>
          {isEdit ? "Edit Announcement" : "Create Announcement"}
        </h2>

        {message && (
          <span className={cn("text-sm text-red-600")}>{message}</span>
        )}

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="title"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Praktikum Pemrograman Berbasi Web"
            onChange={handleChange}
            value={formData.title}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary",
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="announcement"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Announcement *
          </label>
          <textarea
            rows={6}
            type="text"
            name="announcement"
            id="announcement"
            onChange={handleChange}
            value={formData.announcement}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary",
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="section_id"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Choose Section
          </label>
          <select
            name="section_id"
            id="section_id"
            onChange={handleChange}
            value={formData.section_id}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary cursor-pointer",
            )}
          >
            <option value="">Select Section (optional)</option>
            {sections?.map((s, i) => (
              <option key={i} value={s?.id}>
                {s?.title}
              </option>
            ))}
          </select>
        </div>

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
            Batal
          </button>
          <button
            onClick={() => handleSubmit(formData, "create")}
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
            )}
          >
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
