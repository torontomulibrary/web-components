import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'rl-web-components',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'docs',
      strict: true,
    },
    {
      type: 'stats',
      file: 'stats.json',
    },
  ],
  copy: [{ src: '**.*.scss' }],
  preamble: '(C) Ryerson University Library https://library.ryerson.ca - MIT License',
  enableCache: true,
};
