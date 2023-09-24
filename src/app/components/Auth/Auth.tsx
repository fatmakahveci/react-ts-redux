"use client";

import { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { authActions } from "../../store/auth";
import "./Auth.css";

const Auth = (): JSX.Element => {
	const dispatch: AppDispatch = useDispatch();

	const loginHandler = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		dispatch(authActions.login());
	};

	return (
		<main className="auth">
			<section>
				<form onSubmit={loginHandler}>
					<div className="control">
						<label htmlFor="email">Email</label>
						<input type="email" id="email" />
					</div>
					<div className="control">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" />
					</div>
					<button>Login</button>
				</form>
			</section>
		</main>
	);
};
export default Auth;
