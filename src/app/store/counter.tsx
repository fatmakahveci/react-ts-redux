"use client";

import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_COUNTER_STATE } from "../../shared/constants";

const counterSlice = createSlice({
	name: "counter",
	initialState: INITIAL_COUNTER_STATE,
	reducers: {
		increment(state) {
			state.counter++;
		},
		decrement(state) {
			state.counter--;
		},
		increase(state, action) {
			state.counter += action.payload;
		},
		toggleCounter(state) {
			state.showCounter = !state.showCounter;
		},
	},
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
