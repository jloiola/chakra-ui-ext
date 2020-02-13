import React, {useState} from 'react';
import {DateTime} from 'luxon';
import { storiesOf } from '@storybook/react';
import {Icon} from '@chakra-ui/core';
import {H1, Card, CardSpinner, CardHeader, CardBody, CardFooter} from 'chakra-ui-ext';

storiesOf('Card', module)
  .addParameters({
    component: Card
  })
  .add('Children mode', () =>  {

    const [state, setState] = useState({});

    return (
      <Card>
        <CardHeader>
          <H1>Lorem Ipsum</H1>
        </CardHeader>

        <CardBody>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </CardBody>

        <CardFooter>
          {DateTime.local().setLocale('es').toLocaleString(DateTime.DATETIME_FULL)}
        </CardFooter>
      </Card>
    );
  })  
  .add('Property mode', () =>  {

    const [state, setState] = useState({});

    return (
      <Card>
        <CardHeader
          leftContent={<H1>Lorem Ipsum</H1>}
          rightContent={<Icon size='1.5rem' color='blue.500' name='plus' />}
        />
          
        <CardBody>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </CardBody>

        <CardFooter 
          leftContent={DateTime.local().setLocale('fr').toLocaleString(DateTime.DATETIME_FULL)}
          rightContent={<Icon size='1.5rem' color='red.500' name='check' />}
        />
      </Card>
    );
  })  
