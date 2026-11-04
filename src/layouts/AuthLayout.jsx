import { FaGraduationCap, FaPaperPlane } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import { cn } from "../_utilities/cn";
import Information from "../components/auth/Information";

export default function AuthLayout() {
  return (
    <div className={cn("h-screen w-screen", "flex")}>
      <Information />
      <Outlet />
    </div>
  );
}
