import { builtinModules } from 'node:module';
import { extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { glob } from 'glob';
import type { RollupOptions } from 'rollup';
import { cleandir } from 'rollup-plugin-cleandir';
import copy from 'rollup-plugin-copy';

// Clean the local dist directory and transform the TS into js.
// The js didn't get translated and copied into the dist directory, everything should be in TS.
// TSX isn't supported in the meantime.
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
    cleandir('./dist'),
    typescript({ moduleResolution: 'bundler', tsconfig: 'tsconfig.json' }),
    resolve({ preferBuiltins: true }),
    commonjs({ ignoreDynamicRequires: true, ignore: builtinModules }),
    copy({ targets: [{ src: 'models/migration/**/*', dest: 'dist/models/migration' }] }),
  ],
} satisfies RollupOptions;
