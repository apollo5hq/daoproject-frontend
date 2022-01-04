import { useEffect, useRef } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import type { AppState } from "./store";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const handler = (...args: any) => savedCallback.current?.(...args);

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * Function to dispatch an action to a reducer and update redux store.
 * Use this throught the application instead of importing 'useDispatch'
 */
export const useAppDispatch = useDispatch;

/**
 * Function to get the state of the redux store.
 * Use this throughout the application instead of 'useSelector'.
 */
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
