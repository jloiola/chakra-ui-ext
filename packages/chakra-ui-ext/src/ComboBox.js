import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {useCombobox} from 'downshift';
import {useDebouncedCallback} from 'use-debounce';

import {Spinner, Input, InputGroup, InputRightElement, Icon, useTheme, Box } from '@chakra-ui/core';
import {useCombinedRefs} from './combined-refs';

const ComboBox = forwardRef(({
  optionsMode='object',
  itemFilter='startsWith',
  initialText='',
  initialValue=null,
  valueKey='value',
  textKey='text',
  createdKey='isCreated',
  placeholder,
  focusBorderColor,
  errorBorderColor,
  isInvalid=false,
  isDisabled=false,
  options=[],
  remoteOptions,
  allowCreate=false,
  autoSelect=false,
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
          isCreatedValue: (selectedItem, {items}) => {
            return selectedItem && !items.find(item => selectItem === item);
          },
          hasValue: (selectedItem) => (selectedItem !== undefined && selectedItem !== null),
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
              <div style={{padding: '0.5rem', textAlign: columns > 1 && 'center'}}>{item}</div>
            ),
            create: (item, {isHighlighted, columns}) => (
              <div style={{padding: '0.5rem'}}>{item}</div>
            ),
          }
        };
      break;
      case 'object':
      default:
        return {
          isCreatedValue: (item, {createdKey}) => {
            return item && item[createdKey] === true;
          }, 
          hasValue: (selectedItem) => (
            selectedItem && ((selectedItem[valueKey] !== undefined && selectedItem[valueKey] !== null) 
            || selectedItem[createdKey])
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
              <div style={{padding: '0.5rem', textAlign: columns > 1 && 'center'}}>{item[textKey]}</div>
            ),
            create: (item, {isHighlighted, columns, textKey}) => (
              <div style={{padding: '0.5rem'}}>{item[textKey]}</div>
            ),
          }          
        };
      break;
    }
  };  

  const {
    hasValue, findSelected, isSelected, isCreatedValue,
    getSelectedText, getSelectedItem, matchers, renderers
  } = modeSelect(optionsMode);

  itemRender = itemRender ? itemRender : renderers.item;
  createRender = createRender ? createRender : renderers.create;

  const filterMatcher = typeof itemFilter === 'function' ? itemFilter : matchers[itemFilter];

  const stateReducer = (state, {changes, props, type}) => {
    switch (type) {
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
      case useCombobox.stateChangeTypes.FunctionSelectItem:
      case useCombobox.stateChangeTypes.ItemClick:
        const text = getSelectedText(changes.selectedItem);
        const inputValue = text ? text : changes.inputValue;
        return {...changes, inputValue};
      case useCombobox.stateChangeTypes.InputChange:
      case useCombobox.stateChangeTypes.FunctionSetInputValue:
        const highlightedIndex = props.items.findIndex((item) => (filterMatcher(item, changes.inputValue)));
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

  const [debouncedCallback] = useDebouncedCallback(async (inputValue) => {
    await remoteData(remoteOptions, {inputValue, selectedItem, valueKey, textKey})
  }, debounceMs);

  const [tryAutoSelect, setAutoSelect] = useState(autoSelect);
  const [previousInputValue, setPreviousInputValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState(options);

  const theme = useTheme();
  focusBorderColor = focusBorderColor ? focusBorderColor : theme.colors.blue['500'];
  errorBorderColor = errorBorderColor ? errorBorderColor : theme.colors.red['500'];
  const currentBorderColor = isInvalid ? errorBorderColor : focusBorderColor;

  // ugh this
  const boxShadow = (currentBorderColor) => {
    return [
      `0 0 0 0`,
      `0 0 0 0`,
      `0 1px 0 1px ${currentBorderColor}`,
      `0 1px 0 1px ${currentBorderColor}`,
      `0 0 0 0`,
    ].join()
  };

  const {
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    isOpen,
    openMenu,
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
    onInputValueChange: ({selectedItem, inputValue}) => {
      const item = getSelectedItem(selectedItem);
      // fetch remote data on input change
      if(remoteOptions && !item) {
        debouncedCallback(inputValue.trim())
      }

      onInput(inputValue)
    },
    onSelectedItemChange: ({selectedItem}) => {

      const item = getSelectedItem(selectedItem);

      // the item is was selected remove the create option
      if(item && !isCreatedValue(item, {items, createdKey})) {
        if(allowCreate && items.length && items[0][createdKey]) {
          items.shift();
        }
      }
      
      onChange(selectedItem);
    },
  });

  const remoteData = async (fetchFunction, {inputValue, selectedItem, valueKey, textKey}) => {
    try {
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

      if(tryAutoSelect) {
        setAutoSelect(false);
        selectItem(found);
      }
      
      setPreviousInputValue(inputValue)

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  };  

  useEffect(() => {

    const selectedItem = getSelectedItem(initialValue);
    
    if(selectedItem) {
      const text = getSelectedText(selectedItem);
      setInputValue(text);
      if(hasValue(selectedItem)) {
        selectItem(selectedItem);
      }
    } else if(initialText && initialText.toString().trim()) {
      setInputValue(initialText)
    }
     
    if(!remoteOptions && allowCreate && initialText && initialText.toString().trim() && !selectedItem) {
      setItems([
        {[createdKey]: true, [textKey]: inputValue, [valueKey]: undefined },
        ...options,
      ])
    }
  }, []);

  const {inputRef, ...inputProps} = getInputProps({
    refKey: 'inputRef',
    onFocus: (e) => { onFocus(); },
    onClick: () => { openMenu();},
  });
  
  const combinedRef = useCombinedRefs(ref, inputRef);

  return (
    <Box w='100%' position='relative' backgroundColor='white' {...rest}>
      <InputGroup w='100%' position='relative' {...getComboboxProps()}>
        <Input
          ref={combinedRef}
          {...inputProps}
          placeholder={placeholder}
          isDisabled={isDisabled}
          style={{
            flex: 1,
            transition: 'none',
            borderRadius: isOpen && items.length ?
              `${theme.sizes['1']} ${theme.sizes['1']} 0 0` :
              `${theme.sizes['1']}`,
          }}
        />

        <InputRightElement
          style={{
            justifyContent: 'flex-end',
            marginRight: '0.25rem'
          }}
        >
          {hasValue(selectedItem) && !isLoading && (
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
                    // todo blur the caret focus
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
            border: `1px solid ${currentBorderColor}`,
            borderRadius: `0 0 ${theme.sizes['1']} ${theme.sizes['1']}`,
            maxHeight: '360px',
            overflowY: 'auto',
            top: `37px`,
            width: '100%',
            boxShadow: boxShadow(currentBorderColor),
            borderBottom: 'none',
            borderTop: 'none',
          }}
        >
          {items.map((item, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <div
                key={index}
                style={Object.assign({
                    width: `${1 / (columns * 1.0) * 100}%`,
                    display: columns === 1  ? 'flex' : 'inline-flex',
                    alignItems: columns === 1 ? 'flex-start' : 'center',
                    justifyContent: columns === 1 ? 'flex-start' : 'center',
                  },
                  isHighlighted ? {backgroundColor: theme.colors.blue['50'], opacity: 0.8} : {},
                  isSelected(item, selectedItem, {valueKey}) ? {
                    backgroundColor: theme.colors.blue['100'], opacity: 0.8,
                    borderTop: `1px solid ${theme.colors.blue['200']}`,
                    borderBottom: `1px solid ${theme.colors.blue['200']}`,
                  } : {},
                )}
                {...getItemProps({item, index})}
              >     
                {
                  isCreatedValue(item, {items, createdKey}) ?
                    createRender(item, {textKey, isHighlighted, columns}) :
                    itemRender(item, {textKey, isHighlighted, columns})
                }
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
});

export default ComboBox;


