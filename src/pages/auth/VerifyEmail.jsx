import { FaGraduationCap } from "react-icons/fa6";
import { cn } from "../../_utilities/cn";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
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
        <section className={cn("flex flex-col items-center gap-1")}>
          <h3 className={cn("text-black text-3xl font-bold")}>Check Email!</h3>
        </section>
        <section
          className={cn(
            "w-full",
            "flex flex-col justify-center items-center gap-2"
          )}
        >
          <span className={cn("text-sm text-red-600")}>
            check your email to verified this account
          </span>
        </section>
        <section className={cn("w-full", "flex justify-around items-start")}>
          <Link to={"/login"} className={cn("text-sm text-gray-700 underline")}>
            Already Verified? Login
          </Link>
          <a
            href={"https://accounts.google.com/b/0/AddMailService"}
            target="_blank"
            className={cn("text-sm text-gray-700 underline")}
          >
            Open Email
          </a>
        </section>
      </main>
    </div>
  );
}
