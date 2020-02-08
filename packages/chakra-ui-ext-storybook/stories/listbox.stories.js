import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import ListBox from 'chakra-ui-ext-listbox';

storiesOf('ListBox', module)
  .addParameters({
    component: ListBox
  })
  .add('Basic', () =>  {

    const [state, setState] = useState({
      inputValue: '2',
      selectedItem: null,
      items: [
        {text: 'test item 1', value: 1},
        {text: 'test item 2', value: 2},
      ],
    });

    return (<>
        <ListBox
          defaultInputValue={state.inputValue}
          defaultSelectedItem={state.selectedItem}
          items={state.items}
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
  });