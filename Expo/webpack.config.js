const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if( env.mode === 'production')
    config.output.publicPath = '/fcalc/'; 

  return config;
};
