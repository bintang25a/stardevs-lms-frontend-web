import { useState } from "react";
import { cn } from "../../_utilities/cn";
import { FaUserPlus, FaXmark } from "react-icons/fa6";

export default function ClassroomForm({
  setModalOpen,
  user,
  handleSubmit,
  message,
  data,
}) {
  const [isJoin, setIsJoin] = useState(user?.role !== "asisten");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    name: data?.name ?? "",
    code: data?.code ?? "",
    description: data?.description ?? "",
    schedule: data?.schedule ?? "",
    assistant_emails: data ? [] : [user.email],
    _method: data && "PUT",
    isJoin: isJoin,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChecked = (e) => {
    const { checked } = e.target;

    setIsJoin(checked);

    setFormData((prev) => ({
      ...prev,
      isJoin: checked,
    }));
  };

  const handleEmailAdd = () => {
    const tempEmails = [...formData?.assistant_emails];

    if (tempEmails.includes(email)) {
      setEmail("");
    } else {
      tempEmails.push(email);
    }

    setFormData((prev) => ({
      ...prev,
      assistant_emails: tempEmails,
    }));

    setEmail("");
  };

  const handleEmailRemove = (data) => {
    const tempEmails = [...formData?.assistant_emails];

    const filtered = tempEmails.filter((m) => m !== data);

    setFormData((prev) => ({
      ...prev,
      assistant_emails: filtered,
    }));
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
          {data ? "Edit kelas" : isJoin ? "Gabung kelas" : "Buat kelas"}
        </h2>

        <div
          className={cn(
            "w-full",
            "flex justify-start items-center gap-2",
            user?.role !== "asisten" && "hidden",
            data && "hidden",
          )}
        >
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
            checked={isJoin}
            onChange={handleChecked}
          />
        </div>

        {message && (
          <span className={cn("text-sm text-red-600")}>{message}</span>
        )}

        <div className={cn("w-full", "flex flex-col", isJoin && "hidden")}>
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
              "hover:shadow-sm hover:shadow-primary",
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="code"
            className={cn("text-gray-800 text-base font-normal")}
          >
            {isJoin ? "Input Classroom Code" : "Class Code *"}
          </label>
          <input
            type="text"
            name="code"
            id="code"
            placeholder={!isJoin && "PBW-A1-2026"}
            onChange={handleChange}
            value={formData.code}
            className={cn(
              "w-full",
              "bg-white border-b border-b-primary",
              "p-2 rounded-t-md outline-none",
              "text-sm text-primary font-normal",
              "hover:shadow-sm hover:shadow-primary",
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col", isJoin && "hidden")}>
          <label
            htmlFor="assistant_emails"
            className={cn("text-gray-800 text-base font-normal")}
          >
            Add Mentor by Email *
          </label>
          <div className={cn("flex items-center justify-center gap-1")}>
            <input
              type="text"
              name="assistant_emails"
              id="assistant_emails"
              placeholder="bintangalfizar25@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className={cn(
                "w-full",
                "bg-white border-b border-b-primary",
                "p-2 rounded-t-md outline-none",
                "text-sm text-primary font-normal",
                "hover:shadow-sm hover:shadow-primary",
              )}
            />
            <button
              onClick={handleEmailAdd}
              disabled={!email}
              className={cn(
                "w-fit",
                "flex justify-center items-center",
                "cursor-pointer p-2 rounded-sm",
                "bg-primary text-white",
                "hover:scale-105 active:scale-95 transition-all",
                "disabled:opacity-50 disabled:cursor-default",
              )}
            >
              <FaUserPlus />
            </button>
          </div>
          <div
            className={cn(
              "flex flex-wrap justify-start items-start gap-1",
              "mt-0.5",
            )}
          >
            {formData?.assistant_emails?.map((email, i) => (
              <label
                key={i}
                className={cn(
                  "flex items-center gap-2",
                  "bg-thirdnary",
                  "px-2 py-0.5 rounded-full",
                  "text-sm",
                )}
              >
                {email}{" "}
                <FaXmark
                  onClick={() => handleEmailRemove(email)}
                  className={cn("cursor-pointer")}
                />
              </label>
            ))}
          </div>
        </div>

        <div className={cn("w-full", "flex flex-col", isJoin && "hidden")}>
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
              "hover:shadow-sm hover:shadow-primary",
            )}
          />
        </div>

        <div className={cn("w-full", "flex flex-col", isJoin && "hidden")}>
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
            onClick={() => handleSubmit(formData, "create")}
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
            )}
          >
            {data ? "Simpan" : isJoin ? "Gabung" : "Buat"}
          </button>
        </div>
      </div>
    </div>
  );
}
