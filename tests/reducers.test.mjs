import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import "./helpers/register-typescript.mjs";

const require = createRequire(import.meta.url);
const { default: authReducer, authActions } = require("../src/store/slices/auth-slice.ts");
const { default: counterReducer, counterActions } = require("../src/store/slices/counter-slice.ts");

test("authentication starts logged out", () => {
  assert.deepEqual(authReducer(undefined, { type: "test/initialize" }), {
    isAuthenticated: false,
  });
});

test("login and logout are repeatable without mutating earlier authentication state", () => {
  const initial = Object.freeze({ isAuthenticated: false });
  const loggedIn = authReducer(initial, authActions.login());
  assert.deepEqual(loggedIn, { isAuthenticated: true });
  assert.deepEqual(initial, { isAuthenticated: false });
  assert.deepEqual(authReducer(loggedIn, authActions.login()), loggedIn);

  const loggedOut = authReducer(loggedIn, authActions.logout());
  assert.deepEqual(loggedOut, { isAuthenticated: false });
  assert.deepEqual(loggedIn, { isAuthenticated: true });
  assert.deepEqual(authReducer(loggedOut, authActions.logout()), loggedOut);
});

test("the counter starts at zero and is visible", () => {
  assert.deepEqual(counterReducer(undefined, { type: "test/initialize" }), {
    counter: 0,
    showCounter: true,
  });
});

const counterCases = [
  { name: "increment adds one", start: 5, action: counterActions.increment(), expected: 6 },
  { name: "decrement supports negative values", start: 0, action: counterActions.decrement(), expected: -1 },
  { name: "increase uses the supplied amount", start: 4, action: counterActions.increase(3), expected: 7 },
  { name: "increase accepts a negative amount", start: 2, action: counterActions.increase(-5), expected: -3 },
  { name: "increase by zero preserves the value", start: 7, action: counterActions.increase(0), expected: 7 },
];

for (const { name, start, action, expected } of counterCases) {
  test(`${name} without changing visibility or the previous state`, () => {
    const previous = Object.freeze({ counter: start, showCounter: false });
    const next = counterReducer(previous, action);
    assert.deepEqual(next, { counter: expected, showCounter: false });
    assert.deepEqual(previous, { counter: start, showCounter: false });
  });
}

test("toggling twice restores visibility without losing the counter value", () => {
  const visible = Object.freeze({ counter: 42, showCounter: true });
  const hidden = counterReducer(visible, counterActions.toggleCounter());
  assert.deepEqual(hidden, { counter: 42, showCounter: false });
  assert.deepEqual(counterReducer(hidden, counterActions.toggleCounter()), visible);
  assert.deepEqual(visible, { counter: 42, showCounter: true });
  assert.deepEqual(hidden, { counter: 42, showCounter: false });
});

test("reducers ignore actions belonging to other features", () => {
  const auth = Object.freeze({ isAuthenticated: true });
  const counter = Object.freeze({ counter: 8, showCounter: false });
  assert.equal(authReducer(auth, counterActions.increment()), auth);
  assert.equal(counterReducer(counter, authActions.logout()), counter);
  assert.equal(authReducer(auth, { type: "unknown/action" }), auth);
  assert.equal(counterReducer(counter, { type: "unknown/action" }), counter);
});

test("reset clears the counter while preserving hidden state", () => {
  const previous = Object.freeze({ counter: -8, showCounter: false });
  const next = counterReducer(previous, counterActions.reset());
  assert.deepEqual(next, { counter: 0, showCounter: false });
  assert.equal(previous.counter, -8);
});

for (const invalid of [NaN, Infinity, -Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1, "10", null]) {
  test(`the reducer rejects an invalid amount: ${String(invalid)}`, () => {
    const previous = Object.freeze({ counter: 3, showCounter: true });
    assert.equal(counterReducer(previous, counterActions.increase(invalid)), previous);
  });
}

test("arithmetic stops at safe integer bounds and reset recovers", () => {
  const upper = Object.freeze({ counter: Number.MAX_SAFE_INTEGER, showCounter: true });
  const lower = Object.freeze({ counter: Number.MIN_SAFE_INTEGER, showCounter: false });
  assert.equal(counterReducer(upper, counterActions.increment()), upper);
  assert.equal(counterReducer(upper, counterActions.increase(10)), upper);
  assert.equal(counterReducer(lower, counterActions.decrement()), lower);
  assert.equal(counterReducer(lower, counterActions.increase(-10)), lower);
  assert.equal(counterReducer(upper, counterActions.decrement()).counter, upper.counter - 1);
  assert.equal(counterReducer(lower, counterActions.increment()).counter, lower.counter + 1);
  assert.equal(counterReducer(upper, counterActions.reset()).counter, 0);
});
