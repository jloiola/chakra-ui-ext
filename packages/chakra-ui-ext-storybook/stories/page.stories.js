import React, {useState} from 'react';
import {DateTime} from 'luxon';
import { storiesOf } from '@storybook/react';
import {Icon, Box} from '@chakra-ui/core';
import {ResponsivePage, ErrorPage} from 'chakra-ui-ext';

storiesOf('Pages', module)
  .addParameters({})
  .add('Basic page', () =>  {

    const [state, setState] = useState({});

    return (
      <ResponsivePage isBlocked={false}>
        <Box>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Box>
      </ResponsivePage>
    );
  })
   .add('Basic page blocked', () =>  {

    const [state, setState] = useState({});

    return (
      <ResponsivePage isBlocked={true}>
        <Box>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </Box>
      </ResponsivePage>
    );
  })
  .add('Error page', () =>  {
    return (
      <ErrorPage title='User not found' icon={<Icon size='5rem' color='yellow.500' name='warning'/>} />
    );
  });  