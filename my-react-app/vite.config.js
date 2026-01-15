import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJs({
      jsAssetsFilterFunction: (outputAsset) => {
        return outputAsset.fileName.includes('expose_App');
      }
    }),
    federation({
      name: 'my-react-app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/mount.jsx',
      },
      shared: ['react', 'react-dom'],
    })
  ],
  build: {
    target: 'esnext'
  },
  base: 'http://localhost:5001/'
})
