// vite.config.js

import { defineConfig } from 'vite';
import withMT from '@material-tailwind/react/utils/withMT';

export default defineConfig(
  withMT({
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
      "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
      "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  })
);
