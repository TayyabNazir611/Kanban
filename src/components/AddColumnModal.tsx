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

export function AddColumnModal() {
  const { addColumn } = useBoard();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const handleAdd = () => {
    if (!title.trim()) return;
    addColumn(title.trim());
    setTitle("");
    setOpen(false);
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-72 flex items-center justify-center py-4 rounded-[12px] bg-transparent border-2 border-gray-400 dark:border-neutral-600 rounded-2xl text-gray-600 hover:text-gray-800 dark:text-neutral-400 hover:border-gray-600 h-[54px]"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Column
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>New Column</DialogTitle>
        <DialogContent className="pt-4">
          <TextField
            fullWidth
            label="Column Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
