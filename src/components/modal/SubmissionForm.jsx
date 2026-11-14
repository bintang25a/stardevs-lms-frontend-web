import { useEffect, useState } from "react";
import { cn } from "../../_utilities/cn";
import {
  FaArrowUpRightFromSquare,
  FaFile,
  FaLink,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import {
  createSubmission,
  showSubmission,
  updateSubmission,
} from "../../_services/submissions";
import { getLocalDateTime } from "../../_utilities/getLocalDateTime";
import { isoToLongDateTime } from "../../_utilities/isoToLongDateTime";

export default function SubmissionForm({
  isOpen,
  data = { submission: null },
  setEditData,
  setModalOpen,
  setIsLoading,
  setShowToast,
  setRefresh,
}) {
  const tempForm = {
    answer: "",
    assignment_id: data?.assignment_id,
    submitted_at: getLocalDateTime(),
    files: [],
    files_remove_ids: [],
  };

  const [isFetching, setIsFetching] = useState(false);
  const [showUrls, setShowUrls] = useState([]);
  const [answerFiles, setAnswerFiles] = useState([{ name: "answer-file-1" }]);
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(tempForm);
  const [id, setId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsFetching(true);

      try {
        let item = null;

        if (typeof data === "string" || typeof data === "number") {
          const { data: resData } = await showSubmission(data);

          item = resData;
        } else if (data?.submission) {
          item = data?.submission;
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
          answer: "",
          assignment_id: data?.assignment_id,
          submitted_at: getLocalDateTime(),
          files: [...convertFiles],
          files_remove_ids: [],
          _method: "PUT",
        });

        const tempAnswers = convertFiles.filter(
          (f) => !f?.url?.includes("http"),
        );

        setShowUrls(convertFiles.filter((f) => f?.url?.includes("http")));

        setAnswerFiles([
          ...tempAnswers,
          { name: `answer-file-${tempAnswers.length + 1}` },
        ]);

        setId(item?.id);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    if (data && data.submission && isOpen) {
      fetchData();
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(isoToLongDateTime(now, true));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    const tempAnswerKeys = answerFiles.filter((a) => a.file && a.isNew);
    const tempFiles = showUrls.filter((file) => file.isNew);

    const fd = { ...formData, files: [...tempFiles, ...tempAnswerKeys] };

    console.log(fd);

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
        ? await updateSubmission(id, payload)
        : await createSubmission(payload);

      setShowToast({ isOpen: true, title: "Success", message: res?.message });
      setRefresh((prev) => !prev);
      setFormData(tempForm);
      setShowUrls([]);
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
    const idx = showUrls.findIndex((temp) => temp.url === fileUrl);

    if (idx === -1 && fileUrl !== "") {
      const newUrl = {
        isNew: true,
        name: "",
        url: fileUrl,
        type: "submission",
      };

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, newUrl],
      }));

      setShowUrls([...showUrls, newUrl]);
    }

    setFileUrl("");
  };

  const handleRemoveUrl = (data) => {
    const idxFile = showUrls.findIndex(
      (file) => file.url === data.url && file.type === data.type,
    );

    const updateFiles =
      idxFile !== -1
        ? [...showUrls.slice(0, idxFile), ...showUrls.slice(idxFile + 1)]
        : showUrls;

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

    setShowUrls([...updateFiles]);
  };

  const onClose = () => {
    setAnswerFiles([{ name: "answer-file-1" }]);
    setMessage("");
    setEditData(null);
    setShowUrls([]);
    setModalOpen(null);
    setFormData(tempForm);
  };

  const handleAddFile = (e) => {
    const { name, files } = e.target;

    if (files[0].size > MAX_FILE_SIZE) {
      setMessage("File can't be more than 20MB");
      return;
    }

    const idx = answerFiles.findIndex((a) => a.name === name);
    const newData = {
      ...answerFiles[idx],
      file: files[0],
      type: "submission",
      isNew: true,
    };

    const updatedAnswerFiles = answerFiles.map((item, index) =>
      index === idx ? newData : item,
    );

    const tempData = updatedAnswerFiles[answerFiles.length - 1];
    const tempName = tempData.name;
    const numberName = Number(tempName.split("-")[2]);
    const newName = `answer-file-${numberName + 1}`;
    const idxName = answerFiles.findIndex((a) => a.name === newName);

    if (idxName !== -1 || !tempData.file) {
      setAnswerFiles(updatedAnswerFiles);
    } else {
      setAnswerFiles([...updatedAnswerFiles, { name: newName }]);
    }
  };

  const handleRemoveOptionalFile = () => {
    if (answerFiles.length >= 2) {
      const secondLastIndex = answerFiles.length - 2;
      const tempData = answerFiles[secondLastIndex];

      const modifiedItem = {
        name: tempData.name,
      };

      const updatedAnswerFiles = [
        ...answerFiles.slice(0, secondLastIndex),
        modifiedItem,
      ];

      if (tempData.id) {
        setFormData((prev) => ({
          ...prev,
          files_remove_ids: [...prev.files_remove_ids, tempData.id],
        }));
      }

      setAnswerFiles(updatedAnswerFiles);
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
          {id ? "Submit " : "Edit "}
          Submission:
          {` ${data?.title}`}
        </h2>

        {message && (
          <span className={cn("text-sm text-red-600")}>{message}</span>
        )}

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="submitted_at"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Submitted At
          </label>
          <input
            type="string"
            name="submitted_at"
            id="submitted_at"
            placeholder="Praktikum Pemrograman Berbasi Web"
            onChange={handleChange}
            value={currentTime}
            disabled
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="answer"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Answer
          </label>
          <textarea
            rows={8}
            type="text"
            name="answer"
            id="answer"
            onChange={handleChange}
            value={formData.answer}
            disabled={isFetching}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal font-mono",
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
            External Link
          </label>

          <div
            className={cn(
              "w-full",
              "flex flex-wrap xl:flex-row gap-1 justify-center items-center",
            )}
          >
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
                "disabled:opacity-50",
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
            {showUrls.map((file, i) => (
              <div
                key={i}
                className={cn(
                  "w-fit max-w-40 ",
                  "bg-gray-400 rounded-full",
                  "py-1 px-3",
                  "flex justify-between items-center gap-1",
                )}
              >
                <a
                  href={file?.url || ""}
                  target="_blank"
                  disabled={!file.url}
                  rel="noopener noreferrer"
                  className="flex justify-center items-center cursor-pointer"
                  onClick={(e) => {
                    if (!file?.url) {
                      e.preventDefault();
                    }
                  }}
                >
                  {file.url ? <FaArrowUpRightFromSquare /> : <FaFile />}
                </a>

                <span className="text-black text-sm font-light truncate">
                  {!file.file ? file.name || file.url : file.file.name}
                </span>

                <button
                  disabled={isFetching}
                  onClick={() => handleRemoveUrl(file)}
                  className="flex justify-center items-center cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-2">
          <h2
            className={cn(
              "w-full",
              "text-xl text-primary font-semibold",
              "flex justify-between items-center",
            )}
          >
            <span>
              Upload Answer File{" "}
              {answerFiles[0]?.type && `(${answerFiles.length - 1})`}
            </span>
          </h2>

          <div
            className={cn(
              "flex flex-col gap-0.5",
              "w-full overflow-hidden transition-all duration-300 ease-in-out",
              "max-h-125 opacity-100 py-2",
            )}
          >
            <span className="text-sm text-orange-400 mb-2">
              * Sesuaikan dengan nomor test case (jika ada)
            </span>

            {answerFiles.map((item, i) => (
              <div key={i} className="w-full flex items-center">
                <label
                  className={cn("text-sm text-left font-light truncate flex-1")}
                  htmlFor={item.name}
                >
                  {item.name.toUpperCase()} :{" "}
                  {item.file?.name || item.file_name || "-"}
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
                    disabled={isFetching}
                    onChange={handleAddFile}
                    className="hidden"
                  />

                  {item.file ? "Change" : "Add"}
                </label>

                <button
                  disabled={isFetching}
                  onClick={handleRemoveOptionalFile}
                  className={cn(
                    "w-fit",
                    "p-2 outline-none ml-0.5",
                    "bg-red-600 rounded-md text-white",
                    "hover:scale-105 active:scale-95 transition-all cursor-pointer",
                    "disabled:opacity-50",
                    (i !== answerFiles.length - 1 ||
                      (!answerFiles[answerFiles.length - 2]?.file &&
                        !answerFiles[answerFiles.length - 2]?.id)) &&
                      "hidden",
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
