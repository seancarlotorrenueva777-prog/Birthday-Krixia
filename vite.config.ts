import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        entry: resolve(__dirname, 'index.html'),
        birthday: resolve(__dirname, 'birthday.html'),
      },
    },
  },
});
