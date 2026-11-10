import { useState } from "react";
import { cn } from "../../_utilities/cn";
import { addMember } from "../../_services/member";
import { FaUserPlus, FaXmark } from "react-icons/fa6";

export default function MemberAdd({
  role,
  isOpen,
  classroomId,
  setModalOpen,
  setShowToast,
  setRefresh,
}) {
  const convRole = {
    assistant: "asisten",
    student: "praktikan",
  };

  const tempForm = {
    uids: [],
    classroom_id: String(classroomId),
  };

  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(tempForm);

  const handleSubmit = async () => {
    const fd = {
      ...formData,
      role: convRole[role],
    };

    try {
      setIsLoading(true);

      const res = addMember(fd);

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
    setMessage("");
    setFormData(tempForm);
    setModalOpen({ isOpen: false });
  };

  const handleUidAdd = () => {
    const tempUids = [...formData?.uids];

    if (tempUids.includes(uid)) {
      setUid("");
    } else {
      tempUids.push(uid);
    }

    setFormData((prev) => ({
      ...prev,
      uids: tempUids,
    }));

    setUid("");
  };

  const handleUidRemove = (data) => {
    const tempUids = [...formData?.uids];

    const filtered = tempUids.filter((m) => m !== data);

    setFormData((prev) => ({
      ...prev,
      uids: filtered,
    }));
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
        <h2 className={cn("text-xl text-primary font-semibold")}>Add {role}</h2>

        {message && (
          <span className={cn("text-sm text-red-600")}>{message}</span>
        )}

        <div className={cn("w-full", "flex flex-col")}>
          <label
            htmlFor="uid"
            className={cn("text-gray-800 text-base font-normal")}
          >
            NIM / Email
          </label>
          <div className={cn("flex items-center justify-center gap-1")}>
            <input
              type="text"
              name="uid"
              id="uid"
              placeholder={`Add ${role} by NIM or Email`}
              onChange={(e) => setUid(e.target.value)}
              value={uid}
              className={cn(
                "w-full",
                "bg-white border-b border-b-primary",
                "p-2 rounded-t-md outline-none",
                "text-sm text-primary font-normal",
                "hover:shadow-sm hover:shadow-primary",
              )}
            />
            <button
              onClick={handleUidAdd}
              disabled={!uid}
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
              "mt-1.5",
            )}
          >
            {formData?.uids?.map((uid, i) => (
              <label
                key={i}
                className={cn(
                  "flex items-center gap-2",
                  "bg-thirdnary",
                  "px-2 py-0.5 rounded-full",
                  "text-sm",
                )}
              >
                {uid}{" "}
                <FaXmark
                  onClick={() => handleUidRemove(uid)}
                  className={cn("cursor-pointer")}
                />
              </label>
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
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              "hover:bg-thirdnary active:bg-thirdnary transition-all",
              "py-1 px-3 rounded-2xl",
              "cursor-pointer",
              "text-lg text-primary font-medium",
              "disabled:opacity-50",
            )}
          >
            Add {role}
          </button>
        </div>
      </div>
    </div>
  );
}
