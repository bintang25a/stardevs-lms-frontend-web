import { Outlet, useNavigate } from "react-router-dom";
import { cn } from "../_utilities/cn";
import Information from "../components/auth/Information";
import { useEffect, useState } from "react";
import LoadingBar from "../components/modal/LoadingBar";
import { profile } from "../_services/auth";

export default function AuthLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        await profile();
        if (isMounted) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);

          navigate("/login", { replace: true });
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className={cn("h-screen w-screen", "flex")}>
      <Information />
      <Outlet context={{ isLoading, setIsLoading }} />

      <LoadingBar isLoading={isLoading} />
    </div>
  );
}
