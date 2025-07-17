import { type ColumnType } from "../context/BoardContext";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { AddCardModal } from "./AddCardModal";

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
          className="w-72 bg-[#f5f3f4AF] backdrop-blur-[5px] dark:bg-neutral-800 shadow flex flex-col min-w-[310px] p-[16px] gap-[12px] rounded-[20px] min-h-[150px] h-fit"
        >
          <div className="flex justify-between items-center  rounded-[12px] shadow-[8px] py-[8px]">
            <p
              {...provided.dragHandleProps}
              className="font-bold text-[20px] mb-4 text-[#2f2f2f] "
            >
              {column.title}
            </p>
            <AddCardModal columnId={column.id} />
          </div>

          <Droppable droppableId={column.id} type="CARD">
            {(dropProvided) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                className="flex-1 space-y-[12px] overflow-y-auto"
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
