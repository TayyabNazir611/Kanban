import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { Plus } from "lucide-react";
import { useBoard } from "../context/BoardContext";

export function AddCardModal({ columnId }: { columnId: string }) {
  const { addCard } = useBoard();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleAdd = () => {
    if (!title.trim()) return;
    addCard(columnId, { title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
    setOpen(false);
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 flex items-center gap-1 text-sm bg-transparent text-[#2f2f2f] cursor-pointer px-[12px] py-[5px] w-fit rounded-[8px] border-none"
      >
        <Plus className="h-4 w-4" />
        {/* Add Card */}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "22px", maxWidth: 400 },
        }}
      >
        <DialogTitle>New Card</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingTop: "16px !important",
          }}
        >
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #2f2f2f",
                borderRadius: 4,
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #2f2f2f",
                borderRadius: 4,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ paddingInline: "24px", paddingBlock: "12px" }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: "50px",
              border: "1px solid #2f2f2f",
              color: "#2f2f2f",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{ borderRadius: "50px", background: "#1488CC" }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
