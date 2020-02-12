import React, {useState, useEffect,} from 'react';

import { storiesOf } from '@storybook/react';
import useForm from 'react-hook-form';

import {OmniBox} from 'chakra-ui-ext';
import {Flex, Image, Box, Text, Stack} from '@chakra-ui/core';

import { fetchJediOrSith, fetchRick, dogData, years, months} from '../data';

storiesOf('OmniBox', module)
  .addParameters({
    component: OmniBox
  })
  .add('Local select only', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
          options={state.options}
          inputBehavior={'none'}
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
  .add('Remote select only', () =>  {

    const [state, setState] = useState({
      selectedItem: null,
    });

    return (<>
        <OmniBox
          defaultValue={state.selectedItem}
          remoteOptions={() => fetchRick('sanchez')}
          inputBehavior={'none'}
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
  .add('Remote select only w/value', () =>  {

    const [state, setState] = useState({
      selectedItem: {id: 1},
    });

    return (<>
        <OmniBox
          defaultValue={state.selectedItem}
          remoteOptions={() => fetchRick('sanchez')}
          inputBehavior={'none'}
          valueKey={'id'}
          textKey={'name'}
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
  .add('Local startsWith match', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
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
   .add('Local contains match', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
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
   .add('Local disabled w/o value', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          isDisabled={true}
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
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
  .add('Local disabled w/text', () =>  {

    const [state, setState] = useState({
      inputValue: 'Norfolk Spaniel',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          isDisabled={true}
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
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
  .add('Local disabled w/value', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: {value: 1, text: 'American Water Spaniel'},
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          isDisabled={true}
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
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
  .add('Local custom matcher & column display', () =>  {

    const [state, setState] = useState({
      selectedItem: {text: 'May', value: 5},
      options: months,
    });

    return (<>
        <OmniBox
          w={'25em'}
          defaultValue={state.selectedItem}
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
  .add('Local primitive options pre-selected', () =>  {

    const [state, setState] = useState({
      options: years(),
      selectedItem: 1980,
    });

    return (<>
        <OmniBox
          optionFormat='primitive'
          defaultValue={state.selectedItem}
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
  .add('Local primitive w/create', () =>  {

    const [state, setState] = useState({
      options: years(),
      selectedItem: 1980,
    });

    return (<>
        <OmniBox
          optionFormat='primitive'
          defaultValue={state.selectedItem}
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

  .add('Local w/create', () =>  {

    const [state, setState] = useState({
      inputValue: 'soemthing here',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
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
  .add('Local invalid', () =>  {

    const [state, setState] = useState({
      inputValue: '',
      selectedItem: null,
      options: dogData.map((dog,i) => ({text: dog, value: i})),
    });

    return (<>
        <OmniBox
          isInvalid={true}
          defaultText={state.inputValue}
          defaultValue={state.selectedItem}
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
      <OmniBox
        itemFilter='contains'
        placeholder={'search the star wars universe'}
        textKey='name'
        valueKey='name'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
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
      <OmniBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
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
   .add('Remote w/auto-select auto load off', () =>  {

    const [state, setState] = useState({
      inputValue: 'Accountant dog',
      selectedItem: null,
    });

    return (<>
      <OmniBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
        remoteOptions={fetchRick}
        preFetch={false}
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
      <OmniBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
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
   .add('Remote w/create', () =>  {

    const [state, setState] = useState({
      inputValue: 'rick',
      selectedItem: null,
      options: []
    });

    return (<>
      <OmniBox
        placeholder={'pickle rick?'}
        allowCreate={true}
        textKey='name'
        valueKey='id'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
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
      <OmniBox
        placeholder={'pickle rick?'}
        allowCreate={true}
        textKey='name'
        valueKey='id'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
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
      <OmniBox
        placeholder={'pickle rick?'}
        textKey='name'
        valueKey='id'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
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
      <OmniBox
        placeholder={'pickle rick?'}
        allowCreate={true}
        textKey='name'
        valueKey='id'
        defaultText={state.inputValue}
        defaultValue={state.selectedItem}
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