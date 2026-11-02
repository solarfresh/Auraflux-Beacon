import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import vueDevTools from 'vite-plugin-vue-devtools'
// import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: '/',
  envDir: resolve(import.meta.dirname, '../../'),
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
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
      '@': resolve(import.meta.dirname, './src'),
      '@auraflux/design-system': resolve(import.meta.dirname, '../../packages/design-system/src'),
      '@auraflux/shared-core': resolve(import.meta.dirname, '../../packages/shared-core/src'),
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
    proxy: {
      // '/s3': {
      //   target: 'http://localhost:5003',
      //   changeOrigin: true,
      //   ws: true,
      // },
    },
    fs: {
      allow: [
        resolve(import.meta.dirname, '../../'),
      ],
    },
  },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});