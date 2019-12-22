module.exports = {
  root: true,

  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },

  globals: {
    COMMENT_SERVICE: true,
    IS_NEWSLETTER_ENABLED: true
  },

  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    "prettier/vue",
  ],

  parserOptions: {
    parser: 'babel-eslint' // Support dynamic import
  },

  rules: {
    'no-undef': ['error'],

    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['js', 'vue'],
        shouldMatchCase: false
      }
    ],

    'vue/prop-name-casing': 0,

    'vue/require-default-prop': 0
  },

  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended'
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      rules: {
        '@typescript-eslint/ban-ts-ignore': 0,

        '@typescript-eslint/explicit-function-return-type': 0,

        '@typescript-eslint/no-explicit-any': 0,

        '@typescript-eslint/no-use-before-define': ['error', { functions: false }]
      }
    },
  ]
}
