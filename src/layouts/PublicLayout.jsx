import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { profile } from "../_services/auth";
import { cn } from "../_utilities/cn";
import LoadingBar from "../components/modal/LoadingBar";
import PublicHeader from "../components/layout/PublicHeader";
import PublicSidebar from "../components/layout/PublicSidebar";

export default function PublicLayout() {
  const [isInit, setIsInit] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let timeout;

    const fetchProfile = async () => {
      try {
        const data = await profile();

        setUser(data);
      } catch (error) {
        console.error(error);

        if (isMounted) {
          navigate("/login", { replace: true });
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

  const handleRefresh = () => {
    console.log("refresh");
  };

  const handleToggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn("h-screen w-screen", "flex flex-col")}>
      <PublicHeader
        handleRefresh={handleRefresh}
        handleToggleMenu={handleToggleMenu}
        user={user}
      />

      <main className={cn("w-full h-full max-h-screen overflow-auto flex")}>
        <PublicSidebar
          isOpen={isOpen}
          handleToggleMenu={handleToggleMenu}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {!isInit && <Outlet context={{ isLoading, setIsLoading, user }} />}
      </main>

      <LoadingBar isLoading={isLoading} />
    </div>
  );
}
