module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
        node: true, // Add Node.js environment
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh"],
    rules: {
        "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
        ],
        "no-undef": "off", // Turn off no-undef rule for module.exports usage
    },
};
