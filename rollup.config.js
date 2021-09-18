import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    external: ['redis', 'pg'],
    plugins: [nodeResolve()]
  },
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    external: ['redis', 'pg'],
    plugins: [nodeResolve()]
  }
];
