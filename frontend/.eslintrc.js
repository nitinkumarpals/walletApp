/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    // This UI intentionally renders literal text like `// overview` and copy
    // with apostrophes; these are cosmetic, not bugs — keep them as warnings.
    "react/jsx-no-comment-textnodes": "warn",
    "react/no-unescaped-entities": "warn",
    "import/no-anonymous-default-export": "warn",
  },
};
