import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'rl-web-components',
  plugins: [
    sass({
      includePaths: ['./node_modules', './src/global']
    }),
  ],
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'docs',
      strict: true,
    },
  ],
  copy: [{ src: '**.*.scss' }],
  preamble: '(C) Ryerson University Library https://library.ryerson.ca - MIT License',
  enableCache: true,
};
