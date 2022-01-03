import snackbarReducer, {
  walletDisconnected,
  initialState,
} from "src/redux/features/snackbar/snackbarSlice";

// Initial render of app
test("should return initial state", () => {
  expect(snackbarReducer(undefined, { type: "" })).toEqual(initialState);
});

test("disconnecting wallet should update snackbar", () => {
  const updatedState = {
    ...initialState,
    message: "Wallet disconnected",
    snackPack: [{ key: new Date().getTime() }],
  };

  expect(snackbarReducer(updatedState, walletDisconnected())).toEqual(
    updatedState
  );
});
