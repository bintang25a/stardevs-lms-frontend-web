import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cn } from "../../../_utilities/cn";
import {
  FaDownload,
  FaEllipsisVertical,
  FaArrowUpRightFromSquare,
  FaClipboardList,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import { fileDownload } from "../../../_services/actions";
import { isoToLongDate } from "../../../_utilities/isoToLongDate";
import { isoToSchedule } from "../../../_utilities/isoToSchedule";
import ConfirmDelete from "../../../components/modal/ConfirmDelete";
import { deleteAssignment } from "../../../_services/assignments";

export default function Assignment() {
  const { user, classroom, setModalOpen, setEditData, setRefresh } =
    useOutletContext();

  const { id, assignmentId } = useParams();

  const navigate = useNavigate();

  const [isInit, setIsInit] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
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
        }

        const files = classroom?.files?.filter(
          (file) => file.class_id == assignmentId && file.type === "assignment",
        );

        console.log(files);

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
          "w-full xl:w-4/5 h-full px-8 py-8",
          "bg-gray-100 rounded-lg shadow-xs shadow-gray-500",
          "flex flex-col justify-start items-start gap-4",
          "relative",
          isInit && "hidden",
        )}
      >
        <header className="flex justify-start items-center gap-2">
          <div className="bg-gray-300 rounded-full border border-primary text-primary p-4">
            <FaClipboardList size={28} />
          </div>

          <h2
            className={cn(
              "text-xl text-primary font-semibold",
              "border-b-2 border-b-primary",
            )}
          >
            {assignment?.title}
          </h2>
        </header>

        <main
          className={cn(
            "w-full h-full min-h-30 py-4",
            "border-t-2 border-gray-500",
            "flex flex-col xl:flex-row justify-start items-start",
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

            <p className="text-md text-gray-700 text-justify font-light overflow-auto">
              {assignment?.description}
            </p>
          </div>

          <div
            className={cn(
              "flex-1 w-full xl:min-w-2/5 h-full",
              "border-b-2 xl:border-none border-gray-500",
              "xl:px-8",
              "flex flex-col gap-2",
            )}
          >
            <h3 className="text-lg text-primary font-medium">Material Files</h3>

            {assignment?.files?.map((file, i) => {
              const isUrl = file?.file_url?.includes("http");

              return (
                <div
                  key={i}
                  title="Clict to Open or Download"
                  onClick={() => handleFileDownload(file)}
                  className={cn(
                    "w-full py-1 pl-3",
                    "border border-primary rounded-md",
                    "flex items-center justify-between",
                    "hover:bg-gray-200 hover:scale-105 active:scale-95",
                    "cursor-pointer transition-all",
                  )}
                >
                  <h4 className="text-xs text-black font-normal truncate">
                    {file?.file_name}
                  </h4>

                  <button
                    onClick={() => handleFileDownload(file)}
                    className={cn(
                      "w-fit h-fit px-1 border-l border-gray-500 text-primary cursor-pointer",
                    )}
                  >
                    {isUrl ? <FaArrowUpRightFromSquare /> : <FaDownload />}
                  </button>
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "absolute right-2 top-2",
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
