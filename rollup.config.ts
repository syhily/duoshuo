import { builtinModules } from 'node:module';
import { extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { glob } from 'glob';
import type { RollupOptions } from 'rollup';

// Clean the local dist directory.
export default {
  input: Object.fromEntries(
    glob
      .sync(['server.ts', 'api/**/*.ts', 'models/**/*.ts', 'services/**/*.ts', 'utils/**/*.ts'], {
        ignore: ['**/*.d.ts', '**/*.test.ts'],
      })
      .map((file) => [
        file.slice(0, file.length - extname(file).length),
        fileURLToPath(new URL(file, import.meta.url)),
      ]),
  ),
  output: {
    dir: 'dist', // set to 'dist' for separating it with the frontend build directory.
    format: 'esm',
    sourcemap: false,
    preserveModules: true,
    preserveModulesRoot: '.',
  },
  external(id: string) {
    return id.includes(`${sep}node_modules${sep}`);
  },
  plugins: [
    typescript({ moduleResolution: 'bundler', tsconfig: 'tsconfig.json' }),
    resolve({ preferBuiltins: true }),
    commonjs({ ignoreDynamicRequires: true, ignore: builtinModules }),
  ],
} satisfies RollupOptions;
