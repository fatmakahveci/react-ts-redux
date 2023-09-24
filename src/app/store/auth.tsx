"use client";

import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_AUTH_STATE } from "../../shared/constants";

const authSlice = createSlice({
	name: "authentication",
	initialState: INITIAL_AUTH_STATE,
	reducers: {
		login(state) {
			state.isAuthenticated = true;
		},
		logout(state) {
			state.isAuthenticated = false;
		},
	},
});

export const authActions = authSlice.actions;

export default authSlice.reducer;