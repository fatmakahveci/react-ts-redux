"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../store/redux-hooks";
import { authActions } from "../../store/slices/auth-slice";
import "./app-header.css";

export default function AppHeader() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <header className="app-header">
      <h1>Redux Auth</h1>
      {isAuthenticated && (
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <button type="button" onClick={() => dispatch(authActions.logout())}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
