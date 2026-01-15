const { defineConfig } = require('@vue/cli-service')
const { ModuleFederationPlugin } = require('webpack').container
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'my-vue-app',
        remotes: {
          'my-react-app': 'promise import("http://localhost:5001/assets/remoteEntry.js")',
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
          },
          'react-dom': {
            singleton: true,
            eager: true,
          }
        }
      }),
    ],
  },
})
