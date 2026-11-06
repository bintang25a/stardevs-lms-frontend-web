import { Link } from "react-router-dom";
import { cn } from "../../_utilities/cn";
import { FaEllipsisVertical } from "react-icons/fa6";

export default function ClassroomCard({
  data,
  user,
  menuOpen,
  handleMenuOpen,
  handleEdit,
  handleDelete,
}) {
  const currentUrl = window.location.href;

  const handleCopyUrl = (id) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(currentUrl + id)
        .catch((err) => console.error("Gagal menyalin: ", err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl + id;

      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");

        console.log(successful);
      } catch (err) {
        console.error("Gagal menjalankan fallback copy: ", err);
      } finally {
        handleMenuOpen();
      }

      document.body.removeChild(textArea);
    }
  };

  return (
    <div
      className={cn(
        "max-h-80",
        "border border-primary rounded-2xl shadow shadow-gray-500 overflow-hidden",
        "bg-white",
        "hover:shadow-lg transition-all",
      )}
    >
      <Link
        to={`${data?.id}`}
        className={cn(
          "h-3/10 px-4",
          "bg-primary",
          "text-md text-gray-50",
          "flex flex-col justify-center items-start",
          "hover:underline transition-all",
        )}
      >
        <h3 className={cn("font-semibold truncate")}>{data?.name}</h3>
        <span className={cn("font-light text-sm")}>
          Schedule: {data.schedule ?? "-"}
        </span>
      </Link>

      <Link to={`${data?.id}`} className={cn("h-5/10 xl:h-6/10", "p-2 flex")}>
        {data?.description}
      </Link>

      <div
        className={cn(
          "h-2/10 xl:h-1/10",
          "px-2 border-t border-primary",
          "flex items-center justify-between",
          "relative",
        )}
      >
        <span>Total Students: {data?.total_students}</span>
        <button
          title="Menu"
          onClick={() => handleMenuOpen(data?.id)}
          className={cn(
            "p-1 hover:bg-gray-300 rounded-full cursor-pointer transition-all",
          )}
        >
          <FaEllipsisVertical />
        </button>
        <div
          className={cn(
            "absolute bottom-9 right-1",
            "flex flex-col justify-start items-start",
            "bg-gray-200 rounded-md",
            "text-sm text-black font-light",
            "overflow-hidden",
            "transition-all duration-200 ease-out origin-bottom-right",
            menuOpen === data?.id
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none invisible",
          )}
        >
          <button
            onClick={() => handleEdit(data)}
            title="Edit"
            className={cn(
              "px-2 py-1",
              "hover:cursor-pointer hover:bg-gray-100 transition-all",
              "w-full",
              "text-left",
              user?.role === "praktikan" && "hidden",
            )}
          >
            Edit
          </button>
          <button
            onClick={() =>
              handleDelete({ id: data?.id, code: data?.code, isLeft: false })
            }
            title="Delete Classroom"
            className={cn(
              "px-2 py-1",
              "hover:cursor-pointer hover:bg-gray-100 transition-all",
              "w-full",
              "text-left",
              user?.role === "praktikan" && "hidden",
            )}
          >
            Delete
          </button>
          <button
            onClick={() =>
              handleDelete({ id: data?.id, code: data?.code, isLeft: true })
            }
            title="Left Classroom"
            className={cn(
              "px-2 py-1",
              "hover:cursor-pointer hover:bg-gray-100 transition-all",
              "w-full",
              "text-left",
            )}
          >
            Left Classroom
          </button>
          <button
            onClick={() => handleCopyUrl(`/${data?.id}`)}
            title="Left Classroom"
            className={cn(
              "px-2 py-1",
              "hover:cursor-pointer hover:bg-gray-100 transition-all",
              "w-full",
              "text-left",
            )}
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
