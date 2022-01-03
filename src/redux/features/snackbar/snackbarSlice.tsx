import { createSlice } from "@reduxjs/toolkit";
import { ElementType, ReactElement } from "react";
import type { AppState } from "../../app/store";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slide, { SlideProps } from "@mui/material/Slide";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

interface Snackbar {
  action: ReactElement;
  anchorOrigin: {
    horizontal: "left" | "right" | "center";
    vertical: "bottom" | "top";
  };
  autoHideDuration: number | null;
  message: string;
  open: boolean;
  TransitionComponent: ElementType;
}

const action = (
  <IconButton size="small" aria-label="close" color="inherit">
    <CloseIcon fontSize="small" />
  </IconButton>
);

const initialState: Snackbar = {
  action,
  anchorOrigin: {
    horizontal: "left",
    vertical: "bottom",
  },
  autoHideDuration: null,
  message: "",
  open: false,
  TransitionComponent: SlideTransition,
};

const handleWalletActions = (
  state: Snackbar,
  message: string,
  open: boolean
) => {
  state.action = action;
  state.anchorOrigin = {
    horizontal: "left",
    vertical: "bottom",
  };
  state.autoHideDuration = null;
  state.message = message;
  state.TransitionComponent = SlideTransition;
  state.open = open;
};

// Snackbar reducer
export const snackbar = createSlice({
  name: "snackbar",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    walletConnected: (state) =>
      handleWalletActions(state, "Wallet connected", true),
    walletDisconnected: (state) =>
      handleWalletActions(state, "Wallet disconnected", false),
  },
});

export const { walletConnected, walletDisconnected } = snackbar.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectData = (state: AppState) => state.snackbar;

export default snackbar.reducer;
