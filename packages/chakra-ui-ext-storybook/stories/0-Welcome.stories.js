import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';
import ListBox from 'chakra-ui-ext-listbox';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = () => <ListBox />;

ToStorybook.story = {
  name: 'to Storybook',
};
