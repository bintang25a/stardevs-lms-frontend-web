import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cn } from "../../../_utilities/cn";

export default function Assesment() {
  const { user, classroom, setModalOpen, setEditData, setRefresh } =
    useOutletContext();

  const { id, assignmentId } = useParams();

  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "w-full h-full p-4",
        "flex flex-col gap-2 xl:gap-3 justify-start items-center",
        "overflow-auto",
      )}
    >
      <h1>ini assesment page</h1>
    </div>
  );
}
