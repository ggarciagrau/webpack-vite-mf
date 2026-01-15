# Module Federation Integration: Problems & Solutions

This document logs the challenges encountered while integrating a React 19 (Vite) remote into a Vue 2 (Webpack 5) host and their solutions.

## 1. Node.js Compability (Vite Version)
**Problem:**
The React 19 template installed Vite 7, which requires Node.js v20.19+ or v22.12+. The environment was running Node.js v20.9.0.
```
Error: Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.
```

**Solution:**
Downgraded `vite` to version `^5.4.0` in `package.json` to ensure compatibility with Node v20.9.0.

## 2. Module Federation Mismatch (Webpack vs Vite)
**Problem:**
Webpack 5 uses `var` variable type by default for federation, while Vite outputs ES Modules (ESM). Webpack cannot natively consume standard Vite remote entries.

**Solution:**
- **Remote (Vite)**: Used `@originjs/vite-plugin-federation` to generate a compatible `remoteEntry.js`.
- **Host (Webpack)**: Configured `ModuleFederationPlugin` to use the `promise` remote type. This tells Webpack to dynamicallly import the ESM remote using a promise.
  ```javascript
  remotes: {
    'my-react-app': 'promise import("http://localhost:5001/assets/remoteEntry.js")',
  }
  ```

## 3. Image Loading (Asset Paths)
**Problem:**
Images in the React app (e.g., logo) were failing to load or showing as broken in the Vue app.
- Relative paths (e.g., `./assets/react.svg`) resolved correctly relative to the script.
- Root-relative paths (e.g., `/vite.svg`) resolved to `localhost:8080/vite.svg` (Vue host) instead of `localhost:5001` (React remote).

**Solution:**
Updated `vite.config.js` to set the `base` URL to the remote's origin. This ensures all assets are requested from the remote server.
```javascript
export default defineConfig({
  base: 'http://localhost:5001/',
  // ...
})
```

## 4. Connection Refused (Server Process)
**Problem:**
The error `net::ERR_CONNECTION_REFUSED` appeared when trying to load the remote entry.
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

**Solution:**
The React preview server process (running on port 5001) had terminated (likely killed with exit code 137). Restarting the server (`pnpm preview --port 5001`) fixed the connection.

## 5. CSS Loading (Injecting Styles)
**Problem:**
React components rendered without styles (e.g., no animations, default button styling). Vite splits CSS into separate files, which the Webpack host does not automatically load when importing the JS module.

**Solution:**
1.  **Correct Import**: Ensured `import './index.css'` was present in the exposed `mount.jsx` entry point.
2.  **Injection Plugin**: Installed `vite-plugin-css-injected-by-js` to bundle CSS content directly into the JavaScript chunks.
3.  **Targeting Chunk**: Configured the plugin to specifically target the exposed app module to ensure the injection code runs when the remote module is loaded.
    ```javascript
    cssInjectedByJs({
      jsAssetsFilterFunction: (outputAsset) => {
        return outputAsset.fileName.includes('expose_App');
      }
    }),
    ```

## 6. CSS Bleeding (Global Styles)
**Problem:**
Remote styles from `index.css` (e.g., `body`, `button`) were affecting the host application because they were defined globally.

**Solution:**
1.  **Wrapper ID**: Wrapped the React app in a unique container ID (`#my-react-app-root`) in `mount.jsx`.
2.  **Scoping Selectors**: Refactored `index.css` to prefix all rules with `#my-react-app-root`, ensuring styles only apply to the remote application.

## 7. Shared Dependencies (React in Host)
**Problem:**
If multiple React micro-frontends are used, each would bundle its own copy of React, leading to duplicate downloads and performance issues.

**Solution:**
We moved the responsibility of providing React to the Vue Host (`my-vue-app`), making it the single source of truth for the shared library.

1.  **Vue Host (`my-vue-app`)**:
    *   Installed `react` and `react-dom` as direct dependencies.
    *   Configured `ModuleFederationPlugin` to share them (`singleton: true`, `eager: true`).

2.  **React Remote (`my-react-app`)**:
    *   Moved `react` and `react-dom` to `peerDependencies` to explicitly declare that it expects the Host to provide them.
    *   Added them to `devDependencies` to ensure local development and builds still function correctly.
    *   This setup prevents React from being bundled inside the remote, significantly reducing the bundle size.
