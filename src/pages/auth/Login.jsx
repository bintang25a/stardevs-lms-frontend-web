import {
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaPaperPlane,
} from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { login } from "../../_services/auth";

export default function Login() {
  const { isLoading, setIsLoading } = useOutletContext();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    requested_role: "praktikan",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.login) {
      return setMessage("Please fill login field!");
    }

    if (!formData.password) {
      return setMessage("Please fill password field!");
    }

    if (!formData.requested_role) {
      return setMessage("Please select role!");
    }

    try {
      setIsLoading(true);
      setMessage("");

      await login(formData);

      navigate("/", { replace: true });
    } catch (error) {
      setMessage(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line
  }, [formData]);

  return (
    <div
      className={cn(
        "h-full w-1/2",
        "flex flex-col justify-center items-start gap-8",
        "p-32"
      )}
    >
      <header
        className={cn(
          "w-full",
          "flex items-center gap-1",
          "hover:scale-105 hover:border-b hover:border-b-primary hover:pb-1",
          "transition-all"
        )}
      >
        <div
          className={cn(
            "bg-linear-to-b from-thirdnary to-primary",
            "text-white",
            "flex justify-center items-center",
            "p-1 rounded-lg"
          )}
        >
          <FaGraduationCap size={40} />
        </div>
        <h2 className={cn("text-primary text-2xl font-semibold")}>
          Learning Management System
        </h2>
      </header>
      <main className={cn("w-full", "flex flex-col item-start gap-4")}>
        <section className={cn("flex flex-col gap-1")}>
          <h3 className={cn("text-black text-3xl font-bold")}>Welcome back!</h3>
          <span className={cn("text-gray-600 text-lg font-light")}>
            Sign in to continue your learning journey
          </span>
        </section>
        <section
          className={cn(
            "w-full",
            "flex flex-col justify-start items-start gap-2"
          )}
        >
          {message && (
            <span className={cn("text-sm text-red-600")}>{message}</span>
          )}
          <div className={cn("w-full", "flex flex-col")}>
            <label
              htmlFor="login"
              className={cn("text-gray-800 text-base font-normal")}
            >
              Unique Identity
            </label>
            <input
              type="text"
              id="login"
              name="login"
              placeholder="Enter your NIM/NID/NIP/Email"
              autoComplete="off"
              onChange={handleChange}
              value={formData?.login}
              className={cn(
                "w-full",
                "box-border border border-gray-300 rounded-sm",
                "p-2 outline-none transition-all",
                "text-sm text-gray-900 font-normal",
                "focus:border-primary focus:ring-1 focus:ring-primary focus:ring-rounded-sm",
                "hover:shadow-sm hover:shadow-primary"
              )}
            />
          </div>
          <div className={cn("w-full", "flex flex-col")}>
            <label
              htmlFor="password"
              className={cn("text-gray-800 text-base font-normal")}
            >
              Password
            </label>
            <div
              className={cn(
                "w-full",
                "flex",
                "hover:shadow-sm hover:shadow-primary"
              )}
            >
              <input
                type={isVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="off"
                onChange={handleChange}
                value={formData?.password}
                className={cn(
                  "w-full flex-95",
                  "p-2 outline-none transition-all",
                  "text-sm text-gray-900 font-normal",
                  "box-border border border-gray-300 rounded-sm",
                  "focus:border-primary focus:ring-1 focus:ring-primary focus:ring-rounded-sm"
                )}
              />
              <span
                className={cn(
                  "flex-5",
                  "flex justify-center items-center",
                  "box-border border border-gray-300 p-1",
                  "cursor-pointer hover:text-primary"
                )}
                onClick={() => setIsVisible(!isVisible)}
                title={isVisible ? "Hide" : "Show"}
              >
                {!isVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <div className={cn("w-full", "flex flex-col")}>
            <label
              htmlFor="role"
              className={cn("text-gray-800 text-base font-normal")}
            >
              Role
            </label>
            <select
              name="requested_role"
              id="requested_role"
              onChange={handleChange}
              value={formData?.requested_role}
              className={cn(
                "w-full",
                "box-border border border-gray-300 rounded-sm",
                "p-2 outline-none transition-all",
                "text-sm text-gray-900 font-normal cursor-pointer",
                "focus:border-primary focus:ring-1 focus:ring-primary focus:ring-rounded-sm",
                "hover:shadow-sm hover:shadow-primary"
              )}
            >
              <option value="praktikan">Praktikan</option>
              <option value="asisten">Asisten</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </section>
        <section className={cn("w-full", "flex justify-around items-start")}>
          <Link
            to={"/register"}
            className={cn("text-sm text-gray-700 underline")}
          >
            Register Account?
          </Link>
          <Link
            to={"/forget-password"}
            className={cn("text-sm text-gray-700 underline")}
          >
            Forget Password?
          </Link>
        </section>
        <section className="w-full">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              "w-full",
              "flex justify-center items-center gap-2",
              "bg-linear-to-b from-secondary to-primary",
              "p-2 rounded-md",
              "text-xl text-white font-bold",
              "cursor-pointer hover:scale-105 active:scale-95 transition-all",
              "disabled:opacity-50 disabled:cursor-default"
            )}
          >
            <FaPaperPlane /> Login
          </button>
        </section>
      </main>
    </div>
  );
}
