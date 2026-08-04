// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from '@storybook/vue3-vite';
import { resolve, dirname } from 'path';
import { mergeConfig, type InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../../../packages/design-system/src/**/*.mdx',
    '../../../packages/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-docs")],
  framework: {
    name: getAbsolutePath("@storybook/vue3-vite"),
    options: {}
  },
  async viteFinal(config: InlineConfig) {
    return mergeConfig(config, {
      plugins: [vue()],

      resolve: {
        alias: {
          '@auraflux/design-system': resolve(__dirname, '../../../packages/design-system/src'),
        },
      },
    });
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}