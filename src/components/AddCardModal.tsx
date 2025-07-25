import { useState } from "react";
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
import ServerOffline from "./ServerOffline";

export function AddCardModal({ columnId }: { columnId: string }) {
  const { addCard, status } = useBoard();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [offline, setOffline] = useState(false);
  const handleAdd = () => {
    if (!title.trim()) return;
    addCard(columnId, {
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date(),
    });
    setTitle("");
    setDescription("");
    setOpen(false);
  };
  return (
    <>
      <button
        onClick={() => {
          if (status !== "offline") {
            setOpen(true);
          } else {
            setOffline(true);
            setOpen(true);
          }
        }}
        className="mt-4 flex items-center gap-1 text-sm bg-transparent text-[#2f2f2f] cursor-pointer px-[5px] py-[5px] w-fit rounded-[8px] border-none"
      >
        <Plus className="h-4 w-4" />
        {/* Add Card */}
      </button>
      {offline ? (
        <ServerOffline open={open} setOpen={setOpen} />
      ) : (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "12px",
              maxWidth: 400,
            },
          }}
          sx={{ backdropFilter: "blur(10px)" }}
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
                  borderRadius: 2,
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
      )}
    </>
  );
}
