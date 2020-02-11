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
      name: 'chakra-ui-ext',
      sourceMap: true,
    }
  ],
  external: [
    '@chakra-ui/core',
    'react',
    'react-dom'
  ],
  plugins: [
    localResolve(),
    resolve(),
    commonjs({
      include: '../../node_modules/**', // FYI aoa gotcha
      namedExports: {
        'react': [
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
        'react-dom': ['render', 'hydrate'],
        'react-is': [
          'isElement',
          'isValidElementType',
          'isForwardRef'
        ]
      }
    }),
    babel({ exclude: '**/node_modules/**', sourceMaps: true}),
    filesize(),
  ],
};

export default config;