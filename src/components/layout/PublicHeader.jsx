import { FaArrowLeft, FaBars, FaRotateLeft } from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { useNavigate } from "react-router-dom";

export default function PublicHeader({
  user,
  handleRefresh,
  handleToggleMenu,
}) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "w-full",
        "px-4 py-2 shadow-sm shadow-gray-500",
        "flex justify-between items-center",
      )}
    >
      <div
        className={cn(
          "w-fit h-fit",
          "p-1",
          "box-border border rounded-sm border-primary",
          "flex gap-2",
        )}
      >
        <button
          title="Menu"
          onClick={handleToggleMenu}
          className={cn(
            "text-primary",
            "hover:text-thirdnary active:scale-95",
            "transition-all",
            "cursor-pointer",
            "xl:hidden",
          )}
        >
          <FaBars size={24} />
        </button>
        <button
          title="Back"
          onClick={() => navigate(-1)}
          className={cn(
            "text-primary",
            "hover:text-thirdnary active:scale-95",
            "transition-all",
            "cursor-pointer",
          )}
        >
          <FaArrowLeft size={24} />
        </button>
        <button
          title="Refresh"
          onClick={handleRefresh}
          className={cn(
            "text-primary",
            "hover:text-thirdnary active:scale-95",
            "transition-all",
            "cursor-pointer",
          )}
        >
          <FaRotateLeft size={24} />
        </button>
      </div>

      <div
        className={cn(
          "w-fit h-fit",
          "p-1",
          "flex justify-center items-center gap-2",
        )}
      >
        <div className={cn("w-fit", "flex flex-col")}>
          <h1 className={cn("text-right text-base text-primary font-semibold")}>
            {user?.name}
          </h1>
          <span className={cn("text-right text-sm text-primary font-normal")}>
            {user?.role?.toUpperCase()} | {user?.nim}
          </span>
        </div>
        <div className={cn("w-12 h-12", "rounded-full overflow-hidden")}>
          {user.photo ? (
            <img
              className="w-full h-full object-cover"
              src={user.photo}
              alt=""
            />
          ) : (
            <div className="bg-primary w-full h-full flex justify-center items-center">
              :D
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
