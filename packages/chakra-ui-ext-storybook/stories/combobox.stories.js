import React, {useState, useEffect} from 'react';
import { storiesOf } from '@storybook/react';
import {ComboBox} from 'chakra-ui-ext';

const fetchJediOrSith = (search='') => {
  return fetch(`https://swapi.co/api/people/?search=${search}`)
    .then(res => res.json())
    .then(({results}) => results)
    .catch(err => console.error(err))
};

const fetchRick = (search='') => {
  return fetch(`https://rickandmortyapi.com/api/character/?name=${search}`)
    .then(res => res.json())
    .then(({results}) => results)
    .catch(err => []);
};


storiesOf('ComboBox', module)
  .addParameters({
    component: ComboBox
  })
  .add('Basic', () =>  {

    const [state, setState] = useState({
      inputValue: '2',
      selectedItem: null,
      options: [
        {text: 'test item 1', value: 1},
        {text: 'test item 2', value: 2},
      ],
    });

    return (<>
        <ComboBox
          defaultInputValue={state.inputValue}
          defaultSelectedItem={state.selectedItem}
          options={state.options}
          onChange={(selectedItem) => (
            setState((state) => ({...state, selectedItem}))
          )}
        />
        <div>
          <pre>
            selected: {JSON.stringify(state.selectedItem, null, 2)}
          </pre>
        </div>
      </>
    );  
  })
  .add('Basic w/create', () =>  {

    const [state, setState] = useState({
      inputValue: '2',
      selectedItem: null,
      options: [
        {text: 'test item 1', value: 1},
        {text: 'test item 2', value: 2},
      ],
    });

    return (<>
        <ComboBox
          defaultInputValue={state.inputValue}
          defaultSelectedItem={state.selectedItem}
          options={state.options}
          allowCreate={true}
          onChange={(selectedItem) => (
            setState((state) => ({...state, selectedItem}))
          )}
        />
        <div>
          <pre>
            selected: {JSON.stringify(state.selectedItem, null, 2)}
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
          selected: {JSON.stringify(state.selectedItem, null, 2)}
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
          selected: {JSON.stringify(state.selectedItem, null, 2)}
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
          selected: {JSON.stringify(state.selectedItem, null, 2)}
        </pre>
      </div>
    </>);
  });     