import { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
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

export default function Classroom() {
  const { setIsLoading, user } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const [classroom, setClassroom] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);

  useEffect(() => {
    const classroom_ids = user.classroom_ids || [];
    const isAllowed = classroom_ids.includes(Number(id));

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data = await showClassroom(id);
        console.log(data);
        setClassroom(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAllowed) {
      navigate("/not-allowed", { replace: true });
    } else {
      fetchData();
    }
  }, [id]);

  return (
    <div
      className={cn("w-full xl:w-5/6 h-full", "flex flex-col gap-2", "z-10")}
    >
      <ClassroomNav />
      <Outlet context={{ classroom, user, setModalOpen }} />
      <Footer />

      <NotificationToast
        onClose={() => setShowToast({ ...showToast, isOpen: false })}
        isOpen={showToast.isOpen}
        title={showToast.title}
        message={showToast.message}
      />

      <SectionForm
        isOpen={modalOpen === "section"}
        isEdit={false}
        data={null}
        classroom={classroom}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
      />

      <AnnouncementForm
        isOpen={modalOpen === "announcement"}
        isEdit={false}
        data={null}
        classroom={classroom}
        sections={classroom?.sections}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
      />

      <MaterialForm
        isOpen={modalOpen === "material"}
        isEdit={false}
        data={null}
        classroom={classroom}
        sections={classroom?.sections}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
      />

      <AssignmentForm
        isOpen={modalOpen === "assignment"}
        isEdit={false}
        data={null}
        classroom={classroom}
        sections={classroom?.sections}
        setModalOpen={setModalOpen}
        setIsLoading={setIsLoading}
        setShowToast={setShowToast}
      />
    </div>
  );
}
