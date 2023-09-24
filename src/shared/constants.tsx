"use client";

import { AuthState, CounterState } from "./types";

export const INITIAL_AUTH_STATE: AuthState = {
	isAuthenticated: false,
};

export const INITIAL_COUNTER_STATE: CounterState = {
	counter: 0,
	showCounter: true,
};
