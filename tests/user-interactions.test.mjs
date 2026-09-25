import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, afterEach, beforeEach, test } from "node:test";
import { JSDOM } from "jsdom";
import "./helpers/register-typescript.mjs";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});
const globals = {
  window: dom.window,
  self: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  IS_REACT_ACT_ENVIRONMENT: true,
};
// Preserve descriptors because Node may expose globals such as navigator as getters.
const originalGlobals = new Map();
for (const [name, value] of Object.entries(globals)) {
  originalGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, value });
}

// React DOM must be loaded after the simulated browser environment is ready.
const require = createRequire(import.meta.url);
const React = require("react");
const { createRoot } = require("react-dom/client");
const { act } = React;
const HomePage = require("../src/app/page.tsx").default;
let container;
let root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(React.createElement(HomePage)));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

after(() => {
  dom.window.close();
  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
});

const button = (label) => {
  const result = [...container.querySelectorAll("button")].find(
    (element) => element.textContent.trim() === label,
  );
  assert.ok(result, `Expected a button labelled ${label}`);
  return result;
};
// Native clicks exercise HTML form validation before React receives submit.
const click = (label) => act(() => button(label).click());
const value = () => container.querySelector("output").textContent;
const fillCredentials = (email = "demo@example.com", password = "demo-password") => {
  container.querySelector("#email").value = email;
  container.querySelector("#password").value = password;
};
const login = () => {
  fillCredentials();
  click("Login");
};

const invalidCredentials = [
  { name: "an empty form", email: "", password: "" },
  { name: "a missing email", email: "", password: "demo-password" },
  { name: "a malformed email", email: "invalid-email", password: "demo-password" },
  { name: "a missing password", email: "demo@example.com", password: "" },
];

for (const { name, email, password } of invalidCredentials) {
  test(`form validation blocks ${name} without changing login state`, () => {
    const form = container.querySelector("#demo-login-form");
    let submissions = 0;
    form.addEventListener("submit", () => submissions++);
    fillCredentials(email, password);
    click("Login");
    assert.equal(submissions, 0);
    assert.equal(container.querySelector("#demo-login-form"), form);
    assert.equal(container.querySelector("#profile-title"), null);
    assert.equal(container.querySelector("nav"), null);
    assert.equal(value(), "0");
  });
}

test("login prevents form navigation; logout removes the profile and clears credentials", () => {
  let submission;
  container.querySelector("#demo-login-form").addEventListener("submit", (event) => {
    submission = event;
  });
  login();
  assert.ok(submission);
  assert.equal(submission.defaultPrevented, true);
  assert.equal(container.querySelector("#demo-login-form"), null);
  assert.equal(container.querySelector("#profile-title").textContent, "My User Profile");
  assert.equal(container.querySelector("nav a").getAttribute("href"), "/");

  click("Logout");
  assert.equal(container.querySelector("#profile-title"), null);
  assert.equal(container.querySelector("nav"), null);
  assert.equal(container.querySelector("#email").value, "");
  assert.equal(container.querySelector("#password").value, "");
});

test("submitting the form directly logs in without a button click", () => {
  fillCredentials();
  const form = container.querySelector("#demo-login-form");
  act(() => form.requestSubmit());
  assert.equal(container.querySelector("#demo-login-form"), null);
  assert.ok(container.querySelector("#profile-title"));
  assert.ok(button("Logout"));
});

test("form labels identify their inputs and the counter exposes live updates", () => {
  for (const [labelText, type] of [["Email", "email"], ["Password", "password"]]) {
    const label = [...container.querySelectorAll("label")].find(
      (element) => element.textContent.trim() === labelText,
    );
    assert.ok(label, `Expected a visible label for ${labelText}`);
    assert.ok(label.control, `${labelText} must be associated with its input`);
    assert.equal(label.control.type, type);
  }
  const output = container.querySelector("output");
  assert.equal(output.getAttribute("aria-label"), "Counter value");
  assert.equal(output.getAttribute("aria-live"), "polite");
  const controlledRegion = document.getElementById(
    button("Hide Counter").getAttribute("aria-controls"),
  );
  assert.ok(controlledRegion?.contains(output));
});

test("counter buttons update values and keep hidden counter state", () => {
  assert.equal(value(), "0");
  click("Increment");
  assert.equal(value(), "1");
  click("Increase by 10");
  assert.equal(value(), "11");
  click("Decrement");
  assert.equal(value(), "10");

  click("Hide Counter");
  assert.equal(container.querySelector("#counter-value").hidden, true);
  assert.equal(button("Show Counter").getAttribute("aria-expanded"), "false");
  click("Increment");
  click("Show Counter");
  assert.equal(container.querySelector("#counter-value").hidden, false);
  assert.equal(button("Hide Counter").getAttribute("aria-expanded"), "true");
  assert.equal(value(), "11");
});

test("login, logout and rerendering preserve the counter value and hidden state", () => {
  click("Increase by 10");
  click("Hide Counter");
  login();
  assert.equal(value(), "10");
  assert.equal(container.querySelector("#counter-value").hidden, true);
  act(() => root.render(React.createElement(HomePage)));
  assert.ok(container.querySelector("#profile-title"));
  assert.equal(value(), "10");
  assert.equal(container.querySelector("#counter-value").hidden, true);
  click("Logout");
  assert.equal(value(), "10");
  assert.equal(container.querySelector("#counter-value").hidden, true);
  click("Show Counter");
  assert.equal(container.querySelector("#counter-value").hidden, false);
  assert.equal(value(), "10");
});

test("a fresh application mount starts with a fresh login and counter state", () => {
  login();
  click("Increment");
  click("Hide Counter");
  act(() => root.unmount());
  root = createRoot(container);
  act(() => root.render(React.createElement(HomePage)));
  assert.ok(container.querySelector("#demo-login-form"));
  assert.equal(container.querySelector("#profile-title"), null);
  assert.equal(value(), "0");
  assert.equal(container.querySelector("#counter-value").hidden, false);
});

test("credential-free entry and logout focus the newly displayed heading", () => {
  assert.notEqual(document.activeElement, container.querySelector("#login-title"));
  click("Try demo without credentials");
  assert.equal(document.activeElement, container.querySelector("#profile-title"));
  click("Logout");
  assert.equal(document.activeElement, container.querySelector("#login-title"));
  assert.equal(container.querySelector("#email").value, "");
});

test("custom adjustments, native validation, and reset retain counter visibility", () => {
  const amount = container.querySelector("#counter-amount");
  for (const invalid of ["", "1.5"]) {
    amount.value = invalid;
    click("Apply amount");
    assert.equal(value(), "0");
  }
  amount.value = "-4";
  click("Apply amount");
  assert.equal(value(), "-4");
  click("Hide Counter");
  click("Reset Counter");
  assert.equal(value(), "0");
  assert.equal(container.querySelector("#counter-value").hidden, true);
  assert.equal(button("Reset Counter").disabled, true);
});

test("overflow announces an actionable error without corrupting the counter", () => {
  const amount = container.querySelector("#counter-amount");
  amount.value = String(Number.MAX_SAFE_INTEGER);
  click("Apply amount");
  assert.equal(button("Increment").disabled, true);
  amount.value = "1";
  click("Apply amount");
  assert.equal(value(), String(Number.MAX_SAFE_INTEGER));
  assert.equal(amount.getAttribute("aria-invalid"), "true");
  assert.equal(document.activeElement, amount);
  assert.match(container.querySelector("[role='alert']").textContent, /safe range/);
  click("Reset Counter");
  assert.equal(container.querySelector("[role='alert']").textContent, "");
  assert.equal(button("Increment").disabled, false);
});

test("error recovery focuses its heading and invokes retry without showing error details", () => {
  const ErrorPage = require("../src/app/error.tsx").default;
  let retries = 0;
  act(() => root.render(React.createElement(ErrorPage, {
    retry: () => retries++,
    error: new Error("private-error-detail"),
  })));
  assert.equal(document.activeElement, container.querySelector("h1"));
  assert.doesNotMatch(container.textContent, /private-error-detail/);
  click("Try again");
  assert.equal(retries, 1);
});
