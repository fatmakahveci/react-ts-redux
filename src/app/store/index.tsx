"use client";

import {
	AnyAction,
	ThunkMiddleware,
	configureStore,
	createSlice,
} from "@reduxjs/toolkit";
import { INITIAL_STATE } from "../../shared/constants";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { State } from "../../shared/types";

const counterSlice = createSlice({
	name: "counter",
	initialState: INITIAL_STATE,
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

const store: ToolkitStore<
	State,
	AnyAction,
	[ThunkMiddleware<State, AnyAction>]
> = configureStore({
	reducer: counterSlice.reducer,
});

export const counterActions: any = counterSlice.actions;

export default store;
