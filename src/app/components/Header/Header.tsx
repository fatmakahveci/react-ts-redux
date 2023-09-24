"use client";

import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { authActions } from "../../store/auth";
import "./Header.css";

const Header = (): JSX.Element => {
	const dispatch: Dispatch<AnyAction> = useDispatch();
	const isAuth: boolean = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

	const logoutHandler = (): void => {
		dispatch(authActions.logout());
	};

	return (
		<header className="header">
			<h1>Redux Auth</h1>
			{isAuth && (
				<nav>
					<ul>
						<li>
							<a href="/">My Products</a>
						</li>
						<li>
							<a href="/">My Sales</a>
						</li>
						<li>
							<button onClick={logoutHandler}>Logout</button>
						</li>
					</ul>
				</nav>
			)}
		</header>
	);
};
export default Header;
