import snackbarReducer, {
  walletDisconnected,
  initialState,
  walletConnected,
} from "src/redux/features/snackbar/snackbarSlice";

// Initial render of app
test("should return initial state", () => {
  expect(snackbarReducer(undefined, { type: "" })).toEqual(initialState);
});

test("disconnecting wallet should update snackbar", () => {
  const message = "Wallet disconnected";
  const updatedState = {
    ...initialState,
    message,
    snackPack: [{ message }],
  };
  expect(snackbarReducer(updatedState, walletDisconnected())).toEqual(
    updatedState
  );
});

test("connecting wallet should update snackbar", () => {
  const message = "Wallet connected";
  const updatedState = {
    ...initialState,
    message,
    snackPack: [{ message }],
  };
  expect(snackbarReducer(updatedState, walletConnected())).toEqual(
    updatedState
  );
});
