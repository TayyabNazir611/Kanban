import { Dialog, DialogTitle } from "@mui/material";
import { CircleAlert } from "lucide-react";

const ServerOffline = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (status: boolean) => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxWidth: 400,
          background: "#F2D600c8",
        },
      }}
      sx={{ backdropFilter: "blur(1px)" }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "8px",
          color: "#fff",
        }}
      >
        <CircleAlert color="#FFEE8C" size={50} /> Server is currently offline
      </DialogTitle>
    </Dialog>
  );
};

export default ServerOffline;
