module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "next",
    "next/core-web-vitals",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "sort-destructure-keys",
    "typescript-sort-keys",
  ],
  rules: {
    "@next/next/no-img-element": 0,
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: { delimiter: "comma" },
      overrides: {
        interface: {
          multiline: { delimiter: "semi" },
          singleline: { delimiter: "semi" },
        },
      },
      singleline: { delimiter: "comma" },
    }],
    "@typescript-eslint/no-redeclare": ["error"],
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "_",
      varsIgnorePattern: "_",
    }],
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/semi": ["error"],
    "import/extensions": ["error", {
      json: "always",
      tsx: "never",
    }],
    "import/no-cycle": "off",
    "import/prefer-default-export": 0,
    "jsx-a11y/anchor-is-valid": ["error", {
      aspects: ["invalidHref", "preferButton"],
      components: ["Link"],
      specialLink: ["hrefLeft", "hrefRight"],
    }],
    "lines-between-class-members": 0,
    "max-len": ["error", 140, { ignoreStrings: true }],
    "no-param-reassign": 0,
    "no-redeclare": 0,
    "no-undef": 0,
    "no-unused-expressions": 0,
    "no-unused-vars": 0,
    "no-use-before-define": 0,
    "object-curly-newline": ["error", { consistent: true }],
    quotes: ["error", "double"],
    radix: 0,
    "react/destructuring-assignment": 0,
    "react/function-component-definition": ["error", { namedComponents: "function-declaration" }],
    "react/jsx-filename-extension": [2, { extensions: [".tsx"] }],
    "react/jsx-props-no-spreading": 0,
    "react/jsx-sort-props": [2, { reservedFirst: false }],
    "react/require-default-props": 0,
    "sort-destructure-keys/sort-destructure-keys": ["error"],
    "sort-keys": ["error"],
    "typescript-sort-keys/interface": ["error"],
    "typescript-sort-keys/string-enum": ["error"],
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
