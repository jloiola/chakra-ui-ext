import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import localResolve from 'rollup-plugin-local-resolve';

import pkg from './package.json';

const config = {
  input: 'src/index.js',
  output: [
    {
      file: pkg.browser,
      format: 'umd',
      name: 'Example',
    }
  ],
  external: [
    '@chakra-ui/core',
    'react',
    'react-dom',
  ],
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    localResolve(),
    resolve(),
    commonjs({
      include: 'node_modules/**',
      // left-hand side can be an absolute path, a path
      // relative to the current directory, or the name
      // of a module in node_modules
      namedExports: {
        'node_modules/react/index.js': [
          'cloneElement',
          'createContext',
          'Component',
          'createElement',
          'useCallback',
          'useReducer',
          'useRef',
          'useEffect',
          'forwardRef',
          'useState'
        ],
        'node_modules/react-dom/index.js': ['render', 'hydrate'],
        'node_modules/react-is/index.js': [
          'isElement',
          'isValidElementType',
          'isForwardRef'
        ]
      }
    }),
    filesize(),
  ],
};

export default config;