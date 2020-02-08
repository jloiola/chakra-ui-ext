import React, {useState, useEffect} from 'react';
import { storiesOf } from '@storybook/react';
import ListBox from 'chakra-ui-ext-listbox';

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


storiesOf('ListBox', module)
  .addParameters({
    component: ListBox
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
        <ListBox
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
   .add('Remote', () =>  {

    const [state, setState] = useState({
      inputValue: 'skywalker',
      selectedItem: null,
      options: []
    });

    return (<>
      <ListBox
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
   .add('Remote auto-select', () =>  {

    const [state, setState] = useState({
      inputValue: 'rick',
      selectedItem: null,
      options: []
    });

    return (<>
      <ListBox
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
  });   