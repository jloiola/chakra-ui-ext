import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {useCombobox} from 'downshift';
import {useDebouncedCallback} from 'use-debounce';

import {Spinner, Input, InputGroup, InputRightElement, Icon, useTheme, Box } from '@chakra-ui/core';
import {useCombinedRefs} from './combined-refs';

const ComboBox = forwardRef(({
  optionsMode='object',
  matchFilter='startsWith',
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
  onFocus=() => {},
  onBlur=() => {},
  onInput=()=>{},
  onChange=() => {},
  createRender=(item) => (<div style={{padding: '0.5rem'}}>Create `{item[textKey] || item}`</div>),
  itemRender=(item) => (<div style={{padding: '0.5rem'}}>{item[textKey] || item}</div>),
  debounceMs=333,
  ...rest
}, ref) => {

  const modeSelect = (mode) => {
    switch (mode) {
      case 'primitive':
        return {
          isNewValue: (selectedItem, {items}) => {
            return items.filter(item => selectItem === item) === null;
          }, 
          hasValue: (selectedItem) => (selectedItem !== undefined && selectedItem !== null),
          isSelected: (item, selectedItem, {valueKey}) => (item === selectedItem),
          getSelectedItem: (item) => {
            return (item === undefined || item === null) ? null : item;
          },
          getSelectedText: (item) => {
            return (item === undefined || item === null) ? '' : item.toString();
          },
          matchers: {
            exact: (item, inputValue) => (
              item.toString().toLowerCase() === inputValue.toLowerCase()
            ),            
            contains: (item, inputValue) => (
              item.toString().toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
            ),
            startsWith: (item, inputValue) => (
              item.toString().toLowerCase().indexOf(inputValue.toLowerCase()) === 0
            )
          },
        };
      break;
      case 'object':
      default:
        return {
          isNewValue: (selectedItem, {createdKey}) => (selectedItem && selectedItem[createdKey]), 
          hasValue: (selectedItem) => (
            selectedItem && ((selectedItem[valueKey] !== undefined && selectedItem[valueKey] !== null) 
            || selectedItem[createdKey])
          ),
          isSelected: (item, selectedItem, {valueKey}) => (
            selectedItem && (selectedItem[valueKey] === item[valueKey])
          ),
          getSelectedItem: (item) => {
            return (item === undefined || item === null) ? null : item;
          },
          getSelectedText: (item) => {
            return (item === undefined || item === null) ? '' : item[textKey].toString();
          },
          matchers: {
            exact: (item, inputValue) => (
              item && item[textKey].toString().toLowerCase() === inputValue.toLowerCase()
            ),
            contains: (item, inputValue) => (
              item && item[textKey].toString().toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
            ),
            startsWith: (item, inputValue) => (
              item && item[textKey].toString().toLowerCase().indexOf(inputValue.toLowerCase()) === 0
            )
          },
        };
      break;
    }
  };  

  const {hasValue, isSelected, isNewValue, getSelectedText, getSelectedItem, matchers} = modeSelect(optionsMode);
  const filterMatcher = typeof matchFilter === 'function' ? matchFilter : matchers[matchFilter];

  const stateReducer = (state, {changes, props, type}) => {
    switch (type) {
      case useCombobox.stateChangeTypes.FunctionSelectItem:
      case useCombobox.stateChangeTypes.ItemClick:
        console.log(state, {changes, props, type})
        return {...changes, inputValue: getSelectedText(changes.selectedItem)};
      case useCombobox.stateChangeTypes.InputChange:
      case useCombobox.stateChangeTypes.FunctionSetInputValue:
        console.log(state, {changes, props, type})
        // eslint-disable-next-line no-case-declarations
        const highlightedIndex = props.items.findIndex((item) => filterMatcher(item, changes.inputValue));
        const selectedItem = highlightedIndex >= 0 ? null : changes.selectedItem;
        return {...changes, highlightedIndex, selectedItem};
      // disable Esc by passing the current state aka no changes
      case useCombobox.stateChangeTypes.InputKeyDownEscape:
        return {...state, isOpen: false}      
      default:
        return changes
    }
  };

  const showMenu = (isOpen, isLoading, items) => (
    isOpen && !isLoading && items && items.length > 0
  );

  const [debouncedCallback] = useDebouncedCallback(async (inputValue) => {
    await remoteData(remoteOptions, inputValue)
  }, debounceMs);

  const [tryAutoSelect, setAutoSelect] = useState(false);
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
    initialSelectedItem: getSelectedItem(initialValue),
    initialInputValue: getSelectedText(initialText),
    itemToString: (item) => {
      getSelectedText(item)
    },
    onInputValueChange: ({selectedItem, inputValue}) => {
      onInput(inputValue)
    },
    onSelectedItemChange: ({selectedItem}) => {
      onChange(selectedItem);
    },
  });

  const remoteData = async (fetchFunction, inputValue) => {
    try {
      setLoading(true);

      const items = await fetchFunction(inputValue);
      const found = items.find((item) => {
        return (item[textKey].toLowerCase() === inputValue.toLowerCase()) ||
          (selectedItem && selectedItem[valueKey].toString() === item[valueKey].toString());
      })

      if(allowCreate && !found) {
        items.unshift({
          [createdKey]: true,
          [textKey]: inputValue,
        });
      }

      setItems(items)

      if(found && tryAutoSelect) {
        selectItem(found)
        setInputValue(found[textKey])
      }
      
      setPreviousInputValue(inputValue)

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  };  

  useEffect(() => {
    (async () => {
      if(remoteOptions && inputValue.trim()) {
        await remoteData(remoteOptions, inputValue);
        setAutoSelect(false);
      }
    })();
    if(!remoteOptions && allowCreate && inputValue.trim() && !selectedItem) {
      setItems([
        {[createdKey]: true, [textKey]: inputValue, [valueKey]: undefined },
        ...options,
      ])
    }
  }, []);

  const {inputRef, ...inputProps} = getInputProps({
    refKey: 'inputRef',
    onFocus: (e) => {
      onFocus();
    },
    onClick: () => {
      openMenu();
    },
    onKeyUp: (e,b) => {
      if(e.nativeEvent.code === 'Backspace' && hasValue(selectedItem)) {
        
      }
      return true;
    },
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
              onClick={()=> {
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
              {...getToggleButtonProps()}
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
            return (
              <div
                key={index}
                style={Object.assign({
                  },
                  highlightedIndex === index ? {backgroundColor: theme.colors.blue['50'], opacity: 0.8} : {},
                  isSelected(item, selectedItem, {valueKey}) ? {
                    backgroundColor: theme.colors.blue['100'], opacity: 0.8,
                    borderTop: `1px solid ${theme.colors.blue['200']}`,
                    borderBottom: `1px solid ${theme.colors.blue['200']}`,
                  } : {},
                )}
                {...getItemProps({item, index})}
              >
                {
                  isNewValue(selectedItem, {items, createdKey}) ?
                    createRender(item, {isHighlighted: highlightedIndex === index}) :
                    itemRender(item, {isHighlighted: highlightedIndex === index})
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


