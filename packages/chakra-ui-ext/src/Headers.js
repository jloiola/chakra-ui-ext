import React from 'react';
import { Heading } from "@chakra-ui/core";

const H1 = ({children}) => {
  return (<Heading as='h1' size='lg'>{children}</Heading>);
};
const H2 = ({children}) => {
  return (<Heading as='h2' size='md'>{children}</Heading>);
};
const H3 = ({children}) => {
  return (<Heading as='h3' size='sm'>{children}</Heading>);
};

export {
  H1,
  H2,
  H3,
}
