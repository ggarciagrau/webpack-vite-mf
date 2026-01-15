# Vue 2 (Webpack) + React 19 (Vite) Module Federation

This repository demonstrates a Micro-Frontend architecture using **Module Federation** to integrate a modern **React 19** application (built with Vite) into a legacy **Vue 2** application (built with Vue CLI/Webpack 5).

## Project Structure

*   **`my-vue-app` (Host)**: The main application.
    *   Framework: Vue 2.7
    *   Bundler: Webpack 5 (Vue CLI)
    *   Role: **Host** - Consumes the React remote.
*   **`my-react-app` (Remote)**: The micro-frontend.
    *   Framework: React 19
    *   Bundler: Vite 5
    *   Role: **Remote** - Exposes an App component via `remoteEntry.js`.

## Prerequisites

*   **Node.js**: v20.9.0 (Project is configured for compatibility with this version).
*   **Package Managers**: `yarn` (for Vue) and `pnpm` (for React).

## Setup

1.  **Install Dependencies:**
    Run the setup script from the root directory to install dependencies for both projects:
    ```bash
    npm run setup
    ```
    *This runs `yarn install` in `my-vue-app` and `pnpm install` in `my-react-app`.*

## Running the Application

You need to run both applications simultaneously in separate terminals.

1.  **Start the Vue Host (Vue 2):**
    ```bash
    cd my-vue-app
    yarn serve
    ```
    *Runs on [http://localhost:8080](http://localhost:8080)*

2.  **Start the React Remote (React 19):**
    ```bash
    cd my-react-app
    pnpm preview --port 5001
    ```
    *Runs on [http://localhost:5001](http://localhost:5001)*
    > **Note:** We use `pnpm preview` because `pnpm dev` in Vite is bundle-less and does not generate the necessary `remoteEntry.js` for Webpack to consume.

## Architecture & Integration Details

*   **Federation Strategy**: The Vue app (Webpack) consumes the React app (Vite) using a **Promise-based import** strategy to handle the loading of ESM modules output by Vite.
*   **Styling**:
    *   **CSS Injection**: The React app uses `vite-plugin-css-injected-by-js` to bundle styles into the JavaScript chunks so they load automatically in the host.
    *   **Scoping**: React styles are scoped under a unique ID (`#my-react-app-root`) to prevent bleeding into the Vue host.
*   **Mounting**: The React app exposes a `mount` function (in `src/mount.jsx`) which provides a standard way for the Vue wrapper component (`ReactApp.vue`) to render and unmount the React root.

## Troubleshooting

For a detailed log of issues encountered during development (e.g., Node version mismatches, CORS, CSS bleeding) and their solutions, please refer to:
[docs/troubleshooting_log.md](docs/troubleshooting_log.md)
