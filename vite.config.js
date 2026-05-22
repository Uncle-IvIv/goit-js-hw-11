import { defineConfig } from 'vite';
import { glob } from 'glob'; // допомагає автоматично знаходити html-файли
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src', // Перемикаємо корінь у src, як вимагають умови
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'), // Автоматично знаходить index.html всередині src
      },
      outDir: '../dist', // Готову збірку кладемо назад у корінь проєкту
      emptyOutDir: true, // Очищаємо dist перед кожною новою збіркою
    },
    plugins: [
      injectHTML(), // Тепер плагін працює відносно папки src
      FullReload(['config/routes.rb', 'app/views/**/*']),
    ],
  };
});