import babel from 'rollup-plugin-babel';

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
    plugins: [ babel() ]
  }
]