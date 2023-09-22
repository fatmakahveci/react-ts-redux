"use client";

import { Provider } from "react-redux";
import Counter from "../app/components/Counter/Counter";
import store from "./store";
import "./globals.css";

const Home = ({}): JSX.Element => {
	return (
		<Provider store={store}>
			<Counter />
		</Provider>
	);
};

export default Home;
