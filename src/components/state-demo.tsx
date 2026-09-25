"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "../store/redux-hooks";
import AppHeader from "./app-header/app-header";
import Counter from "./counter/counter";
import LoginForm from "./login-form/login-form";
import UserProfile from "./user-profile/user-profile";

export default function StateDemo() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const previousAuth = useRef(isAuthenticated);

  useEffect(() => {
    if (previousAuth.current !== isAuthenticated) {
      // Login/logout removes the triggering control; move focus to the new view.
      document.getElementById(isAuthenticated ? "profile-title" : "login-title")?.focus();
      previousAuth.current = isAuthenticated;
    }
  }, [isAuthenticated]);

  return (
    <>
      <AppHeader />
      <main id="main-content" tabIndex={-1}>
        {isAuthenticated ? <UserProfile /> : <LoginForm />}
        <Counter />
      </main>
    </>
  );
}
