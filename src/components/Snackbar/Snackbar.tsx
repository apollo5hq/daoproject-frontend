import { forwardRef, SyntheticEvent, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "src/redux/app/hooks";
import {
  closeSnackbar,
  setSnackPack,
  exited,
} from "src/redux/features/snackbar/snackbarSlice";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function () {
  const state = useAppSelector((state) => state.snackbar);
  const {
    open,
    autoHideDuration,
    action,
    severity,
    message,
    snackPack,
    TransitionComponent,
  } = state;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (snackPack.length && !message) {
      // Set a new snack when we don't have an active one
      dispatch(setSnackPack());
    } else if (snackPack.length && message && open) {
      // Close an active snack when a new one is added
      dispatch(closeSnackbar());
    }
  }, [snackPack, message, open]);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeSnackbar());
  };

  const handleExited = () => {
    dispatch(exited());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      action={action}
      TransitionProps={{ onExited: handleExited }}
      TransitionComponent={TransitionComponent}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
