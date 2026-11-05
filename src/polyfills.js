// react-dropzone-uploader bundles an old regenerator-runtime that assigns to an
// undeclared global `regeneratorRuntime`. In strict-mode ESM that assignment
// throws and it falls back to `Function(...)`, which the CSP blocks
// (no 'unsafe-eval'). Declaring the global up front makes the assignment succeed.
globalThis.regeneratorRuntime = undefined;
