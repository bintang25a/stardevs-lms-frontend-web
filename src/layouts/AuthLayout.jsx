import { Outlet, useNavigate } from "react-router-dom";
import { cn } from "../_utilities/cn";
import Information from "../components/auth/Information";
import { useEffect, useState } from "react";
import LoadingBar from "../components/modal/LoadingBar";
import { profile } from "../_services/auth";
import { FallingLeaves } from "falling-leaves/react";

export default function AuthLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInit, setIsInit] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let timeout;

    const fetchProfile = async () => {
      try {
        await profile();

        if (isMounted) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setIsLoading(false);
        }
      } finally {
        timeout = setTimeout(() => {
          setIsLoading(false);
          setIsInit(false);
        }, 500);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div
      className={cn(
        "h-fit xl:h-screen w-screen",
        "flex flex-col-reverse xl:flex-row",
        "overflow-y-auto",
      )}
    >
      <FallingLeaves fullScreen shapes={["cherry", "oak"]} />

      {!isInit && <Information />}
      {!isInit && <Outlet context={{ isLoading, setIsLoading }} />}

      <LoadingBar isLoading={isLoading} />
    </div>
  );
}
