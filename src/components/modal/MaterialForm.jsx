import { useState } from "react";
import { cn } from "../../_utilities/cn";
import { FaLink, FaXmark } from "react-icons/fa6";
import { createMaterial } from "../../_services/material";

export default function MaterialForm({
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
    description: data?.description ?? "",
    files: [],
    files_url: [],
    classroom_id: data?.classroom_id ?? "",
    section_id: data?.section_id ?? "",
    order: data?.order ?? "",
    _method: isEdit && "PUT",
  };

  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(tempForm);

  const sections = classroom?.sections || [];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: [...files],
      }));

      setFiles((prev) => [...prev, ...[...files].map((item) => item?.name)]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    const fd = {
      ...formData,
      classroom_id: String(classroom?.id),
      order: 0,
    };

    Object.entries(fd).forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file) {
            payload.append("files[]", file);
          }
        });
      } else if (key === "files_url" && Array.isArray(value)) {
        value.forEach((url) => {
          if (url) {
            payload.append("files_url[]", url);
          }
        });
      } else if (value !== null && value !== undefined && value !== false) {
        payload.append(key, value);
      }
    });

    try {
      setIsLoading(true);

      const res = await createMaterial(payload);

      setShowToast({ isOpen: true, title: "Success", message: res?.message });
      setFormData(tempForm);
      setMessage("");
      setFiles([]);
      onClose();
    } catch (error) {
      console.log(error);

      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = () => {
    if (!formData.files_url.includes(fileUrl)) {
      formData.files_url.push(fileUrl);

      setFiles([
        ...formData.files_url,
        ...formData.files.map((item) => item?.name),
      ]);
    }

    setFileUrl("");
  };

  const handleRemoveFile = (name) => {
    const tempUrl = formData.files_url;
    const idxUrl = tempUrl.findIndex((temp) => temp === name);
    const updateUrl =
      idxUrl !== -1
        ? [...tempUrl.slice(0, idxUrl), ...tempUrl.slice(idxUrl + 1)]
        : tempUrl;

    const tempFile = formData.files;
    const idxFile = tempFile.findIndex((temp) => temp.name === name);
    const updateFile =
      idxFile !== -1
        ? [...tempFile.slice(0, idxFile), ...tempFile.slice(idxFile + 1)]
        : tempFile;

    setFiles([...updateUrl, ...updateFile.map((item) => item?.name)]);

    setFormData({
      ...formData,
      files_url: [...updateUrl],
      files: [...updateFile],
    });
  };

  const onClose = () => {
    setModalOpen(null);
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "w-4/5 xl:w-2/5 h-fit max-h-4/5",
          "bg-gray-200  rounded-xl shadow-sm shadow-gray-400",
          "pt-12 px-8 pb-4",
          "flex flex-col justify-start items-start gap-4",
          "overflow-auto",
        )}
      >
        <h2 className={cn("text-xl text-primary font-semibold")}>
          {isEdit ? "Edit Material" : "Create Material"}
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
            placeholder="Materi Pertemuan 1"
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
            htmlFor="description"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Descriptions
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
              "hover:shadow-sm hover:shadow-primary",
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="files_url"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Upload File
          </label>

          <div
            className={cn(
              "w-full",
              "flex flex-wrap xl:flex-row gap-1 justify-center items-center",
            )}
          >
            <label
              htmlFor="files"
              className={cn(
                "flex-1 min-w-full xl:min-w-2/10",
                "p-2 rounded-t-md outline-none",
                "text-sm text-center text-white font-normal truncate",
                "bg-primary rounded-md",
                "hover:scale-105 active:scale-95 transition-all cursor-pointer",
              )}
            >
              Choose File
              <input
                type="file"
                name="files"
                id="files"
                placeholder="Praktikum Pemrograman Berbasi Web"
                onChange={handleChange}
                className="hidden"
                multiple
              />
            </label>

            <span
              className={cn(
                "w-full xl:w-fit h-full",
                "flex justify-center items-center",
              )}
            >
              Or
            </span>

            <input
              type="text"
              name="files_url"
              id="files_url"
              placeholder="https://stardevs.my.id"
              onChange={(e) => setFileUrl(e.target.value)}
              value={fileUrl}
              className={cn(
                "flex-1 min-w-6/10",
                "bg-white border-b border-b-primary",
                "p-2 rounded-t-md outline-none",
                "text-sm text-primary font-normal",
                "hover:shadow-sm hover:shadow-primary",
              )}
            />

            <button
              onClick={handleAddUrl}
              title="Add Url"
              className={cn(
                "flex justify-center items-center p-1",
                "bg-primary rounded-md",
                "text-white",
                "hover:scale-105 active:scale-95 transition-all cursor-pointer",
              )}
            >
              <FaLink size={20} />
            </button>
          </div>

          <div
            className={cn(
              "w-full mt-2",
              "flex flex-wrap gap-1 justify-start items-center",
            )}
          >
            {files.map((file, i) => (
              <div
                key={i}
                className={cn(
                  "w-fit max-w-40 ",
                  "bg-gray-400 rounded-full",
                  "py-1 px-3",
                  "flex justify-between items-center gap-1",
                )}
              >
                <span className="text-black text-sm font-light truncate">
                  {file}
                </span>

                <button
                  onClick={() => handleRemoveFile(file)}
                  className="flex justify-center items-center cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
            ))}
          </div>
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
