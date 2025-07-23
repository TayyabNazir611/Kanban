import { Plus } from "lucide-react";
import { useBoard } from "../context/BoardContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const RoomSelector = () => {
  const { availableRooms, joinRoom } = useBoard();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <div className="bg-[#fff] rounded-[24px] p-[25px] flex flex-col gap-[12px] text-[#2f2f2f] font-[600] text-[20px]">
      <p>Room Selector</p>

      <div className="w-full flex justify-between items-center">
        <p className="text-[#2f2f2f]">Select a Room</p>
        <button className="bg-[#000]" onClick={() => setOpen(true)}>
          <Plus /> Create Room
        </button>
      </div>
      <div className="max-h-[500px] h-full border border-[#2f2f2f] rounded-[12px] p-[8px]">
        {availableRooms?.map((room, idx) => (
          <div
            key={idx}
            className="p-[20px] text-[#0079BF] text-[16px] font-[500] border-b border-b-[#718089] w-full items-start"
            style={{ boxSizing: "border-box" }}
            onClick={async () => {
              const ok = await joinRoom(room?.id);
              if (ok) {
                alert("Room Joined Successfully");
              } else {
                alert("Error Joining Room");
              }
            }}
          >
            {room?.title}
          </div>
        ))}
      </div>
      {open && <CreateRoomModal open={open} handleClose={handleClose} />}
    </div>
  );
};

export default RoomSelector;

export const CreateRoomModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const { createRoom, joinRoom } = useBoard();
  const [title, setTitle] = useState("");
  const handleCreate = async () => {
    if (!title) {
      alert("Enter a Room Title");
      return;
    }

    const Room = {
      id: uuid().slice(0, 8), // short room ID
      title: title.trim(),
    };

    const res = await createRoom(Room);
    if (res) {
      await joinRoom(Room.id);
      handleClose();
    } else {
      alert("error creating a room");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: "12px", maxWidth: 400 },
      }}
      sx={{ backdropFilter: "blur(10px)" }}
    >
      <DialogTitle>Create Room</DialogTitle>
      <DialogContent sx={{ paddingTop: 4 }}>
        <TextField
          fullWidth
          label="Room Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #2f2f2f",
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ paddingInline: "24px", paddingBlock: "12px" }}>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: "8px",
            border: "1px solid #2f2f2f",
            color: "#2f2f2f",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          sx={{ borderRadius: "8px", background: "#1488CC" }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
