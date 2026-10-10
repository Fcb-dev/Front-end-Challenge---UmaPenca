import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue2';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = 'http://127.0.0.1:' + (env.PORT || '3001');
  return {
    plugins: [vue()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { port: 5173, strictPort: true, proxy: { '/api': apiTarget } },
    preview: { proxy: { '/api': apiTarget } },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
      clearMocks: true,
      setupFiles: ['./tests/setup.ts'],
    },
  };
});
