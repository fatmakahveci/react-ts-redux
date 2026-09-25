import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import "./helpers/register-typescript.mjs";

const require = createRequire(import.meta.url);
const { makeStore } = require("../src/store/store.ts");
const { authActions } = require("../src/store/slices/auth-slice.ts");
const { counterActions } = require("../src/store/slices/counter-slice.ts");

test("separate stores keep independent login, value and visibility state", () => {
  const first = makeStore();
  const second = makeStore();
  first.dispatch(authActions.login());
  first.dispatch(counterActions.increase(5));
  first.dispatch(counterActions.toggleCounter());

  const initialState = {
    auth: { isAuthenticated: false },
    counter: { counter: 0, showCounter: true },
  };
  assert.deepEqual(second.getState(), initialState);
  assert.deepEqual(makeStore().getState(), initialState);

  second.dispatch(counterActions.decrement());
  assert.deepEqual(first.getState(), {
    auth: { isAuthenticated: true },
    counter: { counter: 5, showCounter: false },
  });
  assert.equal(second.getState().counter.counter, -1);
});

test("authentication and counter actions preserve the other feature's state", () => {
  const store = makeStore();
  store.dispatch(counterActions.increase(12));
  store.dispatch(counterActions.toggleCounter());
  const hiddenCounter = store.getState().counter;

  store.dispatch(authActions.login());
  assert.equal(store.getState().counter, hiddenCounter);
  const authenticated = store.getState().auth;
  store.dispatch(counterActions.decrement());
  assert.equal(store.getState().auth, authenticated);

  store.dispatch(authActions.logout());
  assert.deepEqual(store.getState(), {
    auth: { isAuthenticated: false },
    counter: { counter: 11, showCounter: false },
  });
});
