# Architecture

The App Router provides the document, home page, missing-page screen, and error
boundary. The home page creates one Redux store per mounted app and passes it
to the demo through React Redux's Provider. A reload creates a new store; no
session or counter data is persisted.

`src/store/slices` owns authentication and counter state. Components read state
and dispatch actions through the typed hooks in `src/store/redux-hooks.ts`.
Counter operations accept only safe integers and leave state unchanged when
an invalid payload or an overflowing total is supplied. Reset changes only the
number, preserving visibility. Draft mutations are handled immutably by Redux
Toolkit's Immer integration.

Form errors and input values stay local to the component. Credentials never
enter the store or native form serialization. Both the credential-free button
and the sample form activate the same simulated session. This flag is a UI
example, not server authorization; see the [security policy](../.github/SECURITY.md).

After a session transition, focus moves to the new view's heading. The initial
page does not autofocus controls. The skip link targets a focusable main
landmark, counter changes use a live output, and custom-amount errors are
announced without discarding the current counter value.

Shared CSS variables follow the system color scheme. Panels use a two-column
desktop layout and stack on mobile. Component styles stay beside their React
components; there is no UI framework or icon dependency.

Node tests cover reducers, store isolation, server rendering, and interactive
components. Playwright tests use the production standalone server and cover
browser validation, keyboard focus, mobile layouts, navigation, and the
no-JavaScript form policy. Container smoke tests verify the same server in its
restricted Docker runtime. See the [CI/CD guide](ci-cd.md) for delivery details.
