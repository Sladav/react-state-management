{
  "extends": ["tslint-react"]
  "rules": {
    "class-name": true,
    "comment-format": [
      true,
      "check-space"
    ],
    "indent": [
      true,
      "spaces"
    ],
    "one-line": [
      true,
      "check-open-brace",
      "check-whitespace"
    ],
    "no-var-keyword": true,
    "quotemark": [
      true,
      "single",
      "avoid-escape"
    ],
    "semicolon": [
      true,
      "always",
      "ignore-bound-class-methods"
    ],
    "whitespace": [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-module",
      "check-separator",
      "check-type"
    ],
    "typedef-whitespace": [
      true,
      {
        "call-signature": "nospace",
        "index-signature": "nospace",
        "parameter": "nospace",
        "property-declaration": "nospace",
        "variable-declaration": "nospace"
      },
      {
        "call-signature": "onespace",
        "index-signature": "onespace",
        "parameter": "onespace",
        "property-declaration": "onespace",
        "variable-declaration": "onespace"
      }
    ],
    "no-internal-module": true,
    "no-trailing-whitespace": true,
    "no-null-keyword": false,
    "prefer-const": true,
    "jsdoc-format": true,
    "jsx-no-lambda": false,
    "jsx-no-multiline-js": false
  }
}
