import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
  counter: number;
  showCounter: boolean;
};

const initialState: CounterState = {
  counter: 0,
  showCounter: true,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  // Redux Toolkit uses Immer, so draft mutations produce immutable updates.
  reducers: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    increase(state, action: PayloadAction<number>) {
      state.counter += action.payload;
    },
    toggleCounter(state) {
      state.showCounter = !state.showCounter;
    },
  },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
