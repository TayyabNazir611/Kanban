import { SquareDashedKanbanIcon, Users2, Wifi, WifiOff } from "lucide-react";
import { AddColumnModal } from "./AddColumnModal";
import { useBoard } from "../context/BoardContext";
import { Tooltip } from "@mui/material";

const Navbar = () => {
  const { status } = useBoard();

  console.log("status", status);
  //  bg-[#2f2f2f80]
  return (
    <div className="flex justify-between py-[12px] backdrop-blur-[5px] rounded-[12px]">
      <p className="flex gap-px items-center text-[24px] m-[0px] capitalize font-[700] text-[#2f2f2f]">
        <SquareDashedKanbanIcon color="#1488CC" />{" "}
        <span className="text-[#1488CC]">Kanban</span>: Your collaborative
        dashboard
      </p>
      <div className="flex gap-[8px] items-center">
        <Tooltip title={`Server ${status}`}>
          <div className="border border-[#918f8f33] rounded-full py-[10px] px-[10px] items-center flex gap-[10px] h-fit">
            {status == "online" ? (
              <Wifi color="#07DD05" />
            ) : (
              <WifiOff color="grey" />
            )}
          </div>
        </Tooltip>
        {/* <AddColumnModal /> */}
      </div>
    </div>
  );
};

export default Navbar;
