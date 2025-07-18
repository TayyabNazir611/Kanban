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
        className="w-72 font-[600] flex items-center justify-center py-[8px] px-[16px] text-[#2f2f2f] border-[#2f2f2f] hover:bg-[#1488CC] hover:border-[#1488CC] hover:text-[#fff] transition-all duration-300 cursor-pointer rounded-full bg-transparent border-2 border-gray-400 dark:border-neutral-600 rounded-2xl text-gray-600 hover:text-gray-800 dark:text-neutral-400 hover:border-gray-600 h-[54px]"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Column
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: "12px", maxWidth: 400 },
        }}
        sx={{ backdropFilter: "blur(10px)" }}
      >
        <DialogTitle>New Column</DialogTitle>
        <DialogContent sx={{ paddingTop: 4 }}>
          <TextField
            fullWidth
            label="Column Title"
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
            onClick={() => setOpen(false)}
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
            onClick={handleAdd}
            sx={{ borderRadius: "8px", background: "#1488CC" }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
