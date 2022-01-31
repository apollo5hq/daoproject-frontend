import {
  configureStore,
  ThunkAction,
  Action,
  MiddlewareArray,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { web3Slice } from "../features/web3/webSlice";
import { snackbarSlice } from "../features/snackbar/snackbarSlice";
import { muralsSlice } from "../features/murals/muralsSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      [web3Slice.name]: web3Slice.reducer,
      [snackbarSlice.name]: snackbarSlice.reducer,
      [muralsSlice.name]: muralsSlice.reducer,
    },
    middleware: new MiddlewareArray(thunk),
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type StoreActions = Action<any>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<StoreActions>
>;

export default store;
