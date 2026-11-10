import { useOutletContext } from "react-router-dom";
import { cn } from "../../_utilities/cn";
import { useState } from "react";
import { updateProfile } from "../../_services/auth";

export default function Profile() {
  const { user, setIsLoading } = useOutletContext();

  const tempForm = {
    name: user.name,
    nim: user.nim,
    email: user.email,
    photo: user.photo,
    phone_number: user.phone_number,
  };

  const [formData, setFormData] = useState(tempForm);
  const [isChange, setIsChange] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setIsChange(true);
  };

  const handleSubmit = async () => {
    if (!isEdit) {
      setIsEdit(true);
      return;
    }

    if (!isChange) {
      setIsEdit(false);
      return;
    }

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "photo") {
        if (value instanceof File) {
          payload.append("photo", value);
        }
      } else if (value !== null && value !== undefined && value !== false) {
        payload.append(key, value);
      }
    });

    try {
      setIsLoading(true);

      const message = await updateProfile(payload);

      console.log(message);
      setIsEdit(false);
      setIsChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full xl:w-5/6 max-h-full",
        "flex flex-col gap-2",
        "z-10 flex justify-center items-center",
      )}
    >
      <div
        className={cn(
          "w-9/10 h-19/20 overflow-auto",
          "bg-linear-to-r from-primary to-thirdnary shadow shadow-gray-400",
          "pt-16 xl:pt-18 rounded-md",
          "flex flex-col",
        )}
      >
        <header
          className={cn(
            "w-full h-fit p-4",
            "bg-gray-50",
            "flex justify-start items-center gap-4",
            "relative",
          )}
        >
          <label
            htmlFor="photo"
            className={cn(
              "max-w-16 max-h-16 xl:max-w-20 xl:max-h-20 w-100 h-100 rounded-full",
              "bg-blue-500 overflow-hidden",
              "flex justify-center items-center",
              isEdit && "cursor-pointer hover:opacity-60 transition-all",
            )}
          >
            {user.photo && !isEdit ? (
              <img
                className="w-full h-full object-cover"
                src={user?.photo}
                alt=""
              />
            ) : (
              <div
                className={cn(
                  "text-black",
                  isEdit
                    ? "text-sm xl:text-sm"
                    : "text-2xl xl:text-4xl font-bold",
                )}
              >
                {isEdit ? "Change" : user?.name[0]}
              </div>
            )}
          </label>

          <input
            type="file"
            id="photo"
            name="photo"
            accept="images/*"
            className="hidden"
            onChange={handleChange}
          />

          <div
            className={cn("w-fit", "flex flex-col justify-start items-start")}
          >
            <h2
              className={cn(
                "text-black text-lg font-medium truncate",
                "md:text-xl xl:text-2xl",
              )}
            >
              {user?.name}
            </h2>
            <span
              className={cn(
                "text-gray-700 text-xs font-light truncate flex",
                "md:text-sm xl:text-md",
              )}
            >
              <span>{user?.nim} |</span>
              <span className="hidden md:block"> | {user?.email}</span>
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className={cn(
              "absolute right-8",
              "py-2 px-6",
              "rounded-md shadow shadow-gray-400",
              "text-xl font-light text-gray-50",
              "hover:scale-105 active:scale-95",
              "cursor-pointer transition-all",
              isEdit
                ? isChange
                  ? "bg-green-500"
                  : "bg-red-500"
                : "bg-blue-500",
            )}
          >
            {isEdit ? (isChange ? "Save" : "Cancel") : "Edit"}
          </button>
        </header>

        <main
          className={cn(
            "w-full h-full p-12",
            "bg-gray-50",
            "flex flex-wrap justify-start items-start content-start gap-4 xl:gap-7",
            "border-t border-t-gray-400",
            "relative",
          )}
        >
          <div
            className={cn(
              "flex-1 w-full min-w-full md:min-w-2/5",
              "flex flex-col justify-start items-start gap-2",
            )}
          >
            <label htmlFor="name" className="text-black text-lg truncate">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEdit}
              className={cn(
                "bg-gray-100",
                "py-2 px-3 w-full",
                "rounded-lg border border-gray-700",
                "text-lg text-gray-900",
                "disabled:border-none disabled:text-gray-800 disabled:bg-gray-200",
                "focus:outline-none focus:shadow focus:shadow-primary",
              )}
            />
          </div>

          <div
            className={cn(
              "flex-1 w-full min-w-full md:min-w-2/5",
              "flex flex-col justify-start items-start gap-2",
            )}
          >
            <label htmlFor="nim" className="text-black text-lg truncate">
              NIM
            </label>
            <input
              type="text"
              name="nim"
              id="nim"
              value={formData.nim}
              onChange={handleChange}
              disabled={!isEdit}
              className={cn(
                "bg-gray-100",
                "py-2 px-3 w-full",
                "rounded-lg border border-gray-700",
                "text-lg text-gray-900",
                "disabled:border-none disabled:text-gray-800 disabled:bg-gray-200",
                "focus:outline-none focus:shadow focus:shadow-primary",
              )}
            />
          </div>

          <div
            className={cn(
              "flex-1 w-full min-w-full md:min-w-2/5",
              "flex flex-col justify-start items-start gap-2",
            )}
          >
            <label htmlFor="email" className="text-black text-lg truncate">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEdit}
              className={cn(
                "bg-gray-100",
                "py-2 px-3 w-full",
                "rounded-lg border border-gray-700",
                "text-lg text-gray-900",
                "disabled:border-none disabled:text-gray-800 disabled:bg-gray-200",
                "focus:outline-none focus:shadow focus:shadow-primary",
              )}
            />
          </div>

          <div
            className={cn(
              "flex-1 w-full min-w-full md:min-w-2/5",
              "flex flex-col justify-start items-start gap-2",
            )}
          >
            <label
              htmlFor="phone_number"
              className="text-black text-lg truncate"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={!isEdit}
              className={cn(
                "bg-gray-100",
                "py-2 px-3 w-full",
                "rounded-lg border border-gray-700",
                "text-lg text-gray-900",
                "disabled:border-none disabled:text-gray-800 disabled:bg-gray-200",
                "focus:outline-none focus:shadow focus:shadow-primary",
              )}
            />
          </div>

          <h3 className="w-full text-xl text-black font-normal">
            CHANGE PASSWORD
          </h3>

          <div
            className={cn(
              "flex-1 w-full min-w-full md:min-w-1/5",
              "flex flex-col justify-start items-start gap-2",
            )}
          >
            <label
              htmlFor="old_password"
              className="text-black text-lg truncate"
            >
              Old Password
            </label>
            <input
              type="text"
              name="old_password"
              id="old_password"
              value={formData.old_password}
              onChange={handleChange}
              disabled={!isEdit}
              className={cn(
                "bg-gray-100",
                "py-2 px-3 w-full",
                "rounded-lg border border-gray-700",
                "text-lg text-gray-900",
                "disabled:border-none disabled:text-gray-800 disabled:bg-gray-200",
                "focus:outline-none focus:shadow focus:shadow-primary",
              )}
            />
          </div>

          <div
            className={cn(
              "flex-1 w-full min-w-full md:min-w-1/5",
              "flex flex-col justify-start items-start gap-2",
            )}
          >
            <label
              htmlFor="new_password"
              className="text-black text-lg truncate"
            >
              New Password
            </label>
            <input
              type="text"
              name="new_password"
              id="new_password"
              value={formData.new_password}
              onChange={handleChange}
              disabled={!isEdit}
              className={cn(
                "bg-gray-100",
                "py-2 px-3 w-full",
                "rounded-lg border border-gray-700",
                "text-lg text-gray-900",
                "disabled:border-none disabled:text-gray-800 disabled:bg-gray-200",
                "focus:outline-none focus:shadow focus:shadow-primary",
              )}
            />
          </div>

          <div
            className={cn(
              "flex-1 w-full min-w-full md:min-w-1/5",
              "flex flex-col justify-start items-start gap-2",
            )}
          >
            <label
              htmlFor="confirm_password"
              className="text-black text-lg truncate"
            >
              Confirm Password
            </label>
            <input
              type="text"
              name="confirm_password"
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              disabled={!isEdit}
              className={cn(
                "bg-gray-100",
                "py-2 px-3 w-full",
                "rounded-lg border border-gray-700",
                "text-lg text-gray-900",
                "disabled:border-none disabled:text-gray-800 disabled:bg-gray-200",
                "focus:outline-none focus:shadow focus:shadow-primary",
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
