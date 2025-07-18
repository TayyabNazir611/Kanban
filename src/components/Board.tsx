import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useBoard } from "../context/BoardContext";
import { Column } from "./Column";
import Navbar from "./Navbar";
// import { AddColumnModal } from "./AddColumnModal";

export function Board() {
  const { board, moveCard, moveColumn } = useBoard();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (type === "COLUMN") {
      if (destination.index === source.index) return;
      moveColumn(source.index, destination.index);
      return;
    }
    // Cards
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    moveCard(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  return (
    <div
      className=" bg-[#FFF] flex flex-col border-box"
      style={{ height: "100vh" }}
    >
      <div className="rounded-[12px]">
        <Navbar />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-[20px] p-[24px] h-dvh box-border overflow-x-auto overflow-y-hidden h-full"
            >
              {board?.length > 0 ? (
                board.map((col, index) => (
                  <Column key={col.id} column={col} index={index} />
                ))
              ) : (
                <>No Columns Added, Add your first column to get Started</>
              )}
              {provided.placeholder}
              {/* <AddColumnModal /> */}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
