"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import StateDemo from "../components/state-demo";
import { makeStore } from "../store/store";

export default function HomePage() {
  // Keep this page's store across rerenders; a fresh mount starts a new demo.
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <StateDemo />
    </Provider>
  );
}
