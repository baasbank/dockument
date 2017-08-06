module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "env": {
        "node": true,
        "es6": true,
        "browser": true,
        "mocha": true,
    },
    "rules": {
        "one-var": 0,
        "jsx-a11y/href-no-hash": "off",
        //"jsx-a11y/anchor-is-valid": ["warn", { "aspects": ["invalidHref"] }],
        "one-var-declaration-per-line": 0,
        "new-cap": 0,
        "consistent-return": 0,
        "no-param-reassign": 0,
        "comma-dangle": 0,
        "curly": ["error", "multi-line"],
        "import/no-unresolved": [2, { "commonjs": true }],
        "no-shadow": ["error", { "allow": ["req", "res", "err"] }],
        "valid-jsdoc": ["error", {
            "requireReturn": true,
            "requireReturnType": true,
            "requireParamDescription": false,
            "requireReturnDescription": true
        }],
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": true,
                "ClassDeclaration": true,
                "ArrowFunctionExpression": true
            },
        }],
    }
}