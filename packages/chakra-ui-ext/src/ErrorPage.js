import React from 'react';
import { Flex, Box } from '@chakra-ui/core';

import {H1} from './Headers';
import ResponsivePage from './ResponsivePage';

const ErrorPage  = ({title, icon}) => {
  return (
    <ResponsivePage maxW={['100%','100%','100%','100%']}>
      <Flex direction='column' h={'100vh'} align='center' justify='center'>
        <H1>{title}</H1>
        <Box mt='1.5rem'>{icon}</Box>
      </Flex>
    </ResponsivePage>
  );
};

export default ErrorPage;
