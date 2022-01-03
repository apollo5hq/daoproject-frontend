import web3reducer, {
  disconnectWallet,
  initialState,
} from "src/redux/features/web3/webSlice";

const updatedState = {
  data: {
    address: "0x3048f0h0f8h0f8f9903303",
    ens: "dao.eth",
    avatar: null,
    chainId: "0x1",
    network: "Ethereum Main Network",
  },
  loading: false,
  error: false,
  isMetamask: true,
  isConnected: true,
};

// Initial render of app
test("should return initial state", () => {
  expect(web3reducer(undefined, { type: "" })).toEqual(initialState);
});

test("disconnecting wallet should return initial state with isMetamask property true", () => {
  expect(web3reducer(updatedState, disconnectWallet())).toEqual({
    ...initialState,
    isMetamask: true,
    isConnected: false,
  });
});
