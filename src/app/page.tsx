"use client";

import { Provider } from "react-redux";
import App from "./_app";
import store from "./store";

const index = ({}) => {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};

export default index;