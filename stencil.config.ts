import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'rlwc',
  plugins: [
    sass({
      includePaths: [
        './node_modules',
        './src/global',
      ]
    }),
  ],
  outputTargets: [
    {
      type: 'dist',
      copy: [{ src: '**.*.scss' }],
    },
    {
      type: 'docs-readme',
      strict: true,
    },
  ],
  preamble: '(C) Ryerson University Library https://library.ryerson.ca - MIT License',
  enableCache: true,
};
