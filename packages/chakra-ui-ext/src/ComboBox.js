import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {useCombobox} from 'downshift';
import {useDebouncedCallback} from 'use-debounce';

import {Spinner, Input, InputGroup, InputRightElement, Icon, useTheme, PseudoBox, Box } from '@chakra-ui/core';
import {useCombinedRefs} from './combined-refs';

const ComboBox = forwardRef(({
  optionType='object',
  itemFilter='startsWith',
  initialText='',
  initialValue=null,
  valueKey='value',
  textKey='text',
  createdKey='isCreated',
  placeholder,
  isInvalid=false,
  isDisabled=false,
  options=[],
  remoteOptions,
  allowCreate=false,
  preFetch=true,
  onFocus=() => {},
  onBlur=() => {},
  onInput=()=>{},
  onChange=() => {},
  createRender,
  itemRender,
  debounceMs=333,
  columns=1,
  ...rest
}, ref) => {

  const modeSelect = (mode) => {
    switch (mode) {
      case 'primitive':
        return {
          setCreatedItem: ({text}) => (text),
          isCreatedItem: (selectedItem, {items}) => {
            return selectedItem && !items.find(item => selectedItem === item);
          },
          hasText: ({selectedItem, inputValue=''}) => (
            selectedItem !== undefined || inputValue.trim().length
          ),          
          hasValue: (selectedItem) => (
            selectedItem !== undefined && selectedItem !== null
          ),
          findSelected: (items, {inputValue}) => (
            items.find((item) => (
              inputValue && inputValue.toString().trim() === item.toString().trim()
            ))
          ),
          isSelected: (item, selectedItem, {valueKey}) => (item === selectedItem),
          getSelectedItem: (item) => {
            return (item === undefined || item === null) ? null : item;
          },
          getSelectedText: (item) => {
            return (item === undefined || item === null) ? '' : item.toString();
          },
          getSelectedValue: (item) => {
            return (item === undefined || item === null) ? undefined : item.toString();
          },
          matchers: {
            exact: (item, inputValue) => (
              item.toString().toLowerCase() === inputValue.toString().toLowerCase()
            ),            
            contains: (item, inputValue) => (
              item.toString().toLowerCase().indexOf(inputValue.toString().toLowerCase()) >= 0
            ),
            startsWith: (item, inputValue) => (
              item.toString().toLowerCase().indexOf(inputValue.toString().toLowerCase()) === 0
            )
          },
          renderers: {
            item: (item, {isHighlighted, columns}) => (
              <div style={{padding: '0.5rem', textAlign: columns > 1 && 'center'}}>
                {item}
              </div>
            ),
            create: (item, {isHighlighted, columns}) => (
              <div style={{padding: '0.5rem'}}>
               `{item}`
              </div>
            ),
          }
        };
      break;
      case 'object':
      default:
        return {
          setCreatedItem: ({text, textKey, valueKey, createdKey}) => (
            {[createdKey]: true, [textKey]: text, [valueKey]: undefined }
          ),          
          isCreatedItem: (item, {createdKey}) => {
            return item && item[createdKey] === true;
          },
          hasText: ({selectedItem, inputValue='', textKey}) => (
            selectedItem && (selectedItem[textKey] !== undefined && selectedItem[textKey] !== null) ||
            inputValue.trim().length > 0
          ),
          hasValue: (selectedItem) => (
            selectedItem && (selectedItem[valueKey] !== undefined && selectedItem[valueKey] !== null)
          ),
          findSelected: (items, {inputValue, selectedItem, valueKey, textKey}) => {
            const valueFound = items.find((item) => {
              return selectedItem && selectedItem[valueKey].toString() === item[valueKey].toString();
            });

            const textFound = items.find((item) => {
              return inputValue
                && inputValue.toString().toLowerCase().trim() === item[textKey].toString().toLowerCase().trim()
            });

            return valueFound !== undefined ? valueFound : textFound;
          },
          isSelected: (item, selectedItem, {valueKey}) => (
            selectedItem && (selectedItem[valueKey] === item[valueKey])
          ),
          getSelectedItem: (item) => {
            return (item === undefined || item === null) ? null : item;
          },
          getSelectedText: (item) => {
            return !(item && item[textKey]) ? '' : item[textKey].toString();
          },
          getSelectedValue: (item) => {
            return (item === undefined || item === null) ? undefined : item[valueKey].toString();
          },
          matchers: {
            exact: (item, inputValue) => (
              item && item[textKey].toString().toLowerCase() === inputValue.toString().toLowerCase()
            ),
            contains: (item, inputValue) => (
              item && item[textKey].toString().toLowerCase().indexOf(inputValue.toString().toLowerCase()) >= 0
            ),
            startsWith: (item, inputValue) => (
              item && item[textKey].toString().toLowerCase().indexOf(inputValue.toString().toLowerCase()) === 0
            )
          },
          renderers: {
            item: (item, {isHighlighted, columns, textKey}) => (
              <div style={{padding: '0.5rem', textAlign: columns > 1 && 'center'}}>
                {item[textKey]}
              </div>
            ),
            create: (item, {isHighlighted, columns, textKey}) => (
              <div style={{padding: '0.5rem'}}>create `{item[textKey]}`</div>
            ),
          }          
        };
      break;
    }
  };  

  const {
    hasValue, findSelected, isSelected, isCreatedItem,
    getSelectedText, getSelectedItem, matchers, renderers,
    setCreatedItem, hasText, getSelectedValue
  } = modeSelect(optionType);

  itemRender = itemRender ? itemRender : renderers.item;
  createRender = createRender ? createRender : renderers.create;

  const filterMatcher = typeof itemFilter === 'function' ? itemFilter : matchers[itemFilter];
  const stateReducer = (state, {changes, props, type}) => {
    
    switch (type) {
      case useCombobox.stateChangeTypes.FunctionSelectItem:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:        
      case useCombobox.stateChangeTypes.ItemClick:
        const text = getSelectedText(changes.selectedItem);
        const inputValue = text ? text : changes.inputValue;
        return {...changes, inputValue};
      case useCombobox.stateChangeTypes.InputChange:
      case useCombobox.stateChangeTypes.FunctionSetInputValue:
        const highlightedIndex = props.items.findIndex((item) => (filterMatcher(item, changes.inputValue));
        const selectedItem =  getSelectedText(changes.selectedItem) !== inputValue ? null : changes.selectedItem;
        return {...changes, highlightedIndex, selectedItem};
      // disable Esc by passing the current state aka no changes
      case useCombobox.stateChangeTypes.InputKeyDownEscape:
        return {...state, isOpen: false};
      default:
        return changes
    }
  };

  const showMenu = (isOpen, isLoading, items) => (
    isOpen && !isLoading && items && items.length > 0
  );

  const [everLoaded, setEverLoaded] = useState(false);
  const [_autoSelect, setAutoSelect] = useState(true);
  const [_preFetch, setPreFetch] = useState(preFetch);
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState(options);

  const [debouncedCallback] = useDebouncedCallback(async (inputValue) => {
    await remoteData(remoteOptions, {inputValue, selectedItem, valueKey, textKey})
  }, debounceMs);

  const theme = useTheme();

  const {
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    isOpen,
    openMenu,
    closeMenu,
    inputValue,
    setInputValue,
    selectItem,
    selectedItem,
    setHighlightedIndex,
    highlightedIndex,
  } = useCombobox({
    stateReducer,
    items,
    itemToString: (item) => {
      getSelectedText(item)
    },
    onInputValueChange: async ({selectedItem, inputValue}) => {
      const item = getSelectedItem(selectedItem);

      // if an item is set dont re-fetch unless its on the first load
      // and preFetch is set
      if(remoteOptions && !_preFetch ) {
        setPreFetch(false);
        return;
      }

      if(remoteOptions && (!item || (item && !_autoSelect))) {
        debouncedCallback(inputValue.trim())
      }
      // if local options
      if(!remoteOptions && allowCreate && !item && inputValue.trim()) {
        setItems([
          setCreatedItem({text: inputValue, textKey, valueKey, createdKey}),
          ...options,
        ])
      }

      onInput(inputValue);
    },
    onSelectedItemChange: ({selectedItem}) => {

      const item = getSelectedItem(selectedItem);

      // the item is was selected remove the create option
      if(item && !isCreatedItem(item, {items, createdKey})) {
        if(allowCreate && items.length && items[0][createdKey]) {
          items.shift();
        }
      }
      
      onChange(selectedItem);
    },
  });

  const remoteData = async (fetchFunction, {inputValue, selectedItem, valueKey, textKey}) => {
    try {
      if(!everLoaded) {
        setEverLoaded(true);
      }

      setLoading(true);

      const items = await fetchFunction(inputValue);
      const found = findSelected(items, {selectedItem, inputValue, valueKey, textKey})

      if(allowCreate && !found && inputValue.toString().trim()) {
        items.unshift({
          [createdKey]: true,
          [textKey]: inputValue,
        });
      }

      setItems(items)

      if(_autoSelect) {
        setAutoSelect(false);
        selectItem(found);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  };  

  useEffect(() => {
    
    let text = initialText.toString().trim();
    const item = getSelectedItem(initialValue);

    if(hasValue(item)) {
      selectItem(item);
    }

    if(item) {
      text = getSelectedText(item)
    }

    if(text) {
      setInputValue(text)
    }

    if(!remoteOptions) {
      // for now remote options sets after it loads to delay menu opening
      if(allowCreate && !item && text) {
        setItems([
          setCreatedItem({text, textKey, valueKey, createdKey}),
          ...options,
        ])
      }
      // the create item is not yet set here;
      const found = findSelected(items, {selectedItem: item, inputValue: text, valueKey, textKey});

      if(_autoSelect) {
        setAutoSelect(false);
        selectItem(found);
      }
    }

  }, []);

  const {inputRef, ...inputProps} = getInputProps({
    refKey: 'inputRef',
    onFocus: async (e) => {
      onFocus();
      if(!everLoaded && remoteOptions) {
        await remoteData(remoteOptions, {inputValue, selectedItem, valueKey, textKey})
      }
    },
    onClick: () => {
      openMenu();
    },
  });
  
  const {comboBoxRef, ...comboBoxProps} = getComboboxProps({refKey: 'comboBoxRef'});
  const combinedRef = useCombinedRefs(ref, comboBoxRef, inputRef);

  return (
    <PseudoBox w='100%' position='relative' backgroundColor='white' {...rest}>
      <InputGroup w='100%' position='relative' {...comboBoxProps}>
        <Input
          ref={combinedRef}
          {...inputProps}
          placeholder={placeholder}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
        />

        <InputRightElement
          style={{
            justifyContent: 'flex-end',
            marginRight: '0.25rem'
          }}
        >
          {(hasValue(selectedItem) || isCreatedItem(selectedItem, {items, createdKey}))
            && !isLoading && (
            <Box
              w={'1.25rem'}
              fontSize={'0.625rem'}
              onClick={(e)=> {
                if(isDisabled) {
                  return;
                }
                setInputValue('')
                selectItem(null);
                openMenu();
                inputRef.current && inputRef.current.focus()
              }}
              >
                <Icon name='close' />
            </Box>
          )}

          {!isLoading && (
            <Box
              w={'1.5rem'}
              fontSize={'1.25rem'}
              {...getToggleButtonProps({
                onClick: (e) => {
                  if(isDisabled) {
                    // TODO blur the caret focus
                    e.nativeEvent.preventDownshiftDefault = true
                    return;
                  }
                }
              })}
            >
              <Icon name='chevron-down' />
            </Box>
          )}

          {isLoading && (
            <Box
              w={'1rem'}
              mr={'0.25rem'}
              mt={'0.25rem'}
              {...getToggleButtonProps()}
            >
              <Spinner w={'0.75rem'} h={'0.75rem'} />
            </Box>
          )}
        </InputRightElement>

      </InputGroup>

      {showMenu(isOpen, isLoading, items) && (
        <div {...getMenuProps()} style={{
            zIndex: theme.zIndices.overlay,
            position: 'absolute',
            backgroundColor: 'white',
            border: `1px solid ${theme.colors.blue['500']}`,
            maxHeight: '20rem',
            overflowY: 'auto',
            top: `2.75rem`,
            width: '100%',
            borderRadius: `${theme.sizes['1']}`
          }}
        >
          {items.map((item, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <div
                key={index}
                style={Object.assign({
                    cursor: 'pointer',
                    userSelect: 'none',
                    width: `${1 / (columns * 1.0) * 100}%`,
                    display: columns === 1  ? 'flex' : 'inline-flex',
                    alignItems: columns === 1 ? 'flex-start' : 'center',
                    justifyContent: columns === 1 ? 'flex-start' : 'center',
                  },
                  isHighlighted && {
                    backgroundColor: theme.colors.blue['50'], opacity: 0.8
                  },
                  isSelected(item, selectedItem, {valueKey}) && {
                    backgroundColor: theme.colors.blue['100'],
                    opacity: 0.8,
                    border: `1px solid ${theme.colors.blue['200']}`,
                  },
                )}
                {...getItemProps({item, index})}
              >     
                {
                  isCreatedItem(item, {items, createdKey}) ?
                    createRender(item, {textKey, isHighlighted, columns}) :
                    itemRender(item, {textKey, isHighlighted, columns})
                }
              </div>
            );
          })}
        </div>
      )}
    </PseudoBox>
  );
});

export default ComboBox;


