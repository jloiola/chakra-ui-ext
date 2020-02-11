import React, {useState, useEffect,} from 'react';

import { storiesOf } from '@storybook/react';
import useForm from 'react-hook-form';

import {ComboBox} from 'chakra-ui-ext';
import {Flex, Image, Box, Text, Stack} from '@chakra-ui/core';

import { fetchJediOrSith, fetchRick, dogData, years, months} from '../data';

storiesOf('ComboBox', module)
  .addParameters({
    component: ComboBox
  })
  .add('Basic startsWith match', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          initialText={state.inputValue}
          initialValue={state.selectedItem}
          options={state.options}
          itemFilter='startsWith'
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
   .add('Basic contains match', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          initialText={state.inputValue}
          initialValue={state.selectedItem}
          options={state.options}
          itemFilter='contains'
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
   .add('Basic disabled w/o value', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          isDisabled={true}
          initialText={state.inputValue}
          initialValue={state.selectedItem}
          options={state.options}
          itemFilter='startsWith'
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
  .add('Basic disabled w/text', () =>  {

    const [state, setState] = useState({
      inputValue: 'Norfolk Spaniel',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          isDisabled={true}
          initialText={state.inputValue}
          initialValue={state.selectedItem}
          options={state.options}
          itemFilter='startsWith'
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
  .add('Basic disabled w/value', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: {value: 1, text: 'American Water Spaniel'},
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          isDisabled={true}
          initialText={state.inputValue}
          initialValue={state.selectedItem}
          options={state.options}
          itemFilter='startsWith'
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
  .add('Basic custom matcher & column display', () =>  {

    const [state, setState] = useState({
      selectedItem: {text: 'May', value: 5},
      options: months,
    });

    return (<>
        <ComboBox
          w={'25em'}
          initialValue={state.selectedItem}
          options={state.options}
          itemFilter={(item, inputValue) => (
            item.text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
            item.value === parseInt(inputValue)
          )}
          onChange={(selectedItem) => {
            setState((state) => ({...state, selectedItem}))
          }}
          columns={3}
        />
        <div>
          <pre>
            {JSON.stringify(state.selectedItem, null, 2)}
          </pre>
        </div>
      </>
    );  
  })
  .add('Basic primitive options pre-selected', () =>  {

    const [state, setState] = useState({
      options: years(),
      selectedItem: 1980,
    });

    return (<>
        <ComboBox
          optionsMode='primitive'
          initialValue={state.selectedItem}
          options={state.options}
          onChange={(selectedItem) => {
            setState((state) => ({...state, selectedItem}))
          }}
          columns={4}
          w={'25rem'}
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
      inputValue: 'soemthing here',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          initialText={state.inputValue}
          initialValue={state.selectedItem}
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
  .add('Basic invalid', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <ComboBox
          isInvalid={true}
          initialText={state.inputValue}
          initialValue={state.selectedItem}
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
   .add('Remote', () =>  {

    const [state, setState] = useState({
      inputValue: 'skywalker',
      selectedItem: null
    });

    return (<>
      <ComboBox
        itemFilter='contains'
        placeholder={'search the star wars universe'}
        textKey='name'
        valueKey='name'
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        remoteOptions={fetchJediOrSith}
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
  .add('Remote w/auto-select via text', () =>  {

    const [state, setState] = useState({
      inputValue: 'Accountant dog',
      selectedItem: null,
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        remoteOptions={fetchRick}
        autoSelect={true}
        preFetch={true}        
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
   .add('Remote w/auto-select auto load off', () =>  {

    const [state, setState] = useState({
      inputValue: 'Accountant dog',
      selectedItem: null,
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        remoteOptions={fetchRick}
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
  .add('Remote w/o auto-select via value', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: {
        name: 'Accountant dog',
        id: 398,
      },
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        remoteOptions={fetchRick}
        autoSelect={true}
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
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        preFetch={true}
        remoteOptions={fetchRick}
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
   .add('Remote w/create with iniitial text', () =>  {

    const [state, setState] = useState({
      inputValue: 'rick chez',
      selectedItem: null,
      options: []
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        allowCreate={true}
        textKey='name'
        valueKey='id'
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        remoteOptions={fetchRick}
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
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        remoteOptions={fetchRick}
        onChange={(selectedItem) => {
          setState({...state, selectedItem})
        }}
        itemRender={(item, {isHighlighted}) => (
          <Flex flex={1} direction='center' align='center' bg={isHighlighted && 'black'} color={isHighlighted && 'white'}>
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
  })
   .add('Remote w/custom render & allow create', () =>  {

    const [state, setState] = useState({
      inputValue: 'sanchez',
      selectedItem: null,
    });

    return (<>
      <ComboBox
        placeholder={'pickle rick?'}
        allowCreate={true}
        textKey='name'
        valueKey='id'
        initialText={state.inputValue}
        initialValue={state.selectedItem}
        remoteOptions={fetchRick}
        onChange={(selectedItem) => {
          setState({...state, selectedItem})
        }}
        createRender={(item, {isHighlighted}) => (
          <Flex flex={1} direction='center' align='center' bg={isHighlighted && 'black'} color={isHighlighted && 'white'}>
            <Box flex={1} p={'0.25rem'}>
              Create {item.name}
            </Box>
          </Flex>
        )}
        itemRender={(item, {isHighlighted}) => (
          <Flex flex={1} direction='center' align='center' bg={isHighlighted && 'black'} color={isHighlighted && 'white'}>
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