import React, {useState, useEffect} from 'react';
import { storiesOf } from '@storybook/react';
import { fetchJediOrSith, fetchRick, dogData} from '../data';

import {ComboBox} from 'chakra-ui-ext';
import {Flex, Image, Box, Text, Stack} from '@chakra-ui/core'

storiesOf('ComboBox', module)
  .addParameters({
    component: ComboBox
  })
  .add('Basic', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          defaultInputValue={state.inputValue}
          defaultSelectedItem={state.selectedItem}
          options={state.options}
          onChange={(selectedItem) => {
            setState((state) => ({...state, selectedItem}))
          }}
        />
        <div>
          <pre>
            {JSON.stringify(state.selectedItem, null, 2)}
          </pre>
        </div>
      </>
    );  
  })
  .add('Basic w/create', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          defaultInputValue={state.inputValue}
          defaultSelectedItem={state.selectedItem}
          options={state.options}
          allowCreate={true}
          onChange={(selectedItem) => {
            setState((state) => ({...state, selectedItem}))
          }}
        />
        <div>
          <pre>
            {JSON.stringify(state.selectedItem, null, 2)}
          </pre>
        </div>
      </>
    );  
  })  
   .add('Remote', () =>  {

    const [state, setState] = useState({
      inputValue: 'skywalker',
      selectedItem: null,
      options: []
    });

    return (<>
      <ComboBox
        placeholder={'search the star wars universe'}
        textKey='name'
        valueKey='name'
        defaultInputValue={state.inputValue}
        defaultSelectedItem={state.selectedItem}
        options={state.options}
        onFetch={fetchJediOrSith}
        onChange={(selectedItem) => {
          setState({...state, selectedItem})
        }}
        onInput={async (inputValue) => {
          console.log(inputValue)
        }}

      />
      <div>
        <pre>
          {JSON.stringify(state.selectedItem, null, 2)}
        </pre>
      </div>
    </>);
  })
   .add('Remote w/auto-select', () =>  {

    const [state, setState] = useState({
      inputValue: 'Rick sanchez',
      selectedItem: null,
      options: []
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        defaultInputValue={state.inputValue}
        defaultSelectedItem={state.selectedItem}
        onFetch={fetchRick}
        onChange={(selectedItem) => {
          setState({...state, selectedItem})
        }}
      />
      <div>
        <pre>
          {JSON.stringify(state.selectedItem, null, 2)}
        </pre>
      </div>
    </>);
  })
   .add('Remote w/create', () =>  {

    const [state, setState] = useState({
      inputValue: 'rick',
      selectedItem: null,
      options: []
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        allowCreate={true}
        textKey='name'
        valueKey='id'
        defaultInputValue={state.inputValue}
        defaultSelectedItem={state.selectedItem}
        onFetch={fetchRick}
        onChange={(selectedItem) => {
          setState({...state, selectedItem})
        }}
      />
      <div>
        <pre>
          {JSON.stringify(state.selectedItem, null, 2)}
        </pre>
      </div>
    </>);
  })
   .add('Remote w/custom render', () =>  {

    const [state, setState] = useState({
      inputValue: 'sanchez',
      selectedItem: null,
      options: []
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        defaultInputValue={state.inputValue}
        defaultSelectedItem={state.selectedItem}
        onFetch={fetchRick}
        onChange={(selectedItem) => {
          setState({...state, selectedItem})
        }}
        itemRender={(item, {isHighlighted}) => (
          <Flex direction='center' align='center' bg={isHighlighted && 'black'} color={isHighlighted && 'white'}>
            <Box p={'0.25rem'}>
              <Image
                border='1px'
                borderColor='gray.300'
                src={item.image}
                htmlWidth={40}
                htmlHeight={40}
                h={'40px'}
                objectFit='contain'
                bg={'gray.300'}
              />
            </Box>
            <Box flex={1} p={'0.25rem'}>
              {item.name}<br/>
              {item.status}<br/>
            </Box>
          </Flex>
        )}
      />
      <div>
        <pre>
          {JSON.stringify(state.selectedItem, null, 2)}
        </pre>
      </div>
    </>);
  });  