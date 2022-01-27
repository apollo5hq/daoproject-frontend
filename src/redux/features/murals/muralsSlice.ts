import { createSlice } from "@reduxjs/toolkit";

export type Plot = {
  id: number;
  user: string;
  width: number;
  height: number;
  isComplete: boolean;
};

type Murals = {
  id: string;
  plots: Plot[];
  width: number;
  height: number;
}[];

export interface MuralsState {
  murals: Murals;
  loading: boolean;
}

export const initialState: MuralsState = {
  murals: [],
  loading: false,
};

// Web3 reducer
export const murals = createSlice({
  name: "murals",
  initialState,
  reducers: {
    createMural: (state, { payload }) => {
      const newData = [...state.murals];
      newData.push(payload);
      state.murals = newData;
    },
    updatePlot: (state, { payload }) => {
      const { mural } = payload;
      state.murals = [mural];
    },
  },
});

export const { createMural, updatePlot } = murals.actions;

export default murals.reducer;
