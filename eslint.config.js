import tailwind from 'eslint-plugin-tailwindcss';

export default [
  ...tailwind.configs['flat/recommended'],
  {
    rules: {
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/classnames-order': 'warn',
    },
  },
];