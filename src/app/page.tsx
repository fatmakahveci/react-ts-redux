"use client";

import { Provider } from "react-redux";
import Auth from "../app/components/Auth/Auth";
import Counter from "../app/components/Counter/Counter";
import Header from "../app/components/Header/Header";
import "./globals.css";
import store from "./store";

const Home = ({}): JSX.Element => {
	return (
		<Provider store={store}>
			<Header />
			<Auth />
			<Counter />
		</Provider>
	);
};

export default Home;
