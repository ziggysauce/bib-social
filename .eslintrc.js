module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'react-app',
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
      },
    ],
    'max-len': ['warn', { code: 120 }],
    curly: ['error', 'all'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  plugins: ['prettier'],
};
