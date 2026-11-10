import { useOutletContext } from "react-router-dom";
import { cn } from "../../../_utilities/cn";
import { FaUserPlus } from "react-icons/fa6";
import MemberAdd from "../../../components/modal/MemberAdd";
import { useState } from "react";

export default function members() {
  const { user, classroom, setRefresh, setShowToast } = useOutletContext();

  const assistants = classroom?.assistants || [];
  const students = classroom?.students || [];

  const isAssist = user?.role === "asisten";

  const [modalOpen, setModalOpen] = useState({ isOpen: false });

  return (
    <div
      className={cn(
        "w-full h-full p-4",
        "flex flex-col gap-2 xl:gap-3 justify-start items-center",
        "overflow-auto",
      )}
    >
      <div
        className={cn(
          "w-9/10 xl:w-6/10 py-4",
          "flex flex-col justify-start items-center",
        )}
      >
        <div
          className={cn(
            "w-full py-3",
            "flex justify-between items-center gap-2",
            "border-b border-b-gray-500",
            "relative",
            isAssist ? "pr-12" : "pr-0",
          )}
        >
          <h2 className="text-xl font-medium">Assitants/Lecturer</h2>

          <span className="text-sm font-light">
            Total: {students.length || 0}
          </span>

          <button
            title="Add Lecturer"
            onClick={() => setModalOpen({ isOpen: true, role: "assistant" })}
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2",
              "p-2 rounded-full",
              "hover:bg-thirdnary cursor-pointer transition-all",
              !isAssist && "hidden",
            )}
          >
            <FaUserPlus size={20} />
          </button>
        </div>

        {assistants.map((a, i) => (
          <div
            key={i}
            className={cn(
              "w-full py-3 px-2",
              "flex justify-start items-center gap-2",
              "border-b border-b-gray-500",
              "hover:bg-gray-200 transition-all",
            )}
          >
            <div
              className={cn(
                "max-w-8 max-h-8 xl:max-w-8 xl:max-h-8 w-100 h-100 rounded-full",
                "overflow-hidden",
                "flex justify-center items-center",
                a.photo ? "border border-gray-800" : "bg-blue-500",
              )}
            >
              {a.photo ? (
                <img
                  className="w-full h-full object-cover"
                  src={a?.photo}
                  alt="Photo"
                />
              ) : (
                <div
                  className={cn("text-black", "text-2xl xl:text-4xl font-bold")}
                >
                  {a?.name[0]}
                </div>
              )}
            </div>

            <h3 className="text-sm text-gray-800 font-medium">{a?.name}</h3>
          </div>
        ))}

        <div
          className={cn(
            "w-full py-3 mt-3",
            "flex justify-between items-center gap-2",
            "border-b border-b-gray-500",
            "relative",
            isAssist ? "pr-12" : "pr-0",
          )}
        >
          <h2 className="text-xl font-medium">Students</h2>

          <span className="text-sm font-light">
            Total: {students.length || 0}
          </span>

          <button
            title="Add Students"
            onClick={() => setModalOpen({ isOpen: true, role: "student" })}
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2",
              "p-2 rounded-full",
              "hover:bg-thirdnary cursor-pointer transition-all",
              !isAssist && "hidden",
            )}
          >
            <FaUserPlus size={20} />
          </button>
        </div>

        {students.map((s, i) => (
          <div
            key={i}
            className={cn(
              "w-full py-3 px-2",
              "flex justify-start items-center gap-2",
              "border-b border-b-gray-500",
              "hover:bg-gray-200 transition-all",
            )}
          >
            <div
              className={cn(
                "max-w-8 max-h-8 xl:max-w-8 xl:max-h-8 w-100 h-100 rounded-full",
                "overflow-hidden",
                "flex justify-center items-center",
                s.photo ? "border border-gray-800" : "bg-blue-500",
              )}
            >
              {s.photo ? (
                <img
                  className="w-full h-full object-cover"
                  src={s?.photo}
                  alt="Photo"
                />
              ) : (
                <div
                  className={cn("text-black", "text-2xl xl:text-4xl font-bold")}
                >
                  {s?.name[0]}
                </div>
              )}
            </div>

            <h3 className="text-sm text-gray-800 font-medium">{s?.name}</h3>
          </div>
        ))}
      </div>

      <MemberAdd
        role={modalOpen?.role}
        isOpen={modalOpen?.isOpen}
        classroomId={classroom?.id}
        setModalOpen={setModalOpen}
        setShowToast={setShowToast}
        setRefresh={setRefresh}
      />
    </div>
  );
}
