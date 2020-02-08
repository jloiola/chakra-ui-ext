import React, {useState, useEffect} from 'react';
import { storiesOf } from '@storybook/react';
import ListBox from 'chakra-ui-ext-listbox';

const fetchPeople = (search='') => {
  return fetch(`https://swapi.co/api/people/?search=${search}`)
    .then(res => res.json())
    .then(({results}) => results)
    .catch(err => console.error(err))
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
          onChange={({selectedItem, inputValue}) => (
            setState((state) => ({...state, selectedItem, inputValue}))
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
        textKey='name'
        valueKey='name'
        defaultInputValue={state.inputValue}
        defaultSelectedItem={state.selectedItem}
        options={state.options}
        onFetch={fetchPeople}
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
      inputValue: 'luke skywalker',
      selectedItem: null,
      options: []
    });

    return (<>
      <ListBox
        textKey='name'
        valueKey='name'
        defaultInputValue={state.inputValue}
        defaultSelectedItem={state.selectedItem}
        onFetch={fetchPeople}
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