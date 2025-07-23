import { type ColumnType } from "../context/BoardContext";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { AddCardModal } from "./AddCardModal";
import { Ellipsis } from "lucide-react";

export function Column({
  column,
  index,
}: {
  column: ColumnType;
  index: number;
}) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-72 bg-[#F4F5F7] border border-[#7180961A] backdrop-blur-[5px] dark:bg-neutral-800 shadow flex flex-col min-w-[310px] p-[16px] gap-[12px] rounded-[20px] min-h-[150px] h-fit"
        >
          <div className="flex justify-between items-center  rounded-[12px] shadow-[8px] py-[8px]">
            <p
              {...provided.dragHandleProps}
              className="font-[700] text-[20px] mb-4 text-[#2C3E50] capitalize "
            >
              {column.title}
            </p>
            <div className="flex gap-[2px] items-center">
              <AddCardModal columnId={column.id} />
              <Ellipsis color="#2f2f2f" />
            </div>
          </div>

          <Droppable droppableId={column.id} type="CARD">
            {(dropProvided) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                className="flex-1 space-y-[12px] overflow-y-auto h-full"
                style={{ scrollbarWidth: "none" }}
              >
                {column.cards.map((card, i) => (
                  <Card
                    key={card.id}
                    columnId={column.id}
                    card={card}
                    index={i}
                  />
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
