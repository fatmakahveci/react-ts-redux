"use client";

import { useSelector } from "react-redux";
import Auth from "./components/Auth/Auth";
import Counter from "./components/Counter/Counter";
import Header from "./components/Header/Header";
import UserProfile from "./components/UserProfile/UserProfile";
import "./globals.css";
import store, {RootState} from "./store";

const App = ({}): JSX.Element => {
	const isAuth: boolean = useSelector((state: RootState) => state.auth.isAuthenticated);

	return (
		<>
			<Header />
			{!isAuth && <Auth />}
			{!isAuth && <UserProfile />}
			<Counter />
		</>
	);
};

export default App;
