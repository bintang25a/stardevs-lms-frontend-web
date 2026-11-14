import { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { showClassroom } from "../../../_services/classrooms";
import { cn } from "../../../_utilities/cn";
import ClassroomNav from "../../../components/element/ClassroomNav";
import Footer from "../../../components/layout/Footer";
import SectionForm from "../../../components/modal/SectionForm";
import NotificationToast from "../../../components/modal/NotificationToast";
import AnnouncementForm from "../../../components/modal/AnnouncementForm";
import MaterialForm from "../../../components/modal/MaterialForm";
import AssignmentForm from "../../../components/modal/AssignmentForm";
import { profile } from "../../../_services/auth";
import SubmissionForm from "../../../components/modal/SubmissionForm";

export default function Classroom() {
  const { setIsLoading, user } = useOutletContext();

  const { id } = useParams();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const isNew = searchParams.get("is_new");

  const [showToast, setShowToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [isInit, setIsInit] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      let currentGroupUser = user;
      let allowed = false;

      if (isNew) {
        try {
          const data = await profile();

          currentGroupUser = data;
        } catch (error) {
          console.error("Gagal mengambil profil:", error);
        }
      }

      const classroom_ids = currentGroupUser?.classroom_ids || [];
      allowed = classroom_ids.includes(Number(id));

      if (!allowed) {
        navigate("/not-allowed", { replace: true });
        setIsLoading(false);
        setIsInit(false);
        return;
      }

      try {
        const data = await showClassroom(id);

        setClassroom(data);

        const combinedData = [
          ...(data?.announcements || []).map((item) => ({
            id: item.id,
            name: item.title,
            type: "announcement",
          })),
          ...(data?.assignments || []).map((item) => ({
            id: item.id,
            name: item.title,
            type: "assignment",
          })),
          ...(data?.materials || []).map((item) => ({
            id: item.id,
            name: item.title,
            type: "material",
          })),
        ];

        localStorage.setItem("dynamicNavData", JSON.stringify(combinedData));
      } catch (error) {
        console.log("Gagal mengambil data kelas:", error);
      } finally {
        setIsLoading(false);
        setIsInit(false);
      }
    };

    init();
  }, [id, isNew]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data = await showClassroom(id);

        setClassroom(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isInit) {
      fetchData();
    }
  }, [refresh]);

  const Main = () => {
    return isInit ? (
      <div className="h-full" />
    ) : (
      <Outlet
        context={{
          user,
          classroom,
          setModalOpen,
          setEditData,
          setRefresh,
          setShowToast,
        }}
      />
    );
  };

  return (
    <div
      className={cn(
        "w-full xl:w-5/6 max-h-full",
        "flex flex-col gap-2",
        "z-10",
      )}
    >
      <ClassroomNav />
      <Main />
      <Footer />

      <NotificationToast
        onClose={() => setShowToast({ ...showToast, isOpen: false })}
        isOpen={showToast.isOpen}
        title={showToast.title}
        message={showToast.message}
      />

      <SectionForm
        isOpen={modalOpen === "section"}
        data={editData}
        classroom={classroom}
        setEditData={setEditData}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
        setRefresh={setRefresh}
      />

      <AnnouncementForm
        isOpen={modalOpen === "announcement"}
        data={editData}
        classroom={classroom}
        setEditData={setEditData}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
        setRefresh={setRefresh}
      />

      <MaterialForm
        isOpen={modalOpen === "material"}
        data={editData}
        classroom={classroom}
        setEditData={setEditData}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
        setRefresh={setRefresh}
      />

      <AssignmentForm
        isOpen={modalOpen === "assignment"}
        data={editData}
        classroom={classroom}
        setEditData={setEditData}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
        setRefresh={setRefresh}
      />

      <SubmissionForm
        isOpen={modalOpen === "submission"}
        data={editData}
        setEditData={setEditData}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
        setRefresh={setRefresh}
      />
    </div>
  );
}
