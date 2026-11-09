import { useEffect, useState } from "react";
import { cn } from "../../_utilities/cn";
import { FaChevronDown, FaLink, FaTrash, FaXmark } from "react-icons/fa6";
import { createAssignment } from "../../_services/assignments";

export default function AssignmentForm({
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
    started_at: data?.started_at ?? "",
    ended_at: data?.ended_at ?? "",
    allow_overtime: data?.allow_overtime ?? "0",
    files: [],
    classroom_id: data?.classroom_id ?? "",
    section_id: data?.section_id ?? "",
    order: data?.order ?? "",
    _method: isEdit && "PUT",
  };

  const [showFiles, setShowFiles] = useState([]);
  const [testCases, setTestCases] = useState([{ name: "test-case-1" }]);
  const [answerKeys, setAnswerKeys] = useState([{ name: "answer-key-1" }]);
  const [openTrays, setOpenTrays] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(tempForm);

  const sections = classroom?.sections || [];
  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  useEffect(() => {
    setFormData(tempForm);
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
        name: "",
        file: file,
        url: "",
        type: "assignment",
      }));

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...tempFiles],
      }));

      setShowFiles([
        ...formData.files.filter((file) => file.type === "assignment"),
        ...tempFiles,
      ]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    const tempAnswerKeys = answerKeys.filter((a) => a.file);
    const tempTestCases = testCases.filter((t) => t.file);

    const fd = {
      ...formData,
      files: [...formData.files, ...tempAnswerKeys, ...tempTestCases],
      classroom_id: String(classroom?.id),
      order: 0,
    };

    Object.entries(fd).forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value)) {
        value.forEach((item, i) => {
          Object.keys(item).forEach((subKey) => {
            payload.append(`${key}[${i}][${subKey}]`, item[subKey]);
          });
        });
      } else if (value !== null && value !== undefined && value !== false) {
        payload.append(key, value);
      }
    });

    try {
      setIsLoading(true);

      const res = await createAssignment(payload);

      setShowToast({ isOpen: true, title: "Success", message: res?.message });
      setRefresh((prev) => !prev);
      setFormData(tempForm);
      setShowFiles([]);
      setMessage("");
      onClose();
    } catch (error) {
      console.log(error);
      console.log({ ...payload });
      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = () => {
    const temps = formData.files;
    const idx = temps.findIndex((temp) => temp.url === fileUrl);

    if (idx === -1 && fileUrl !== "") {
      const newUrl = {
        name: "",
        url: fileUrl,
        type: "assignment",
      };

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, newUrl],
      }));

      setShowFiles([
        ...formData.files.filter((file) => file.type === "assignment"),
        newUrl,
      ]);
    }

    setFileUrl("");
  };

  const handleRemoveFile = (data) => {
    const tempFiles = formData.files;

    const idxFile = !data.file
      ? tempFiles.findIndex(
          (file) => file.url === data.url && file.type === data.type,
        )
      : tempFiles.findIndex(
          (file) => file.file === data.file && file.type === data.type,
        );

    const updateFiles =
      idxFile !== -1
        ? [...tempFiles.slice(0, idxFile), ...tempFiles.slice(idxFile + 1)]
        : tempFiles;

    setFormData((prev) => ({
      ...prev,
      files: [...updateFiles],
    }));

    setShowFiles([...updateFiles.filter((file) => file.type === "assignment")]);
  };

  const onClose = () => {
    setAnswerKeys([{ name: "answer-key-1" }]);
    setTestCases([{ name: "test-case-1" }]);
    setModalOpen(null);
    setMessage("");
  };

  const handleOpenTrays = (i) => {
    if (openTrays.includes(i)) {
      setOpenTrays((prev) => [...prev.filter((j) => j !== i)]);
    } else {
      setOpenTrays((prev) => [...prev, i]);
    }
  };

  const handleAddOptionalFile = (e, type) => {
    const { name, files } = e.target;

    if (type === "answerkey") {
      const idx = answerKeys.findIndex((a) => a.name === name);
      const newData = { ...answerKeys[idx], file: files[0], type };

      const updatedAnswerKeys = answerKeys.map((item, index) =>
        index === idx ? newData : item,
      );

      const tempData = updatedAnswerKeys[answerKeys.length - 1];
      const tempName = tempData.name;
      const numberName = Number(tempName.split("-")[2]);
      const newName = `answer-key-${numberName + 1}`;
      const idxName = answerKeys.findIndex((a) => a.name === newName);

      if (idxName !== -1 || !tempData.file) {
        setAnswerKeys(updatedAnswerKeys);
      } else {
        setAnswerKeys([...updatedAnswerKeys, { name: newName }]);
      }
    }

    if (type === "testcase") {
      const idx = testCases.findIndex((a) => a.name === name);
      const newData = { ...testCases[idx], file: files[0], type };

      const updatedTestCases = testCases.map((item, index) =>
        index === idx ? newData : item,
      );

      const tempData = updatedTestCases[testCases.length - 1];
      const tempName = tempData.name;
      const numberName = Number(tempName.split("-")[2]);
      const newName = `test-case-${numberName + 1}`;
      const idxName = testCases.findIndex((a) => a.name === newName);

      if (idxName !== -1 || !tempData.file) {
        setTestCases(updatedTestCases);
      } else {
        setTestCases([...updatedTestCases, { name: newName }]);
      }
    }
  };

  const handleRemoveOptionalFile = (type) => {
    if (type === "answerkey" && answerKeys.length >= 2) {
      const secondLastIndex = answerKeys.length - 2;

      const modifiedItem = {
        name: answerKeys[secondLastIndex].name,
      };

      const updatedAnswerKeys = [
        ...answerKeys.slice(0, secondLastIndex),
        modifiedItem,
      ];

      setAnswerKeys(updatedAnswerKeys);
    }

    if (type === "testcase" && testCases.length >= 2) {
      const secondLastIndex = testCases.length - 2;

      const modifiedItem = {
        name: testCases[secondLastIndex].name,
      };

      const updatedTestCases = [
        ...testCases.slice(0, secondLastIndex),
        modifiedItem,
      ];

      setTestCases(updatedTestCases);
    }
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
          {isEdit ? "Edit Assignment" : "Create Assignment"}
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
            placeholder="Tugas Pertemuan 1"
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
            Descriptions *
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
            htmlFor="started_at"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Started At *
          </label>
          <input
            type="datetime-local"
            name="started_at"
            id="started_at"
            placeholder="Praktikum Pemrograman Berbasi Web"
            onChange={handleChange}
            value={formData.started_at}
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
            htmlFor="ended_at"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Ended At *
          </label>
          <input
            type="datetime-local"
            name="ended_at"
            id="ended_at"
            placeholder="Praktikum Pemrograman Berbasi Web"
            onChange={handleChange}
            value={formData.ended_at}
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
              Add File
              <input
                type="file"
                name="files"
                id="files"
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
                  {!file.file ? file.url : file.file.name}
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

        <div className="w-full flex flex-col justify-start items-start gap-2">
          <h2
            onClick={() => handleOpenTrays(1)}
            className={cn(
              "w-full",
              "text-xl text-primary font-semibold",
              "flex justify-between items-center",
              "hover:bg-gray-300 cursor-pointer",
            )}
          >
            <span>
              Upload Answer Key{" "}
              {!answerKeys[0]?.file
                ? "(Optional)"
                : `(${answerKeys.length - 1})`}
            </span>
            <FaChevronDown size={32} />
          </h2>

          <div
            className={cn(
              "flex flex-col gap-0.5",
              "w-full overflow-hidden transition-all duration-300 ease-in-out",
              openTrays.includes(1)
                ? "max-h-125 opacity-100 py-2"
                : "max-h-0 opacity-0 py-0",
            )}
          >
            <span className="text-sm text-orange-400 mb-2">
              * Sesuaikan dengan nomor soal yang dibuat
            </span>

            {answerKeys.map((item, i) => (
              <div key={i} className="w-full flex items-center">
                <label
                  className={cn("text-sm text-left font-light truncate flex-1")}
                  htmlFor={item.name}
                >
                  {item.name.toUpperCase()} : {item.file?.name || "-"}
                </label>

                <label
                  htmlFor={item.name}
                  className={cn(
                    "w-fit",
                    "p-2 rounded-t-md outline-none",
                    "text-sm text-center text-white font-normal truncate",
                    "bg-primary rounded-md",
                    "hover:scale-105 active:scale-95 transition-all cursor-pointer",
                  )}
                >
                  <input
                    type="file"
                    name={item.name}
                    id={item.name}
                    onChange={(e) => handleAddOptionalFile(e, "answerkey")}
                    className="hidden"
                  />

                  {item.file ? "Change" : "Add"}
                </label>

                <button
                  onClick={() => handleRemoveOptionalFile("answerkey")}
                  className={cn(
                    "w-fit",
                    "p-2 outline-none ml-0.5",
                    "bg-red-600 rounded-md text-white",
                    "hover:scale-105 active:scale-95 transition-all cursor-pointer",
                    !answerKeys[answerKeys.length - 2]?.file && "hidden",
                    i !== answerKeys.length - 1 && "hidden",
                  )}
                >
                  <FaTrash size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-2">
          <h2
            onClick={() => handleOpenTrays(2)}
            className={cn(
              "w-full",
              "text-xl text-primary font-semibold",
              "flex justify-between items-center",
              "hover:bg-gray-300 cursor-pointer",
            )}
          >
            <span>
              Upload Test Case{" "}
              {!testCases[0].file ? "(Optional)" : `(${testCases.length - 1})`}
            </span>
            <FaChevronDown size={32} />
          </h2>

          <div
            className={cn(
              "flex flex-col gap-0.5",
              "w-full overflow-hidden transition-all duration-300 ease-in-out",
              openTrays.includes(2)
                ? "max-h-125 opacity-100 py-2"
                : "max-h-0 opacity-0 py-0",
            )}
          >
            <span className="text-sm text-orange-400 mb-2">
              * Sesuaikan dengan answer key yang dibuat
            </span>

            {testCases.map((item, i) => (
              <div key={i} className="w-full flex items-center">
                <label
                  className={cn("text-sm text-left font-light truncate flex-1")}
                  htmlFor={item.name}
                >
                  {item.name.toUpperCase()} : {item.file?.name || "-"}
                </label>

                <label
                  htmlFor={item.name}
                  className={cn(
                    "w-fit",
                    "p-2 rounded-t-md outline-none",
                    "text-sm text-center text-white font-normal truncate",
                    "bg-primary rounded-md",
                    "hover:scale-105 active:scale-95 transition-all cursor-pointer",
                  )}
                >
                  <input
                    type="file"
                    name={item.name}
                    id={item.name}
                    onChange={(e) => handleAddOptionalFile(e, "testcase")}
                    accept=".txt"
                    className="hidden"
                  />

                  {item.file ? "Change" : "Add"}
                </label>

                <button
                  onClick={() => handleRemoveOptionalFile("testcase")}
                  className={cn(
                    "w-fit",
                    "p-2 outline-none ml-0.5",
                    "bg-red-600 rounded-md text-white",
                    "hover:scale-105 active:scale-95 transition-all cursor-pointer",
                    !testCases[testCases.length - 2]?.file && "hidden",
                    i !== testCases.length - 1 && "hidden",
                  )}
                >
                  <FaTrash size={15} />
                </button>
              </div>
            ))}
          </div>
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
