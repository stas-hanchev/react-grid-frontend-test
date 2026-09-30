import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        // Перенаправляє запити типу @mui/icons-material/esm/ExpandLess.js
        find: /^@mui\/icons-material\/esm\/(.*)\.js$/,
        replacement: '@mui/icons-material/$1',
      },
      {
        // Для звичайних /esm/ шляхів
        find: /^@mui\/icons-material\/esm\/(.*)$/,
        replacement: '@mui/icons-material/$1',
      },
    ],
  },
});
