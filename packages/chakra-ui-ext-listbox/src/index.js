import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {useCombobox} from 'downshift';

import {
  Spinner, Input, InputGroup, InputRightElement, Icon, useTheme, Box
} from '@chakra-ui/core';


const stateReducer = (state, {changes, props, type}) => {

  switch (type) {
    case useCombobox.stateChangeTypes.FunctionSelectItem:
    case useCombobox.stateChangeTypes.InputChange:
      if(!changes.inputValue) {
        return changes;
      }

      // eslint-disable-next-line no-case-declarations
      const highlightedIndex = props.items.findIndex((item) => {
        const realText = props.itemToString(item);
        return realText && realText.toLowerCase().startsWith(changes.inputValue.toLowerCase());
      })

      return {...changes, highlightedIndex};
    // disable Esc by passing the current state aka no changes
    case useCombobox.stateChangeTypes.InputKeyDownEscape:
      return {...state, isOpen: false}
    default:
      return changes
  }
};

const ListBox = forwardRef(({
  mode='string', //mode='object',
  defaultInputValue,
  defaultSelectedItem,
  valueKey='value',
  textKey='text',
  placeholder,
  focusBorderColor,
  errorBorderColor,
  isInvalid,
  isLoading,
  items=[],
  onFocus=() => {},
  onBlur=() => {},
  onInput=()=>{},
  onChange=() => {},
  itemRender=(item) => (<div>{item[textKey]}</div>),
  ...rest
}, innerRef) => {

  const hasValue = (selectedItem) => (
    selectedItem && selectedItem[valueKey] !== undefined 
  )
  const showMenu = (isOpen, isLoading, items) => (
    isOpen && !isLoading && items && items.length > 0
  )

  const getSelectedText = (item) => {
    if(!item) {
      return '';
    } else {
      return item[textKey];
    }
  }  

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
    highlightedIndex,
  } = useCombobox({
    stateReducer,
    items,
    initialSelectedItem: defaultSelectedItem,
    initialInputValue: defaultInputValue,
    itemToString: getSelectedText,
    onStateChange: (x,y) => {
      console.log(x,y,'onStateChange')
    },
    onInputValueChange: (changes,b) => {
      onInput(changes,b)
      console.log(changes,b, "onInputValueChange")
    },
    onSelectedItemChange: (changes,b) => {
      onChange(changes,b)
      console.log(changes,b, "onSelectedItemChange")
    },
  });

  return (
    <Box w='100%' position='relative' backgroundColor='white' {...rest}>
      <InputGroup w='100%' position='relative' {...getComboboxProps()}>
        <Input
          {...getInputProps({
              refKey: 'ref',
              onFocus: () => {
                console.log('onfocus')
                onFocus();
              },
              onClick: () => {
                console.log('openMenu')
                openMenu()
              },
            })
          }
          placeholder={placeholder}
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
            width: '3.5rem',
            marginRight: '0.25rem'
          }}
        >
          {hasValue(selectedItem) && !isLoading && (
            <Box
              w={'1rem'}
              fontSize={'0.625rem'}
              onClick={()=> {
                selectItem(null);
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
          {items.map((item, index) => (   
            <div
              key={index}
              style={Object.assign({
                  padding: '0.5rem',
                },
                highlightedIndex === index ? {backgroundColor: theme.colors.blue['50'], opacity: 0.8} : {},
                selectedItem && ((valueKey && selectedItem[valueKey] === item[valueKey]) ||  selectedItem === item)? {
                  backgroundColor: theme.colors.blue['100'], opacity: 0.8,
                  borderTop: `1px solid ${theme.colors.blue['200']}`,
                  borderBottom: `1px solid ${theme.colors.blue['200']}`,
                } : {},
              )}
              {...getItemProps({item, index})}
            >
              {
                itemRender(item)
              }
            </div>
          ))}
        </div>
      )}
    </Box>
  );
});

export default ListBox;


