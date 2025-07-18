import {
  SquareDashedKanbanIcon,
  Users2,
  Wifi,
  WifiCog,
  WifiOff,
} from "lucide-react";
import { AddColumnModal } from "./AddColumnModal";
import { useBoard } from "../context/BoardContext";

const Navbar = () => {
  const { clientCount, status } = useBoard();

  console.log("status", status);
  //  bg-[#2f2f2f80]
  return (
    <div className="flex justify-between py-[12px] backdrop-blur-[5px] rounded-[12px] px-[24px]">
      <p className="flex gap-px items-center text-[24px] m-[0px] capitalize font-bold">
        <SquareDashedKanbanIcon /> Kanban: Your collaborative dashboard
      </p>
      <div className="flex gap-[8px] items-center">
        <div className="bg-[#918f8f33] rounded-full py-[10px] px-[16px] items-center flex gap-[10px] h-fit">
          {status == "online" ? (
            <Wifi color="lime" />
          ) : (
            <WifiOff color="grey" />
          )}
          <p className="flex items-center gap-[5px]">
            <Users2 /> {clientCount || 1}
          </p>
        </div>
        {status !== "offline" && <AddColumnModal />}
      </div>
    </div>
  );
};

export default Navbar;
