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
          className="w-72 bg-white dark:bg-neutral-800 rounded-2xl shadow p-4 flex flex-col min-w-[310px] h-fit"
        >
          <div className="flex justify-between items-center">
            <h2
              {...provided.dragHandleProps}
              className="font-semibold text-lg mb-4"
            >
              {column.title}
            </h2>
            <AddCardModal columnId={column.id} />
          </div>

          <Droppable droppableId={column.id} type="CARD">
            {(dropProvided) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                className="flex-1 space-y-4 overflow-y-auto"
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
