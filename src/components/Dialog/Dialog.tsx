import { Dispatch, SetStateAction } from "react";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function ({
  open,
  setOpen,
  openseaLink,
}: {
  openseaLink: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        />
        <DialogContent>
          <div style={{ padding: 50 }}>
            <Typography gutterBottom variant="subtitle1" align="center">
              Congrats you have claimed your NFT!
            </Typography>
            <Typography gutterBottom variant="subtitle1" align="center">
              It can take up to 10 min to see your NFT on OpenSea. Here's the
              link:
            </Typography>
            <Typography gutterBottom align="center">
              <Link href={openseaLink} underline="hover">
                {openseaLink}
              </Link>
            </Typography>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
