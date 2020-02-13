import React from 'react';
import { Flex, useTheme } from '@chakra-ui/core';

const Mask = ({children, isActive}) => {
  const theme = useTheme();

  if(!isActive) {
    return null;
  }

  return (
    <Flex
      top={0}
      left={0}
      h={'100vh'}
      w={'100vw'}
      position='fixed'
      opacity={0.6}
      backgroundColor='gray.100'
      zIndex={theme.zIndices.overlay + 200}
      justify='center'
      align='center'
    >
      {children}
    </Flex>
  );
};

export default Mask;
