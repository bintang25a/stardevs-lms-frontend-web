import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cn } from "../../../_utilities/cn";
import {
  FaDownload,
  FaEllipsisVertical,
  FaArrowUpRightFromSquare,
  FaClipboardList,
  FaClock,
  FaPlus,
  FaCheck,
} from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { fileDownload } from "../../../_services/actions";
import { isoToLongDate } from "../../../_utilities/isoToLongDate";
import { isoToSchedule } from "../../../_utilities/isoToSchedule";
import ConfirmDelete from "../../../components/modal/ConfirmDelete";
import { deleteAssignment } from "../../../_services/assignments";
import { isoToLongDateTime } from "../../../_utilities/isoToLongDateTime";

export default function Assignment() {
  const { user, classroom, setModalOpen, setEditData, setRefresh } =
    useOutletContext();

  const { id, assignmentId } = useParams();

  const navigate = useNavigate();

  const [isInit, setIsInit] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    message: "Material",
    action: deleteAssignment,
    id: assignmentId,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data =
          classroom?.assignments?.find((data) => data.id == assignmentId) ||
          null;

        if (!data) {
          navigate(`/classrooms/${id}/assignments`, { replace: true });
          return;
        }

        const isSubmitted = data?.submissions?.some(
          (s) => s?.student_id === user?.id,
        );

        setIsSubmit(isSubmitted);

        const type = ["assignment", "answerkey", "testcase"];

        const files = classroom?.files?.filter(
          (file) => file.class_id == assignmentId && type.includes(file.type),
        );

        setAssignment({ ...data, files });
      } catch (error) {
        console.log(error);
      } finally {
        setIsInit(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleFileDownload = async (file) => {
    const { id, file_name: name, file_url: url } = file;

    if (url.includes("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    await fileDownload(id, name);
  };

  const handleModalOpen = () => {
    setModalOpen("assignment");
    setEditData(assignment);
  };

  const handleSubmitOpen = (data = null) => {
    setModalOpen("submission");

    setEditData({
      title: assignment?.title,
      assignment_id: assignmentId,
      submission: data,
    });
  };

  const files = [
    {
      header: "Assignment Files",
      type: "assignment",
    },
    {
      header: "Answer Key Files",
      type: "answerkey",
    },
    {
      header: "Test Case Files",
      type: "testcase",
    },
  ];

  const isLate = () => {
    const now = new Date();
    const dueTime = new Date(assignment?.ended_at);
    const tempIsLate = now > dueTime;

    return tempIsLate;
  };

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
          "w-full h-full px-8 py-8",
          "bg-gray-100 rounded-lg shadow-xs shadow-gray-500",
          "flex flex-col justify-start items-start gap-4",
          "relative",
          isInit && "hidden",
        )}
      >
        <header
          className={cn(
            "w-full flex flex-wrap md:flex-nowrap justify-start items-center gap-2 relative",
          )}
        >
          <div className="bg-gray-300 rounded-full border border-primary text-primary p-4">
            <FaClipboardList size={28} />
          </div>

          <h2
            className={cn(
              "text-xl text-primary font-semibold",
              "border-b-2 border-b-primary",
              "md:truncate",
            )}
          >
            {assignment?.title}
          </h2>

          <div
            className={cn(
              "md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2",
              "flex justify-center items-center gap-2",
            )}
          >
            <button
              onClick={() => handleSubmitOpen()}
              disabled={isLate() || isSubmit}
              className={cn(
                "py-1.5 px-3",
                "rounded-xl border border-blue-500",
                "text-black text-md font-normal",
                "flex justify-center items-center gap-2",
                "transition-all cursor-pointer",
                user.role !== "praktikan" && "hidden",
                isLate() && !isSubmit && "bg-red-600 text-white",
                isSubmit
                  ? "bg-green-500 border-none hover:bg-green-500 active:bg-green-500"
                  : "hover:scale-105 active:scale-95 hover:bg-blue-500 active:bg-blue-500",
              )}
            >
              {isSubmit ? (
                <>
                  Submitted <FaCheck />
                </>
              ) : isLate() ? (
                <>
                  Closed, Too Late! <FaClock size={16} />
                </>
              ) : (
                <>
                  Submit <FaPlus size={16} />
                </>
              )}
            </button>

            <a
              className={cn(
                "py-1.5 px-3",
                "rounded-xl border border-primary",
                "text-black text-md font-normal",
                "flex justify-center items-center gap-2",
                "transition-all cursor-pointer",
                "hover:scale-105 active:scale-95 hover:bg-thirdnary active:bg-thirdnary",
                user.role === "praktikan" && !isSubmit && "hidden",
              )}
            >
              {user.role === "asisten" ? "See all Answers" : "See Answer"}
              <FaArrowUpRightFromSquare />
            </a>

            <div
              className={cn(
                "flex flex-col justify-start items-end gap-1",
                user.role === "praktikan" && "hidden",
              )}
            >
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className={cn(
                  "hover:bg-gray-300",
                  "p-1 rounded-md",
                  "transition-all cursor-pointer",
                )}
              >
                <FaEllipsisVertical size={24} />
              </button>

              <div
                className={cn(
                  "absolute -bottom-25",
                  "w-fit h-fit py-2",
                  "flex flex-col justify-start items-start gap-1",
                  "text-lg text-black",
                  "bg-gray-200 rounded-lg shadow-md shadow-gray-600",
                  !openMenu && "hidden",
                )}
              >
                <button
                  onClick={handleModalOpen}
                  className={cn(
                    "px-6 py-1 w-full",
                    "cursor-pointer hover:bg-gray-300 ",
                    "disabled:text-gray-500 text-left",
                  )}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setConfirmDelete({ ...confirmDelete, isOpen: true })
                  }
                  className={cn(
                    "px-6 py-1 w-full",
                    "cursor-pointer hover:bg-gray-300 ",
                    "disabled:text-gray-500 text-left",
                  )}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </header>

        <main
          className={cn(
            "w-full h-full min-h-30 py-4",
            "border-t-2 border-gray-500",
            "flex flex-col xl:flex-row justify-start items-start gap-2 xl:gap-0",
          )}
        >
          <div
            className={cn(
              "flex-1 w-full xl:min-w-3/5 h-full",
              "xl:border-r border-gray-500",
              "xl:px-8",
              "flex flex-col gap-2",
            )}
          >
            <h3 className="text-lg text-primary font-medium">Description</h3>

            <pre className="text-md h-full text-gray-700 text-justify font-light overflow-auto">
              {assignment?.description}
            </pre>

            <div>
              <ul
                className={cn(
                  "flex flex-col gap-1",
                  "text-black text-md font-semibold",
                )}
              >
                <li>
                  Start date :{" "}
                  <span className="font-normal text-gray-700">
                    {isoToLongDateTime(assignment?.started_at)}
                  </span>
                </li>
                <li>
                  Due date :{" "}
                  <span
                    className={cn(
                      "font-normal text-gray-700",
                      isLate() && "text-red-500",
                    )}
                  >
                    {isoToLongDateTime(assignment?.ended_at)}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={cn(
              "flex-1 w-full xl:min-w-2/5 h-full",
              "border-b-2 xl:border-none border-gray-500",
              "xl:px-8",
              "flex flex-col gap-2",
            )}
          >
            {files?.map((file, idx) => {
              const classFiles = assignment?.files?.filter(
                (f) => f.type === file.type,
              );

              if (classFiles?.length < 1) return;

              return (
                <React.Fragment key={idx}>
                  <h3 className="text-lg text-primary font-medium">
                    {file.header}
                  </h3>

                  {classFiles?.map((f, i) => {
                    const isUrl = f?.file_url?.includes("http");

                    return (
                      <div
                        key={i}
                        title="Clict to Open or Download"
                        onClick={() => handleFileDownload(f)}
                        className={cn(
                          "w-full py-1 pl-3",
                          "border border-primary rounded-md",
                          "flex items-center justify-between",
                          "hover:bg-gray-200 hover:scale-105 active:bg-gray-200",
                          "cursor-pointer transition-all",
                        )}
                      >
                        <h4 className="text-xs text-black font-normal truncate">
                          {f?.file_name}
                        </h4>

                        <button
                          onClick={() => handleFileDownload(f)}
                          className={cn(
                            "w-fit h-fit px-1 border-l border-gray-500 text-primary cursor-pointer",
                          )}
                        >
                          {isUrl ? (
                            <FaArrowUpRightFromSquare />
                          ) : (
                            <FaDownload />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>

          <ConfirmDelete
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
            setRefresh={setRefresh}
          />
        </main>

        <footer
          className={cn(
            "w-full h-fit flex flex-col xl:flex-row justify-between items-center",
            "text-md text-secondary font-normal",
          )}
        >
          <span className={cn("hidden md:block")}>
            Created At: {isoToLongDate(assignment?.created_at)}
          </span>

          <span>
            {classroom?.name} | {isoToSchedule(classroom?.schedule)}
          </span>
        </footer>
      </div>
    </div>
  );
}
