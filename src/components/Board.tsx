/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useBoard } from "../context/BoardContext";
import { Column } from "./Column";
import Navbar from "./Navbar";
import { CreateRoomModal } from "./RoomSelector";
import {
  
  Divider,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Circle,
  LogOut,
  Settings,
  SquareDashedKanban,
  WifiOff,
} from "lucide-react";
import { AddColumnModal } from "./AddColumnModal";
// import { AddColumnModal } from "./AddColumnModal";

export function Board() {
  const {
    board,
    moveCard,
    moveColumn,
    availableRooms,
    joinRoom,
    status,
  } = useBoard();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [tab, setTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleChange = async (event: any) => {
    const roomId = event.target.value;
    setSelectedRoom(roomId);
    const ok = await joinRoom(roomId);
    if (ok) {
      alert("Joined Room");
    } else {
      alert("Failed to join room");
    }
  };

  const handleLeaveRoom = () => {
    localStorage.removeItem("joinedRoomId");
    setSelectedRoom("");
  };

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
    <>
      <div
        className=" bg-[#FFF] flex flex-col border-box px-[24px]"
        style={{ minHeight: "100vh" }}
      >
        <Navbar />
        {status == "offline" ? (
          <p className="text-[#2f2f2f] w-full items-center flex flex-col gap-[12px] justify-center h-full">
            <WifiOff color="#1488CC" size={128} />
            <p className="font-[600] text-[24px]">
              Looks like the server is offline
            </p>
            <p className="font-[400] text-[18px] text-[#718098]">
              Contact admin for support
            </p>
          </p>
        ) : (
          <div className="flex flex-col gap-[15px] flex-1">
            <div className="flex gap-[20px] items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <div
                  className="py-[12px] px-[12px] flex items-center gap-[10px] w-fit rounded-[12px]"
                  style={{ boxShadow: "0 0 10px #00000033" }}
                >
                  <div className="flex items-center">
                    <Circle fill="#1488cc" />
                    <Select
                      sx={{
                        paddingBlock: "8px",
                        paddingInline: "20px",
                        borderRadius: "8px",
                        background: "#fff",
                        minWidth: "200px",
                        border: "none",
                        color: "#2f2f2f",
                        fontWeight: 600,
                        alignItems: "center",
                        "& .MuiSelect-select": {
                          padding: 0,
                          border: "none",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                      IconComponent={ChevronDown}
                      labelId="room-select-label"
                      value={selectedRoom}
                      label="Select Room"
                      onChange={handleChange}
                    >
                      {availableRooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-[4px] px-[24px] py-[16px] rounded-[12px] outline-none border border-[#1488cc] hover:bg-[#1488CC] text-[#1488cc] hover:text-[#fff] font-[600] text-[14px] cursor-pointer bg-transparent"
                  >
                    Create Board
                  </button>
                </div>
              </div>
            </div>
            <div className="p-[20px] rounded-[12px] border border-[#7180891A] bg-[#f8f8f8] flex flex-col gap-[20px] h-full mb-[24px] flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <p className="font-[600] text-[32px] text-[#2f2f2f]">Board</p>
                  <Divider
                    orientation="vertical"
                    sx={{
                      mx: 3,
                      border: "1px solid #7180891A",
                      height: "32px",
                    }}
                  />
                  <Tabs value={tab} onChange={handleTabChange}>
                    <Tab
                      sx={{
                        padding: 2,
                        color: "#2f2f2f", // Default text color
                        "&.Mui-selected": {
                          color: "#1488CC", // Highlight selected tab
                        },
                      }}
                      icon={<BarChart3 />}
                      iconPosition="start"
                      label="Overview"
                    />
                    <Tab
                      sx={{
                        padding: 2,
                        color: "#2f2f2f", // Default text color
                        "&.Mui-selected": {
                          color: "#1488CC", // Highlight selected tab
                        },
                      }}
                      icon={<Settings />}
                      iconPosition="start"
                      label="Settings"
                    />
                  </Tabs>
                </div>
                {selectedRoom && (
                  <div className="flex items-center">
                    <AddColumnModal />{" "}
                    <Divider
                      orientation="vertical"
                      sx={{
                        mx: 3,
                        border: "1px solid #7180891A",
                        height: "32px",
                      }}
                    />
                    <Tooltip title="Leave Room">
                      <LogOut
                        color="#FF0000"
                        onClick={handleLeaveRoom}
                        size={32}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
              {selectedRoom && tab == 0 ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId="board"
                    direction="horizontal"
                    type="COLUMN"
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-[20px] box-border overflow-x-auto overflow-y-hidden h-full min-w-0"
                        style={{ boxSizing: "border-box" }}
                      >
                        {board?.length > 0 ? (
                          board.map((col, index) => (
                            <Column key={col.id} column={col} index={index} />
                          ))
                        ) : (
                          <div className="w-full items-center flex flex-col gap-[10px] justify-center h-full text-[#2f2f2f]">
                            <SquareDashedKanban color="#1488CC" size={64} />
                            <span className="flex flex-col items-center justify-center gap-[6px]">
                              <p className="font-[600] text-[24px] leading-[24px]">
                                No Columns Added
                              </p>
                              <p className="font-[400] text-[18px] text-[#718098] leading-[18px]">
                                create a column to get started
                              </p>
                            </span>
                            <AddColumnModal />
                          </div>
                        )}
                        {provided.placeholder}
                        {/* <AddColumnModal /> */}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : selectedRoom && tab == 1 ? (
                <p className="text-[#2f2f2f] w-full items-center flex flex-col gap-[12px] justify-center h-full">
                  <Settings color="#1488CC" size={128} />
                  <p className="font-[600] text-[24px]">
                    Settings Page Coming Soon
                  </p>
                  <p className="font-[400] text-[18px] text-[#718098]">
                    This page is under development
                  </p>
                </p>
              ) : availableRooms?.length > 0 ? (
                <p className="text-[#2f2f2f] w-full items-center flex flex-col gap-[12px] justify-center h-full">
                  <SquareDashedKanban color="#1488CC" size={128} />
                  <p className="font-[600] text-[24px]">
                    Looks like you've not joined a room
                  </p>
                  <p className="font-[400] text-[18px] text-[#718098]">
                    Join a Room to start collaborating
                  </p>
                </p>
              ) : (
                <p className="text-[#2f2f2f] w-full items-center flex flex-col gap-[12px] justify-center h-full">
                  <SquareDashedKanban color="#1488CC" size={128} />
                  <p className="font-[600] text-[24px]">No Rooms Available</p>
                  <p className="font-[400] text-[18px] text-[#718098]">
                    Create a Room to start collaborating with others
                  </p>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <CreateRoomModal open={open} handleClose={handleClose} />
    </>
  );
}
