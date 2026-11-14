import {
  FaBook,
  FaBullhorn,
  FaChalkboard,
  FaChevronDown,
  FaClipboardList,
  FaDoorOpen,
  FaHouse,
  FaQuestion,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { Link, useNavigate, useParams } from "react-router-dom";
import { logout } from "../../_services/auth";
import { useEffect, useState } from "react";

export default function PublicSidebar({
  isOpen,
  handleToggleMenu,
  isLoading,
  setIsLoading,
  classrooms,
}) {
  const navigate = useNavigate();

  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [openTrays, setOpenTrays] = useState([
    "classroom",
    "material",
    "assignment",
    "announcement",
  ]);

  const pathname = window.location.pathname;

  const dynamicNav = [
    {
      label: "Announcements",
      name: "announcement",
      icon: FaBullhorn,
    },
    {
      label: "Materials",
      name: "material",
      icon: FaBook,
    },
    {
      label: "Assignments",
      name: "assignment",
      icon: FaClipboardList,
    },
  ];

  useEffect(() => {
    const localData = localStorage.getItem("dynamicNavData");
    const data = localData ? JSON.parse(localData) : [];

    if (id) {
      setItems(data);
    } else {
      setItems([]);
    }
  }, [pathname, id]);

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
        "bg-secondary",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "xl:static xl:translate-x-0 xl:z-10",
        "xl:min-w-1/5 xl:w-1/5",
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
          "h-9/10",
          "flex flex-col gap-1",
          "p-2 overflow-auto",
          "xl:p-0 xl:px-4 xl:border-0",
        )}
      >
        <li
          onClick={handleToggleMenu}
          className="border-t border-white mt-16 xl:mt-4 xl:border-none"
        >
          <Link
            to={"/"}
            className={cn(
              "flex justify-start items-center gap-4",
              "p-4 relative",
              "text-xl text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary",
            )}
          >
            <FaHouse size={24} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li onClick={handleToggleMenu} className="flex flex-col">
          <Link
            to={"/classrooms"}
            className={cn(
              "flex justify-start items-center gap-4",
              "p-4 relative overflow-hidden",
              "text-xl text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary",
            )}
          >
            <FaChalkboard size={24} />
            <span>Classroom</span>

            <button
              className={cn(
                "ml-auto transition-all cursor-pointer",
                !classrooms && "hidden",
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
                    to={`/classrooms/${c?.id}`}
                    className={cn(
                      "flex justify-start items-center gap-2",
                      "p-2",
                      "text-lg text-gray-100",
                      "hover:bg-thirdnary rounded-full transition-all",
                      "active:scale-95 active:bg-thirdnary",
                    )}
                  >
                    <div className="p-1.5 border border-white text-white rounded-full">
                      <FaChalkboard size={16} />
                    </div>
                    <span className="truncate flex-1">{c?.name}</span>
                  </Link>
                </li>
              ))}
            </div>
          </ul>
        </li>
        <li>
          <button
            disabled={!id}
            className={cn(
              "flex justify-start items-center gap-4",
              "p-4 w-full cursor-pointer",
              "text-xl text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              !id
                ? "text-gray-400 hover:bg-secondary active:bg-secondary"
                : "hidden",
            )}
          >
            <FaQuestion size={24} />
            <span>Select Classroom</span>
          </button>
        </li>

        {dynamicNav.map((d, i) => {
          const tempItems = items?.filter((item) => item?.type === d?.name);

          if (tempItems.length < 1) return null;

          return (
            <li key={i} className="flex flex-col">
              <button
                onClick={() => handleOpenTrays(d?.name)}
                className={cn(
                  "flex justify-start items-center gap-4",
                  "p-4 w-full cursor-pointer",
                  "text-xl text-white",
                  "hover:bg-thirdnary rounded-full transition-all",
                  !id
                    ? "text-gray-400 hover:bg-secondary active:bg-secondary"
                    : "active:scale-95 active:bg-thirdnary",
                )}
              >
                <d.icon size={24} />
                <span>{d?.label}</span>

                <div
                  className={cn(
                    "ml-auto transition-all",
                    openTrays.includes(d?.name) && "rotate-z-180",
                  )}
                >
                  <FaChevronDown />
                </div>
              </button>

              <ul
                className={cn(
                  "grid transition-all duration-300 ease-in-out m-0 p-0",
                  !openTrays.includes(d?.name)
                    ? "grid-rows-[0fr] opacity-0"
                    : "grid-rows-[1fr] opacity-100",
                )}
              >
                <div className="overflow-hidden flex flex-col gap-1 p-2 pl-6 xl:p-0 xl:pl-6">
                  {tempItems?.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={`/classrooms/${id}/${item?.type}s/${item?.id}`}
                        className={cn(
                          "flex justify-start items-center gap-2",
                          "p-2",
                          "text-lg text-gray-100",
                          "hover:bg-thirdnary rounded-full transition-all",
                          "active:scale-95 active:bg-thirdnary",
                        )}
                      >
                        <div className="p-1.5 border border-white text-white rounded-full">
                          <d.icon size={16} />
                        </div>
                        <span className="truncate flex-1">{item?.name}</span>
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </li>
          );
        })}

        <li onClick={handleToggleMenu}>
          <Link
            to={"/profile"}
            className={cn(
              "flex justify-start items-center gap-4",
              "p-4",
              "text-xl text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary",
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
          "absolute bottom-4 left-1/2 -translate-x-1/2",
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
