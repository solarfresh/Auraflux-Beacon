import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
// import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    /*
    federation({
      name: 'app_consultant',
      filename: 'remoteEntry.js',
      exposes: {
        './EmbeddedModule': './src/views/5-pages/ConsultantEmbeddedModule.vue',
      },
      shared: ['vue', 'vue-router', 'pinia', '@your-org/design-system']
    })
    */
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@auraflux/design-system': resolve(__dirname, '../../packages/design-system/src/index.ts'),
      '@auraflux/shared-core': resolve(__dirname, '../../packages/shared-core/src/index.ts'),
    },
  },

  server: {
    // Set to '0.0.0.0' to allow access from any IP address, including outside the container
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 5173 // If using volume mounting, you might need to set clientPort
    },
    cors: true,
  },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});