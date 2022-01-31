import { createSlice } from "@reduxjs/toolkit";
export type Plot = {
  id: number;
  muralId: number;
  artist: string | null;
  width: number;
  height: number;
  isComplete: boolean;
};

export type Mural = {
  id: string;
  width: number;
  height: number;
  columns: number;
  rows: number;
  artists: string[];
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
export const muralsSlice = createSlice({
  name: "murals",
  initialState,
  reducers: {
    createMural: (
      state,
      { payload }: { payload: Mural & { plots: Plot[] } }
    ) => {
      const newData = [...state.murals];
      newData.push(payload);
      state.murals = newData;
    },
    getMurals: (
      state,
      { payload }: { payload: (Mural & { plots: Plot[] })[] }
    ) => {
      state.murals = [...payload];
    },
    updatePlot: (state, { payload }) => {
      const { mural } = payload;
      state.murals = [mural];
    },
  },
});

export const { createMural, updatePlot, getMurals } = muralsSlice.actions;

export default muralsSlice.reducer;
