import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';

import React, {useEffect} from 'react';
import { CSSReset, ThemeProvider, theme, Box } from '@chakra-ui/core';

const ChakraWrapper = (storyFn) => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Box p={5}>
        {storyFn()}
      </Box>
    </ThemeProvider>
  );
};

addDecorator(ChakraWrapper);

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module);