import { FaPlus } from "react-icons/fa6";
import { cn } from "../../../_utilities/cn";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  createClassroom,
  deleteClassroom,
  getClassrooms,
  updateClassroom,
} from "../../../_services/classrooms";
import { memberJoin, memberLeave } from "../../../_services/member";
import ClassroomForm from "../../../components/modal/ClassroomForm";
import ClassroomCard from "../../../components/element/ClassroomCard";
import ClassroomDelete from "../../../components/modal/ClassroomDelete";

export default function Classrooms() {
  const { setIsLoading, user } = useOutletContext();

  const [isInit, setIsInit] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await getClassrooms();

        setClassrooms(res?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setIsInit(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (formData, action) => {
    if (action === "create") {
      const { name, code, assistant_emails, isJoin } = formData;

      if (!name && !isJoin) {
        return setMessage("Please fill Class Name field!");
      }

      if (!code) {
        return setMessage("Please fill Class Code field!");
      }

      if (assistant_emails.length < 1 && !isJoin && !editData) {
        return setMessage("Please enter min 1 assistant email");
      }
    }

    if (action === "delete") {
      const { code, typed_code } = formData;

      if (code !== typed_code) {
        return setMessage("Please type the right Code!");
      }
    }

    try {
      setIsLoading(true);

      let resData;

      if (deleteData) {
        const leaveData = {
          classroom_id: formData.id,
          user_id: String(user.id),
          role: user?.role,
        };

        resData = formData.isLeft
          ? await memberLeave(leaveData)
          : await deleteClassroom(deleteData?.id);

        const updatedClassrooms = classrooms.filter(
          (cl) => cl.id !== deleteData.id,
        );

        setClassrooms(updatedClassrooms);
        setDeleteData(null);
        setDeleteOpen(false);
      }

      if (editData) {
        resData = await updateClassroom(editData.id, formData);

        const updatedClassrooms = classrooms.map((cl) =>
          cl.id === editData.id ? resData : cl,
        );

        setClassrooms(updatedClassrooms);
        setEditData(null);
      }

      if (!editData && !deleteData) {
        const joinData = {
          classroom_code: formData.code,
          user_id: String(user.id),
          role: user?.role,
        };

        resData = formData.isJoin
          ? await memberJoin(joinData)
          : await createClassroom(formData);

        navigate(`/classrooms/${resData?.id}`);
      }

      setModalOpen(false);
    } catch (error) {
      console.log(error);

      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (data) => {
    setModalOpen(true);
    setEditData(data);
    setMenuOpen(null);
  };

  const handleDelete = async (data) => {
    setDeleteOpen(true);
    setDeleteData(data);
    setMenuOpen(null);
  };

  const handleMenuOpen = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={cn(
        "w-full xl:w-5/6 h-full",
        "relative p-4 xl:px-16 xl:py-8",
        "flex flex-col gap-2",
        "z-10",
      )}
    >
      {modalOpen && (
        <ClassroomForm
          setModalOpen={setModalOpen}
          user={user}
          handleSubmit={handleSubmit}
          message={message}
          data={editData}
        />
      )}

      {deleteOpen && (
        <ClassroomDelete
          setModalOpen={setDeleteOpen}
          user={user}
          handleSubmit={handleSubmit}
          message={message}
          data={deleteData}
        />
      )}

      <h2 className={cn("text-4xl text-primary font-bold")}>Classrooms</h2>

      <div
        className={cn(
          "rounded-2xl bg-gray-100",
          "w-full h-full p-4 relative",
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 m-auto w-fit h-fit",
            "text-lg text-black font-medium",
            (classrooms.length > 0 || isInit) && "hidden",
          )}
        >
          You are not in any Classrooms, Please Join with Code
          {user?.role === "asisten" && " or Create one"}
        </span>

        {classrooms?.map((cl, i) => (
          <ClassroomCard
            key={i}
            data={cl}
            user={user}
            menuOpen={menuOpen}
            handleMenuOpen={handleMenuOpen}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      <button
        title="Add Classroom"
        onClick={() => {
          setModalOpen(true);
          setMessage("");
        }}
        className={cn(
          "p-2",
          "bg-thirdnary rounded-3xl shadow-lg shadow-gray-500",
          "absolute bottom-8 right-8",
          "text-white",
          "active:scale-95 transition-all",
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
