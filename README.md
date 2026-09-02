# React Redux State Demo

[![React](https://img.shields.io/badge/React-TypeScript-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Redux](https://img.shields.io/badge/State-Redux-764ABC?logo=redux&logoColor=white)](https://redux.js.org/)
[![Last commit](https://img.shields.io/github/last-commit/fatmakahveci/react-ts-redux)](https://github.com/fatmakahveci/react-ts-redux/commits/main)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE.md)

A compact Next.js and TypeScript project demonstrating centralized client state with Redux Toolkit and React Redux.

## Highlights

- Redux Toolkit slices for authentication and counter state
- Typed store access from React components
- Provider-based integration with the Next.js client application
- Small, focused components for authentication, profile, header, and counter flows

## Technology

- Next.js
- React
- TypeScript
- Redux Toolkit
- React Redux

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality Checks

```bash
npm run lint
npm run build
```

## Repository Structure

- `src/app/store` — Redux store and feature slices
- `src/app/components` — state-driven UI components
- `src/shared` — shared constants and types

## Project Resources

- [Changelog](CHANGELOG.md)
- [Contributing guide](.github/CONTRIBUTING.md)
- [Security policy](.github/SECURITY.md)
- [License](LICENSE.md)
