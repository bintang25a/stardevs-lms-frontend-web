import { FaPlus } from "react-icons/fa6";
import { cn } from "../../../_utilities/cn";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getClassrooms } from "../../../_services/classrooms";
import AddClassroom from "../../../components/modal/AddClassroom";

export default function Classrooms() {
  const { isLoading, setIsLoading, user } = useOutletContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const classroomsData = await getClassrooms();

        setClassrooms(classroomsData);
        console.log(classrooms + isLoading);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className={cn("w-full h-full", "relative")}>
      {modalOpen && <AddClassroom setModalOpen={setModalOpen} user={user} />}

      <button
        title="Add Classroom"
        onClick={() => setModalOpen(true)}
        className={cn(
          "p-2",
          "bg-thirdnary rounded-3xl shadow-lg shadow-gray-500",
          "absolute bottom-8 right-8",
          "text-white",
          "active:scale-95 transition-all"
        )}
      >
        <FaPlus
          className={cn("hover:rotate-360 transition-all cursor-pointer")}
          size={48}
        />
      </button>
    </div>
  );
}
