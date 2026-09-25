"use client";

import type { FormEvent } from "react";
import { useAppDispatch } from "../../store/redux-hooks";
import { authActions } from "../../store/slices/auth-slice";
import "./login-form.css";

export default function LoginForm() {
  const dispatch = useAppDispatch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // This demo changes UI state without authenticating or storing credentials.
    dispatch(authActions.login());
  }

  return (
    <section className="panel login-form" aria-labelledby="login-title">
      <h2 id="login-title">Demo login</h2>
      <p>Demo only: use fictitious credentials. No account is verified.</p>
      {/* Unnamed inputs keep demo credentials out of native form submissions. */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            required
          />
        </div>
        <div className="control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </section>
  );
}
