import { createSlice } from "@reduxjs/toolkit";

export type Plot = {
  id: number;
  user: string;
  width: number;
  height: number;
  isComplete: boolean;
};

interface Mural {
  id: string;
  plots: Plot[];
  width: number;
  height: number;
}

export interface MuralsState {
  murals: Mural[];
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
    createMural: (state, { payload }: { payload: { mural: Mural } }) => {
      const { mural: newMural } = payload;
      const newData = [...state.murals];
      newData.push(newMural);
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
