const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".expo/**",
      "ios/**",
      "android/**",
      "assets/**",
      "scripts/**",
    ],
  },
  ...expoConfig,
  {
    settings: {
      "import/ignore": ["@expo/vector-icons", "react-native"],
    },
    rules: {
      // @expo/vector-icons is bundled with Expo, ignore unresolved import error
      "import/no-unresolved": ["error", { ignore: ["@expo/vector-icons"] }],
      // Ignore parse errors from react-native internals
      "import/namespace": "off",
    },
  },
];
