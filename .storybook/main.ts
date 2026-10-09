import type { StorybookConfig } from '@storybook/vue-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts', '../src/**/*.mdx'],
  addons: ['@storybook/addon-essentials'],
  staticDirs: ['../public'],
  framework: { name: '@storybook/vue-vite', options: {} },
  docs: { autodocs: 'tag' },
  core: { disableTelemetry: true },
};
export default config;
