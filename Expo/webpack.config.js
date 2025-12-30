const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if( env.mode === 'production'){
    config.output.publicPath = '/fcalc/'; 
    config.plugins.push(
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        // optional tweaks:
        // navigateFallback: '/index.html',
      })
    );
  }// if

  return config;
};
