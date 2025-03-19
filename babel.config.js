module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV', // the environment variable name
        moduleName: '@env', // the module name for importing the env variables
        path: '.env', // path to your .env file
      },
    ],
  ],
};
