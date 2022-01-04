import { createSlice } from "@reduxjs/toolkit";
import { JSXElementConstructor, ReactElement } from "react";
import type { AppState } from "../../app/store";
import CloseAction from "src/components/Snackbar/CloseAction";
import Slide, { SlideProps } from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

export interface SnackbarMessage {
  message: string;
}

interface Snackbar {
  action: ReactElement;
  anchorOrigin: {
    horizontal: "left" | "right" | "center";
    vertical: "bottom" | "top";
  };
  autoHideDuration: number | null;
  message?: string;
  open: boolean;
  TransitionComponent?: JSXElementConstructor<
    TransitionProps & { children: ReactElement<any, any> }
  >;
  severity: "success" | "error" | "info" | "warning";
  snackPack: readonly SnackbarMessage[];
}

export const initialState: Snackbar = {
  action: <CloseAction />,
  anchorOrigin: {
    horizontal: "left",
    vertical: "bottom",
  },
  autoHideDuration: 6000,
  message: "",
  open: false,
  TransitionComponent: SlideTransition,
  severity: "info",
  snackPack: [],
};

const handleWalletActions = (state: Snackbar, message: string) => {
  state.action = <CloseAction />;
  state.anchorOrigin = {
    horizontal: "left",
    vertical: "bottom",
  };
  state.autoHideDuration = 6000;
  state.TransitionComponent = SlideTransition;
  state.snackPack = [{ message }];
  state.severity = "success";
};

// Snackbar reducer
export const snackbar = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    walletConnected: (state) => handleWalletActions(state, "Wallet connected"),
    walletDisconnected: (state) =>
      handleWalletActions(state, "Wallet disconnected"),
    closeSnackbar: (state) => {
      state.open = false;
    },
    setSnackPack: (state) => {
      state.message = state.snackPack[0].message;
      state.snackPack = state.snackPack.slice(1);
      state.open = true;
    },
    exited: (state) => {
      state.message = undefined;
    },
  },
});

export const {
  walletConnected,
  walletDisconnected,
  closeSnackbar,
  setSnackPack,
  exited,
} = snackbar.actions;

export const selectData = (state: AppState) => state.snackbar;

export default snackbar.reducer;
