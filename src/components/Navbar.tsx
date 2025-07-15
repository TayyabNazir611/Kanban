import { SquareDashedKanbanIcon } from "lucide-react";
import { AddColumnModal } from "./AddColumnModal";
import { useBoard } from "../context/BoardContext";

const Navbar = () => {
  const { clientCount } = useBoard();

  return (
    <div className="flex justify-between py-[12px] bg-[#2f2f2f80] backdrop-blur-[5px] rounded-[12px] px-[24px]">
      <p className="flex gap-px items-center text-[24px] m-[0px]">
        <SquareDashedKanbanIcon /> Kanban
      </p>
      <div className="flex gap-[8px]">
        <p>Users: {clientCount || 1}</p>
        <AddColumnModal />
      </div>
    </div>
  );
};

export default Navbar;
