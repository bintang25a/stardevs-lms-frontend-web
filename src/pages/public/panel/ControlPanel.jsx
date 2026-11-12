import { cn } from "../../../_utilities/cn";
import ClassroomHeader from "../../../components/element/ClassroomHeader";
import ClassroomStatistic from "../../../components/element/ClassroomStatistic";
import { useOutletContext } from "react-router-dom";
import ClassroomActions from "../../../components/element/ClassroomActions";
import Announcements from "../../../components/element/Announcements";

export default function ControlPanel() {
  const { user, classroom, setModalOpen } = useOutletContext();

  return (
    <div
      className={cn(
        "w-full h-full",
        "overflow-auto",
        "flex justify-center items-start",
      )}
    >
      <div
        className={cn(
          "w-full xl:w-7/10 h-full p-4",
          "flex flex-wrap gap-2 xl:gap-3 content-start items-stretch",
        )}
      >
        <ClassroomHeader classroom={classroom} />
        <ClassroomStatistic classroom={classroom} />

        {user?.role !== "praktikan" && (
          <ClassroomActions setModalOpen={setModalOpen} />
        )}

        <Announcements announcements={classroom?.announcements} />
      </div>
    </div>
  );
}
