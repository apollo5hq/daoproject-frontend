import { ReactElement, FunctionComponent, JSXElementConstructor } from "react";
import { render as rtlRender } from "@testing-library/react";
import { configureStore, MiddlewareArray } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
// Import your own reducer
import web3reducer from "../src/redux/features/web3/webSlice";
import snackbarReducer from "../src/redux/features/snackbar/snackbarSlice";

function render(
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  {
    preloadedState,
    store = configureStore({
      reducer: { web3: web3reducer, snackbar: snackbarReducer },
      middleware: new MiddlewareArray(thunk),
      preloadedState,
    }),
    ...renderOptions
  }: any = {}
) {
  const Wrapper: FunctionComponent = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
