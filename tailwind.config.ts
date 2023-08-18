import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'base-50': '#f7f7f8',
        'base-100': '#ececf1',
        'base-200': '#d9d9e3',
        'base-300': '#c5c5d2',
        'base-400': '#acacbe',
        'base-500': '#8e8ea0',
        'base-600': '#565869',
        'base-700': '#40414f',
        'base-800': '#343541',
        'base-900': '#202123',
        'base-950': '#050509',
      },
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
    },
  },
  darkMode: ['class'],
  plugins: [],
};
export default config;
