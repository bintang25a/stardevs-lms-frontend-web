import {
  FaChalkboard,
  FaDoorOpen,
  FaHouse,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../_services/auth";

export default function PublicSidebar({
  isOpen,
  handleToggleMenu,
  isLoading,
  setIsLoading,
}) {
  const navigate = useNavigate();

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

  return (
    <aside
      className={cn(
        "w-1/2 h-full fixed top-0 z-50 xl:z-10",
        "bg-secondary",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "px-2 pt-16",
        "xl:static xl:translate-x-0",
        "xl:min-w-fit xl:w-1/6",
        "xl:p-4",
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
          "flex flex-col gap-1",
          "border-t border-white ",
          "p-2",
          "xl:p-0 xl:border-0",
        )}
      >
        <li onClick={handleToggleMenu}>
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
        <li onClick={handleToggleMenu}>
          <Link
            to={"/classrooms"}
            className={cn(
              "flex justify-start items-center gap-4",
              "p-4",
              "text-xl text-white",
              "hover:bg-thirdnary rounded-full transition-all",
              "active:scale-95 active:bg-thirdnary",
            )}
          >
            <FaChalkboard size={24} />
            <span>Classroom</span>
          </Link>
        </li>
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
