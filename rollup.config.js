import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify-es';
import autoExternal from 'rollup-plugin-auto-external';

const autoExternalOpts = {
  builtins: true,
  dependencies: false
};

export default [
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.js',
      format: 'es',
    },
    plugins: [
      resolve(),
      autoExternal(autoExternalOpts)
    ]
  },
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.min.js',
      format: 'es',
    },
    plugins: [
      resolve(),
      autoExternal(autoExternalOpts),
      uglify()
    ]
  },
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.cjs.min.js',
      format: 'cjs',
    },
    plugins: [
      resolve(),
      autoExternal(autoExternalOpts),
      uglify()
    ]
  },
  {
    input: 'src/exec.js',
    output: {
      file: 'build/lib-shell.es5.min.js',
      format: 'cjs',
    },
    plugins: [
      resolve(),
      autoExternal(autoExternalOpts),
      babel(),
      uglify()
    ]
  }
]