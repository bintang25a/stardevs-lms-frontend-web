import { useOutletContext } from "react-router-dom";
import { cn } from "../../../_utilities/cn";
import { useState } from "react";
import AssignmentNav from "../../../components/element/AssignmentNav";
import AssignmentContent from "../../../components/element/AssignmentContent";

export default function Assignments() {
  const { user, classroom, setModalOpen, setEditData, setRefresh } =
    useOutletContext();

  const [openTrays, setOpenTrays] = useState([]);
  const [openMenu, setOpenMenu] = useState("");

  const handleToggleExpand = () => {
    if (openTrays.length < 1) {
      setOpenTrays([...classroom.sections.map((s) => s.id), null]);
      return true;
    } else {
      setOpenTrays([]);
      return false;
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full p-4",
        "flex flex-col gap-2 xl:gap-3 justify-start items-center",
        "overflow-auto",
      )}
    >
      <AssignmentNav
        user={user}
        toggleExpand={handleToggleExpand}
        openTrays={openTrays}
        setModalOpen={setModalOpen}
      />

      <AssignmentContent
        user={user}
        classroom={classroom}
        openTrays={openTrays}
        setOpenTrays={setOpenTrays}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        setModalOpen={setModalOpen}
        setEditData={setEditData}
        setRefresh={setRefresh}
      />
    </div>
  );
}
