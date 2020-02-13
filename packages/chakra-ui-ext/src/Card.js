import React from 'react';
import { Flex, Stack } from "@chakra-ui/core";

const Card = ({children}) => {
  return (
    <Stack p={'1.25rem'} bg='white' border='1px' borderColor='gray.300'>
      {children}
    </Stack>
  );
};

const CardHeader = ({children, leftContent, rightContent, ...props}) => {
  const defaultProps = Object.assign({mb: '0.75rem'}, props)
  return children ? (
    <Flex {...defaultProps}>
      {children}
    </Flex>
  ) : (
    <Flex {...defaultProps} align='center'>
      <Flex>{leftContent}</Flex>
      <Flex flex={1}/>
      <Flex>{rightContent}</Flex>
    </Flex>
  );
};

const CardSpinner = ({children, ...props}) => {
  return (
    <Flex {...props}>
      {children}
    </Flex>
  );
};

const CardBody = ({children, ...props}) => {
  return (
    <Flex {...props}>
      {children}
    </Flex>
  );
};

const CardFooter = ({children, leftContent, rightContent, ...props}) => {
  return children ? (
    <Flex {...props} mt={'0.75rem'}>
      {children}
    </Flex>
  ) : (
    <Flex {...props} mt={'0.75rem'}>
      {leftContent}
      <Flex flex={1}/>
      {rightContent}
    </Flex>
  );
};

export {
  Card,
  CardSpinner,
  CardHeader,
  CardBody,
  CardFooter,
}
