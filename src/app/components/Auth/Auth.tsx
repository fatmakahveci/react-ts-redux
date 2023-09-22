"use client";

import "./Auth.css";

const Auth = (): JSX.Element => {
	return (
		<main className="control">
			<section>
				<form>
					<div className="control">
						<label htmlFor="email">Email</label>
						<input type="email" id="email" />
					</div>
					<div className="control">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" />
					</div>
				</form>
			</section>
		</main>
	);
};
export default Auth;
