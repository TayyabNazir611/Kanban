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
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setOpen(true)}
          className="cursor-pointer bg-white hover:bg-white/80 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-xl p-[12px] shadow max-w-[300px]"
        >
          <div className="flex justify-between">
            <p className="font-medium text-lg mb-1 ">{card.title}</p>
            <Edit size={16} onClick={() => setOpen(true)} />
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">
            {card.description}
          </p>
          <CardEditor
            card={card}
            columnId={columnId}
            open={open}
            onClose={() => setOpen(false)}
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
    onClose?.();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Card</DialogTitle>
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
          <Button onClick={() => onClose?.()}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
