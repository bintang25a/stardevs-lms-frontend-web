import { useEffect, useState } from "react";
import { cn } from "../../_utilities/cn";
import {
  createAnnouncement,
  showAnnouncement,
  updateAnnouncement,
} from "../../_services/announcements";

export default function AnnouncementForm({
  isOpen,
  id,
  classroom,
  setEditId,
  setModalOpen,
  setIsLoading,
  setShowToast,
}) {
  const tempForm = {
    title: "",
    announcement: "",
    classroom_id: "",
    section_id: "",
    order: "",
    _method: id && "PUT",
  };

  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(tempForm);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsFetching(true);

      try {
        const { data } = await showAnnouncement(id);

        setFormData({
          ...formData,
          title: data?.title,
          announcement: data?.announcement,
          classroom_id: data?.classroom_id,
          section_id: data?.section_id,
          order: data?.order,
          _method: "PUT",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    if (id && isOpen) {
      fetchData();
    }
  }, [id]);

  const sections = classroom?.sections?.sort((a, b) => a.order - b.order) || [];

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
      order: id ? formData?.order : 0,
    };

    try {
      setIsLoading(true);

      const res = id
        ? await updateAnnouncement(id, fd)
        : await createAnnouncement(fd);

      setShowToast({ isOpen: true, title: "Success", message: res?.message });
      setRefresh((prev) => !prev);
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
    setEditId(null);
    setFormData(tempForm);
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
          {id ? "Edit Announcement" : "Create Announcement"}
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
            disabled={isFetching}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary",
              "disabled:opacity-50",
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
            disabled={isFetching}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary",
              "disabled:opacity-50",
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
            disabled={isFetching}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary cursor-pointer",
              "disabled:opacity-50",
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
            disabled={isFetching}
            onClick={() => handleSubmit(formData, "create")}
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
              "disabled:opacity-50",
            )}
          >
            {id ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
