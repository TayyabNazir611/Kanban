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
import { Clock, Edit, Trash } from "lucide-react";

export function Card({
  columnId,
  card,
  index,
}: {
  columnId: string;
  card: CardType;
  index: number;
}) {
  const { deleteCard } = useBoard();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setOpen(true)}
            className="cursor-pointer bg-[#fff] hover:bg-[#ffffff80] p-[12px] max-w-[300px] rounded-[16px] border-b-2 border-b-[#718089]"
          >
            <div className="flex justify-between items-center shadow">
              <p className="font-medium text-lg mb-1 text-[#2f2f2f]">
                {card.title}
              </p>
              <div className="flex gap-[4px]">
                <Edit size={16} onClick={() => setOpen(true)} color="#2f2f2f" />
                <Trash
                  size={16}
                  onClick={() => deleteCard(columnId, card?.id)}
                  color="#FF0000"
                />
              </div>
            </div>
            <p className="text-xs text-[#2f2f2f80] line-clamp-2">
              {card.description}
            </p>
            <div className="w-full p-[5px] text-[#718098] text-[12px] items-center flex gap-[4px]">
              <Clock size={12} />
              <p>{new Date(card?.createdAt)?.toDateString()}</p>
            </div>
          </div>
          {open && (
            <CardEditor
              card={card}
              columnId={columnId}
              open={open}
              onClose={handleClose}
            />
          )}
        </>
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
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "22px", maxWidth: 400 },
        }}
        sx={{ backdropFilter: "blur(10px)" }}
      >
        <DialogTitle className="font-bold text-[22px] text-[#2f2f2f]">
          Edit Card
        </DialogTitle>
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
            onClick={onClose}
            sx={{
              borderRadius: "12px",
              border: "1px solid #2f2f2f",
              color: "#2f2f2f",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ borderRadius: "12px", background: "#1488CC" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
