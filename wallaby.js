var compilerOptions = require('./tsconfig.jest.json');
compilerOptions.module = 'CommonJs';
compilerOptions.jsx = 'react';

module.exports = function (wallaby) {
    return {
        files: [
            "src/**/*.ts?(x)",
            "!src/**/*.spec.ts?(x)",
            "package.json"
        ],
        tests: [
            "src/**/*.spec.ts?(x)"
        ],
        env: {
            type: "node",
            runner: "node"
        },
        compilers: {
            'src/**/*.ts?(x)': wallaby.compilers.typeScript(compilerOptions)
        },
        testFramework: "jest",
        debug: true,
        bootstrap: function (wallaby) {
            wallaby.testFramework.configure({
                "globals": {
                    "__TS_CONFIG__": "tsconfig.jest.json"
                },
                "setupTestFrameworkScriptFile": "./test-bundle.js",
                "transformIgnorePatterns": [
                    "<rootDir>/node_modules/(?!react-rx-connect)"
                ],
                "moduleNameMapper": {
                    "^.+\\.(s?css|less)$": "<rootDir>/config/empty-module.js"
                }
            });
        }
    };
};
