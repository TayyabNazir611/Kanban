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
        className="mt-4 flex items-center gap-1 text-sm border border-[#fff] bg-transparent text-[#fff] cursor-pointer px-[12px] py-[5px] w-fit rounded-[8px] border-none"
      >
        <Plus className="h-4 w-4" />
        {/* Add Card */}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New Card</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            className="w-fit rounded-[8px] px-[10px] py-[8px]"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
