import { useEffect, useState } from "react";
import { cn } from "../../_utilities/cn";
import { FaLink, FaXmark } from "react-icons/fa6";
import {
  createMaterial,
  showMaterial,
  updateMaterial,
} from "../../_services/material";

export default function MaterialForm({
  isOpen,
  data,
  classroom,
  setEditData,
  setModalOpen,
  setIsLoading,
  setShowToast,
  setRefresh,
}) {
  const tempForm = {
    title: "",
    description: "",
    files: [],
    classroom_id: "",
    section_id: "",
    order: "",
    files_remove_ids: [],
  };

  const [isFetching, setIsFetching] = useState(false);
  const [showFiles, setShowFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(tempForm);
  const [id, setId] = useState(null);

  const sections = classroom?.sections?.sort((a, b) => a.order - b.order) || [];
  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsFetching(true);

      try {
        let item = null;

        if (typeof data === "string" || typeof data === "number") {
          const { data: resData } = await showMaterial(data);

          item = resData;
        } else {
          item = data;
        }

        const convertFiles = [
          ...item.files.map((f) => ({
            ...f,
            url: f?.file_url,
            name: f?.file_name,
            isNew: false,
          })),
        ];

        setFormData({
          ...formData,
          title: item?.title,
          description: item?.description || "",
          classroom_id: item?.classroom_id,
          section_id: item?.section_id || "",
          order: item?.order,
          files: convertFiles,
          _method: "PUT",
        });

        setShowFiles(convertFiles);
        setId(item?.id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    if (data && isOpen) {
      fetchData();
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const invalidFiles = [...files].filter(
        (file) => file.size > MAX_FILE_SIZE,
      );

      if (invalidFiles.length > 0) {
        return setMessage("Max File size 20 MB!");
      }

      const tempFiles = [...files].map((file) => ({
        isNew: true,
        name: "",
        file: file,
        url: "",
      }));

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...tempFiles],
      }));

      setShowFiles([...formData.files, ...tempFiles]);
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
      order: id ? formData?.order : 0,
      files: [...showFiles.filter((file) => file.isNew)],
    };

    Object.entries(fd).forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value)) {
        value.forEach((item, i) => {
          Object.keys(item).forEach((subKey) => {
            payload.append(`${key}[${i}][${subKey}]`, item[subKey]);
          });
        });
      } else if (key === "files_remove_ids") {
        value.forEach((item) => {
          payload.append("files_remove_ids[]", item);
        });
      } else if (value !== null && value !== undefined && value !== false) {
        payload.append(key, value);
      }
    });

    try {
      setIsLoading(true);

      const res = id
        ? await updateMaterial(id, payload)
        : await createMaterial(payload);

      setShowToast({ isOpen: true, title: "Success", message: res?.message });
      setRefresh((prev) => !prev);
      setFormData(tempForm);
      setShowFiles([]);
      setMessage("");
      onClose();
    } catch (error) {
      console.log(error);

      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = () => {
    const idx = showFiles.findIndex((temp) => temp.url === fileUrl);

    if (idx === -1 && fileUrl !== "") {
      const newUrl = {
        isNew: true,
        name: "",
        url: fileUrl,
      };

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, newUrl],
      }));

      setShowFiles([...showFiles, newUrl]);
    }

    setFileUrl("");
  };

  const handleRemoveFile = (data) => {
    const idxFile = !data.file
      ? showFiles.findIndex((file) => file.url === data.url)
      : showFiles.findIndex((file) => file.file === data.file);

    const updateFiles =
      idxFile !== -1
        ? [...showFiles.slice(0, idxFile), ...showFiles.slice(idxFile + 1)]
        : showFiles;

    if (data.id) {
      setFormData((prev) => ({
        ...prev,
        files_remove_ids: [...prev.files_remove_ids, data.id],
      }));
    }

    setFormData((prev) => ({
      ...prev,
      files: [...updateFiles.filter((file) => file.isNew)],
    }));

    setShowFiles([...updateFiles]);
  };

  const onClose = () => {
    setMessage("");
    setEditData(null);
    setShowFiles([]);
    setModalOpen(null);
    setFormData(tempForm);
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
          {id ? "Edit Material" : "Create Material"}
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
                disabled={isFetching}
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
              disabled={isFetching}
              className={cn(
                "flex-1 min-w-6/10",
                "bg-white border-b border-b-primary",
                "p-2 rounded-t-md outline-none",
                "text-sm text-primary font-normal",
                "hover:shadow-sm hover:shadow-primary",
                "disabled:opacity-50",
              )}
            />

            <button
              disabled={isFetching}
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
            {showFiles.map((file, i) => (
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
                  {!file.file ? file.name || file.url : file.file.name}
                </span>

                <button
                  disabled={isFetching}
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
            onClick={() => handleSubmit(formData, "create")}
            disabled={isFetching}
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
