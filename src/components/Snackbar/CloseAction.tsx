import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "src/redux/app/hooks";
import { closeSnackbar } from "src/redux/features/snackbar/snackbarSlice";

export default function () {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(closeSnackbar());
  };

  return (
    <IconButton
      onClick={onClick}
      size="small"
      aria-label="close"
      color="inherit"
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
}
