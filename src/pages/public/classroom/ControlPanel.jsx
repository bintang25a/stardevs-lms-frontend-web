import { cn } from "../../../_utilities/cn";
import ClassroomHeader from "../../../components/element/ClassroomHeader";
import ClassroomStatistic from "../../../components/element/ClassroomStatistic";
import { useOutletContext } from "react-router-dom";
import ClassroomActions from "../../../components/element/ClassroomActions";

export default function ControlPanel() {
  const { classroom, setModalOpen } = useOutletContext();

  return (
    <div
      className={cn(
        "w-full h-full p-4",
        "flex flex-wrap gap-2 xl:gap-3 content-start items-stretch",
      )}
    >
      <ClassroomHeader classroom={classroom} />
      <ClassroomStatistic classroom={classroom} />
      <ClassroomActions setModalOpen={setModalOpen} />
    </div>
  );
}
