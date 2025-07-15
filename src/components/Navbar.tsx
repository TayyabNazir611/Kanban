import { SquareDashedKanbanIcon } from "lucide-react";
import { AddColumnModal } from "./AddColumnModal";

const Navbar = () => {
  return (
    <div className="flex justify-between py-[12px] bg-[#2f2f2f80] backdrop-blur-[5px] rounded-[12px] px-[24px]">
      <p className="flex gap-px items-center text-[24px] m-[0px]">
        <SquareDashedKanbanIcon /> Kanban
      </p>
      <div className="flex gap-[8px]">
        <p>Users: {1}</p>
        <AddColumnModal />
      </div>
    </div>
  );
};

export default Navbar;
