import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { type CardType, useBoard } from "../context/BoardContext";
import { Draggable } from "@hello-pangea/dnd";
import { Edit } from "lucide-react";

export function Card({
  columnId,
  card,
  index,
}: {
  columnId: string;
  card: CardType;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setOpen(true)}
          className="cursor-pointer bg-[#fff] hover:bg-[#ffffff80] dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-xl p-[12px] max-w-[300px] shadow shadow-[#2f2f2f33]"
        >
          <div className="flex justify-between items-center shadow">
            <p className="font-medium text-lg mb-1 text-[#2f2f2f]">
              {card.title}
            </p>
            <Edit size={16} onClick={() => setOpen(true)} color="#2f2f2f" />
          </div>
          <p className="text-xs text-[#2f2f2f80] line-clamp-2">
            {card.description}
          </p>
          <CardEditor
            card={card}
            columnId={columnId}
            open={open}
            onClose={handleClose}
          />
        </div>
      )}
    </Draggable>
  );
}

export function CardEditor({
  columnId,
  card,
  open,
  onClose,
}: {
  columnId: string;
  card: CardType;
  open: boolean;
  onClose: () => void;
}) {
  const { updateCard } = useBoard();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleSave = () => {
    updateCard(columnId, card.id, { title, description });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Card</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingTop: "10px",
          }}
        >
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
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
