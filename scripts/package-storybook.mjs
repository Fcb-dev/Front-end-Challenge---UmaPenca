import { cp } from 'node:fs/promises';
await cp(
  new URL('../storybook-static/', import.meta.url),
  new URL('../dist/storybook/', import.meta.url),
  { recursive: true },
);
console.log('Storybook incluído em dist/storybook.');
