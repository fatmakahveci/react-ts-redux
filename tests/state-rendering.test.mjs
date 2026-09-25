import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import "./helpers/register-typescript.mjs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);

const { makeStore } = require("../src/store/store.ts");
const { authActions } = require("../src/store/slices/auth-slice.ts");
const { counterActions } = require("../src/store/slices/counter-slice.ts");
const StateDemo = require("../src/components/state-demo.tsx").default;
const HomePage = require("../src/app/page.tsx").default;
const RootLayout = require("../src/app/layout.tsx").default;

const render = (store) => renderToStaticMarkup(
  React.createElement(Provider, { store }, React.createElement(StateDemo)),
);

test("login and logout switch the form, profile and navigation", () => {
  const store = makeStore();
  let html = render(store);
  assert.match(html, /id="demo-login-form"/);
  assert.doesNotMatch(html, /My User Profile|Logout/);

  store.dispatch(authActions.login());
  html = render(store);
  assert.doesNotMatch(html, /id="demo-login-form"/);
  assert.match(html, /My User Profile/);
  assert.match(html, /Logout/);

  store.dispatch(authActions.logout());
  html = render(store);
  assert.match(html, /id="demo-login-form"/);
  assert.doesNotMatch(html, /My User Profile|Logout/);
});

test("counter actions update the displayed value and toggling preserves it", () => {
  const store = makeStore();
  store.dispatch(counterActions.increment());
  store.dispatch(counterActions.increase(10));
  store.dispatch(counterActions.decrement());
  assert.equal(store.getState().counter.counter, 10);
  assert.match(render(store), /<output[^>]*>10<\/output>/);

  store.dispatch(counterActions.toggleCounter());
  assert.match(render(store), /id="counter-value" hidden=""/);
  assert.match(render(store), /aria-expanded="false"/);
  assert.equal(store.getState().counter.counter, 10);
  store.dispatch(counterActions.toggleCounter());
  assert.match(render(store), /<output[^>]*>10<\/output>/);
});

test("the page provides Redux state to its application", () => {
  const html = renderToStaticMarkup(React.createElement(HomePage));
  assert.match(html, /id="demo-login-form"/);
  assert.match(html, /<output[^>]*>0<\/output>/);
  assert.doesNotMatch(html, /My User Profile/);
});

test("the unhydrated demo form never serializes entered credentials", () => {
  const dom = new JSDOM(render(makeStore()));
  try {
    const document = dom.window.document;
    document.querySelector("#email").value = "demo@example.com";
    document.querySelector("#password").value = "fictitious-demo-password";
    const form = document.querySelector("#demo-login-form");
    assert.equal(form.checkValidity(), true);
    // Native form serialization also runs before React attaches its handlers.
    assert.deepEqual([...new dom.window.FormData(form)], []);
  } finally {
    dom.window.close();
  }
});

test("the skip link targets the single main landmark in the rendered page", () => {
  const html = renderToStaticMarkup(
    React.createElement(RootLayout, null, React.createElement(HomePage)),
  );
  const dom = new JSDOM(html);
  try {
    const document = dom.window.document;
    assert.equal(document.querySelectorAll("main").length, 1);
    assert.equal(document.querySelectorAll("h1").length, 1);
    const skipLink = document.querySelector("a[href^='#']");
    assert.ok(skipLink);
    const target = document.getElementById(skipLink.hash.slice(1));
    assert.equal(target, document.querySelector("main"));
    assert.ok(target.querySelector("#demo-login-form"));
    assert.ok(target.querySelector("output"));
  } finally {
    dom.window.close();
  }
});
