"use client";

import { useAppSelector } from "../store/redux-hooks";
import AppHeader from "./app-header/app-header";
import Counter from "./counter/counter";
import LoginForm from "./login-form/login-form";
import UserProfile from "./user-profile/user-profile";

export default function StateDemo() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <AppHeader />
      <main id="main-content">
        {isAuthenticated ? <UserProfile /> : <LoginForm />}
        <Counter />
      </main>
    </>
  );
}
