import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.js',
      format: 'es',
      sourcemap: true
    }
  },
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.es5.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }
]