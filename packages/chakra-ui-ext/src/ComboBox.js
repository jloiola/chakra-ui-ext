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
  onFocus=() => {},
  onBlur=() => {},
  onInput=()=>{},
  onChange=() => {},
  createRender=(item, {isHighlighted, columns}) => (<div style={{padding: '0.5rem'}}>Create `{item[textKey] || item}`</div>),
  itemRender=(item, {isHighlighted, columns}) => (<div style={{padding: '0.5rem', textAlign: columns > 1 && 'center'}}>{item[textKey] || item}</div>),
  debounceMs=333,
  columns=1,
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
              item.toString().toLowerCase() === inputValue.toString().toLowerCase()
            ),            
            contains: (item, inputValue) => (
              item.toString().toLowerCase().indexOf(inputValue.toString().toLowerCase()) >= 0
            ),
            startsWith: (item, inputValue) => (
              item.toString().toLowerCase().indexOf(inputValue.toString().toLowerCase()) === 0
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
        };
      break;
    }
  };  

  const {hasValue, isSelected, isNewValue, getSelectedText, getSelectedItem, matchers} = modeSelect(optionsMode);
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
    itemToString: (item) => {
      getSelectedText(item)
    },
    onInputValueChange: ({selectedItem, inputValue}) => {
      if(remoteOptions && !selectedItem) {
        debouncedCallback(inputValue.trim())
      }
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

    const selectedItem = getSelectedItem(initialValue);
    
    if(selectedItem) {
      const text = getSelectedText(selectedItem);
      setInputValue(text);
      selectItem(selectedItem);
    } else if(initialText && initialText.toString().trim()) {
      setInputValue(initialText)
    }
     
    if(!remoteOptions && allowCreate && inputValue.toString().trim() && !selectedItem) {
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
  console.log(ref, inputRef, combinedRef, 'refs')

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
                    width: `${1 / (columns * 1.0) * 100}%`,
                    display: 'inline-flex',
                    alignItems: columns === 1 ? 'flex-start' : 'center',
                    justifyContent: columns === 1 ? 'flex-start' : 'center',
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
                    createRender(item, {isHighlighted: highlightedIndex === index, columns}) :
                    itemRender(item, {isHighlighted: highlightedIndex === index, columns})
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


