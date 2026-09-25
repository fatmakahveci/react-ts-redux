import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
  counter: number;
  showCounter: boolean;
};

const initialState: CounterState = {
  counter: 0,
  showCounter: true,
};

// Keep arithmetic exact; reject invalid payloads even when dispatched outside the UI.
export function canAdjustCounter(value: number, amount: number) {
  return Number.isSafeInteger(amount) && Number.isSafeInteger(value + amount);
}

const counterSlice = createSlice({
  name: "counter",
  initialState,
  // Redux Toolkit uses Immer, so draft mutations produce immutable updates.
  reducers: {
    increment(state) {
      if (canAdjustCounter(state.counter, 1)) state.counter++;
    },
    decrement(state) {
      if (canAdjustCounter(state.counter, -1)) state.counter--;
    },
    increase(state, action: PayloadAction<number>) {
      if (canAdjustCounter(state.counter, action.payload)) state.counter += action.payload;
    },
    reset(state) {
      state.counter = 0;
    },
    toggleCounter(state) {
      state.showCounter = !state.showCounter;
    },
  },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
