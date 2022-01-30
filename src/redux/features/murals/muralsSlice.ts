import { createSlice } from "@reduxjs/toolkit";

export type Plot = {
  id: number;
  muralId: number;
  artist: string | null;
  width: number;
  height: number;
  isComplete: boolean;
  created_at: Date;
};

export type Mural = {
  id: string;
  width: number;
  height: number;
  created_at: Date;
};

export interface MuralsState {
  murals: (Mural & { plots: Plot[] })[];
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
