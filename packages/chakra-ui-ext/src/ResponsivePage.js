import React, {useEffect} from 'react';
import { Box, Spinner } from '@chakra-ui/core';
import Mask from './Mask';

const PageSpinner = ({}) => (
  <Spinner
    thickness="0.25rem"
    speed="0.65s"
    emptyColor="gray.200"
    color="blue.500"
    size="xl"
  />
);

const ResponsivePage  = ({children, style, isBlocked, Spinner=PageSpinner, ...rest}) => {

  useEffect(() => {
    document.body.style.overlay = isBlocked ? 'hidden': 'auto';
  }, [isBlocked])

  return (<>
    <Mask isActive={isBlocked}>
      <Spinner />
    </Mask>
    <Box
      {...style}
      maxW={[
        '100%', // base
        '100%', // 480px upwards
        '100%', // 768px upwards
        '933px', // 992px upwards
      ]}
      margin={[
        '1rem',
        '1rem',
        '1rem',
        'auto',
      ]}
      fontSize={['md']}
      {...rest}
    >
      {children}
    </Box>
    </>
  );
};

export default ResponsivePage;
