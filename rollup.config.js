import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [
  resolve(),
  commonjs()
];

export default [
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.js',
      format: 'es',
    },
    plugins
  },
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.cjs.js',
      format: 'cjs',
    },
    plugins
  },
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.es5.js',
      format: 'cjs',
    },
    plugins: plugins.concat([
      babel({
        //exclude: 'node_modules/**'
      })
    ])
  }
]