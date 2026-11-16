import {
  FaChalkboard,
  FaChevronDown,
  FaClipboardList,
  FaCode,
  FaDoorOpen,
  FaHouse,
  FaServer,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { href, Link, useNavigate, useParams } from "react-router-dom";
import { logout } from "../../_services/auth";
import { useEffect, useMemo, useState } from "react";

export default function PublicSidebar({
  isOpen,
  handleToggleMenu,
  isLoading,
  setIsLoading,
  classrooms,
}) {
  const navigate = useNavigate();

  const { id } = useParams();

  const [openTrays, setOpenTrays] = useState([]);

  const pathname = window.location.pathname;
  const paths = pathname?.split("/");

  const assignments = useMemo(() => {
    return (
      classrooms?.flatMap((c) => {
        const classAssignments = c?.assignments || [];

        return classAssignments.map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          classId: c.id,
        }));
      }) || []
    );
  }, [classrooms]);

  useEffect(() => {
    if (classrooms?.length > 0) {
      setOpenTrays((prev) => {
        if (!prev.includes("classroom")) {
          return [...prev, "classroom"];
        }
        return prev;
      });
    }

    if (assignments?.length > 0) {
      setOpenTrays((prev) => {
        if (!prev.includes("assignment")) {
          return [...prev, "assignment"];
        }
        return prev;
      });
    }
  }, [classrooms, assignments]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await logout();
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/login", { replace: true });
      setIsLoading(false);
    }
  };

  const handleOpenTrays = (name) => {
    if (openTrays.includes(name)) {
      setOpenTrays(openTrays?.filter((tray) => tray !== name));
    } else [setOpenTrays([...openTrays, name])];
  };

  return (
    <aside
      className={cn(
        "w-2/3 h-full fixed top-0 z-50",
        "bg-secondary p-2 pt-16",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "xl:static xl:translate-x-0 xl:z-10",
        "xl:min-w-1/6 xl:w-1/6 xl:pt-4",
        "overflow-auto",
        "flex flex-col justify-between items-center gap-4",
      )}
    >
      <button
        title="Close"
        onClick={handleToggleMenu}
        className={cn(
          "absolute right-4 top-4",
          "border p-1 rounded-md",
          "text-white",
          "hover:text-primary active:scale-90 transition-all",
          "cursor-pointer",
          "xl:hidden",
        )}
      >
        <FaXmark />
      </button>

      <ul
        className={cn(
          "h-fit w-full max-w-full",
          "flex flex-col gap-1",
          "xl:border-0",
          "border-t border-white xl:border-none",
        )}
      >
        <li onClick={handleToggleMenu}>
          <Link
            title="Dashboard"
            to={"/"}
            className={cn(
              "flex justify-start items-center gap-4",
              "px-4 py-2 relative",
              "text-lg text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary",
              paths[0] === "" && paths[1] === "" && "bg-thirdnary",
            )}
          >
            <FaHouse size={24} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li
          onClick={handleToggleMenu}
          className={cn(
            "flex flex-col",
            openTrays.includes("classroom") && "gap-1",
          )}
        >
          <Link
            title="Classroom"
            to={"/classrooms"}
            className={cn(
              "flex justify-start items-center gap-4",
              "px-4 py-2 relative overflow-hidden",
              "text-lg text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary",
              paths[1] === "classrooms" &&
                (!paths[2] || !openTrays.includes("classroom")) &&
                !paths[3] &&
                "bg-thirdnary",
            )}
          >
            <FaChalkboard size={24} />
            <span>Classroom</span>

            <button
              className={cn(
                "ml-auto transition-all cursor-pointer",
                classrooms?.length === 0 && "hidden",
                openTrays.includes("classroom") && "rotate-z-180",
              )}
            >
              <FaChevronDown />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenTrays("classroom");
              }}
              className={cn(
                "h-full w-1/3 z-10",
                "bg-transparent absolute right-0",
                "cursor-pointer",
              )}
              disabled={classrooms?.length === 0}
            />
          </Link>

          <ul
            className={cn(
              "grid transition-all duration-300 ease-in-out m-0 p-0",
              !openTrays.includes("classroom")
                ? "grid-rows-[0fr] opacity-0"
                : "grid-rows-[1fr] opacity-100",
            )}
          >
            <div className="overflow-hidden flex flex-col gap-1 p-2 pl-6 xl:p-0 xl:pl-6">
              {classrooms?.map((c, i) => (
                <li key={i}>
                  <Link
                    title={c?.name}
                    to={`/classrooms/${c?.id}`}
                    className={cn(
                      "flex justify-start items-center gap-2",
                      "p-2",
                      "text-md text-gray-100",
                      "hover:bg-thirdnary rounded-full transition-all",
                      "active:scale-95 active:bg-thirdnary",
                      paths[2] == c?.id && "bg-thirdnary",
                    )}
                  >
                    <div className="p-1.5 border border-white text-white rounded-full">
                      <FaChalkboard size={15} />
                    </div>
                    <span className="truncate flex-1">{c?.name}</span>
                  </Link>
                </li>
              ))}
            </div>
          </ul>
        </li>

        <li
          className={cn(
            "flex flex-col",
            openTrays.includes("assignment") && "gap-1",
          )}
        >
          <button
            onClick={() => handleOpenTrays("assignment")}
            disabled={assignments?.length === 0}
            className={cn(
              "flex justify-start items-center gap-4",
              "px-4 py-2 w-full cursor-pointer",
              "text-lg text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary disabled:text-gray-400 disabled:hover:bg-transparent",
              paths[3] === "assignments" &&
                !openTrays.includes("assignment") &&
                "bg-thirdnary",
            )}
          >
            <FaClipboardList className="min-w-fit" size={24} />
            <span className="truncate">Assignments</span>

            <div
              className={cn(
                "ml-auto transition-all",
                assignments?.length === 0 && "hidden",
                openTrays.includes("assignment") && "rotate-z-180",
              )}
            >
              <FaChevronDown />
            </div>
          </button>

          <ul
            className={cn(
              "grid transition-all duration-300 ease-in-out m-0 p-0",
              !openTrays.includes("assignment")
                ? "grid-rows-[0fr] opacity-0"
                : "grid-rows-[1fr] opacity-100",
            )}
          >
            <div className="overflow-hidden flex flex-col gap-1 p-2 pl-6 xl:p-0 xl:pl-6">
              {assignments?.map((item, index) => {
                const targetUrl = `/classrooms/${item?.classId}/assignments/${item?.id}`;

                const DynamicTag = item?.classId == id ? Link : "a";

                const dynamicProps =
                  item?.classId == id ? { to: targetUrl } : { href: targetUrl };

                return (
                  <li key={index}>
                    <DynamicTag
                      title={item?.title}
                      {...dynamicProps}
                      className={cn(
                        "flex justify-start items-center gap-2",
                        "p-2",
                        "text-md text-gray-100",
                        "hover:bg-thirdnary rounded-full transition-all",
                        "active:scale-95 active:bg-thirdnary",
                        paths[3] === "assignments" &&
                          paths[4] == item?.id &&
                          "bg-thirdnary",
                      )}
                    >
                      <div className="p-1.5 border border-white text-white rounded-full">
                        <FaClipboardList size={15} />
                      </div>
                      <span className="truncate flex-1">{item?.title}</span>
                    </DynamicTag>
                  </li>
                );
              })}
            </div>
          </ul>
        </li>

        <li onClick={handleToggleMenu}>
          <Link
            title="Code Editor"
            to={`code-editor`}
            className={cn(
              "flex justify-start items-center gap-4",
              "px-4 py-2 w-full cursor-pointer",
              "text-lg text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              paths[1] === "code-editor" && "bg-thirdnary",
            )}
          >
            <FaCode size={24} />
            <span>Code Editor</span>
          </Link>
        </li>
        <li onClick={handleToggleMenu}>
          <Link
            title="Private Server"
            to={`private-server`}
            className={cn(
              "flex justify-start items-center gap-4",
              "px-4 py-2 w-full cursor-pointer",
              "text-lg text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              paths[1] === "private-server" && "bg-thirdnary",
            )}
          >
            <FaServer size={24} />
            <span>Private Server</span>
          </Link>
        </li>
        <li onClick={handleToggleMenu}>
          <Link
            title="Profile"
            to={"/profile"}
            className={cn(
              "flex justify-start items-center gap-4",
              "px-4 py-2",
              "text-lg text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary",
              paths[1] === "profile" && "bg-thirdnary",
            )}
          >
            <FaUser size={24} />
            <span>Profile</span>
          </Link>
        </li>
      </ul>

      <button
        title="Log Out"
        onClick={handleLogout}
        disabled={isLoading}
        className={cn(
          "w-4/5",
          "flex justify-center items-center gap-2",
          "text-center text-lg font-semibold text-white",
          "bg-red-600 py-2 px-6 rounded-2xl shadow-sm shadow-gray-300",
          "hover:cursor-pointer hover:scale-105 hover:bg-red-700 transition-all",
          "active:bg-red-700 active:scale-95",
          "disabled:opacity-60",
        )}
      >
        <FaDoorOpen />
        <span>Log Out</span>
      </button>
    </aside>
  );
}
