import web3reducer, {
  disconnectWallet,
} from "../../src/redux/features/web3/webSlice";

const initialState = {
  data: {
    address: null,
    ens: null,
    avatar: null,
    chainId: "",
    network: "",
  },
  loading: false,
  error: false,
};
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
};

test("should return initial state", () => {
  expect(web3reducer(undefined, { type: "" })).toEqual(initialState);
});

test("disconnecting wallet should return initial state", () => {
  expect(web3reducer(updatedState, disconnectWallet())).toEqual(initialState);
});
