import React, { useMemo } from 'react';
import ReactSelect from 'react-select';
import { useTheme } from '@chakra-ui/core';

// const MultiValueContainer = ({ data, ...props }) => (
//   <Tooltip label={data.label}>
//     <Flex
//       flex='0 1 auto'
//       minW={0}
//       {...(data.withColor && {
//         border: `2px solid ${getSkillColor(data.value)}`,
//       })}
//       borderRadius='2px'
//       mx='2px'
//     >
//       <components.MultiValueContainer {...props} data={data} />
//     </Flex>
//   </Tooltip>
// );

const Select = ({ items, onChange, ...props }) => {
  const theme = useTheme();
  const chakraStyles = useMemo(
    () => ({
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused
          ? theme.colors.gray['600']
          : theme.colors.gray['800'],
        '&:hover': {
          backgroundColor: theme.colors.gray['600'],
        },
        '&:focus': {
          backgroundColor: theme.colors.gray['600'],
        },
        color: theme.colors.gray['300'],
        borderTop: `1px solid ${theme.colors.gray['700']}`,
      }),
      menuList: (provided, state) => ({
        ...provided,
        padding: 0,
      }),

      input: (provided, state) => ({
        ...provided,
        color: theme.colors.gray['300'],
      }),
      singleValue: (provided, state) => ({
        ...provided,
        color: theme.colors.gray['300'],
      }),
      clearIndicator: (provided, state) => ({
        ...provided,
        '&:hover': { color: theme.colors.gray['300'] },
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        '&:hover': { color: theme.colors.gray['300'] },
      }),
      placeholder: (provided, state) => ({
        ...provided,
        color: '#A0AEC0',
        whiteSpace: 'nowrap',
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        flexWrap: 'nowrap',
      }),
      control: (provided, state) => ({
        ...provided,
        backgroundColor: theme.colors.whiteAlpha['100'],
        height: '40px',
        borderColor: state.isFocused
          ? theme.colors.blue['300']
          : theme.colors.whiteAlpha['50'],
        boxShadow: state.isFocused
          ? `0 0 0 1px ${theme.colors.blue['300']}`
          : '0',
        '&:hover': {
          borderColor: !state.isFocused && theme.colors.whiteAlpha['200'],
        },
        '&:focus': {
          zIndex: 1,
          outline: 0,
          borderColor: theme.colors.blue['200'],
          boxShadow: `0 0 0 1px ${theme.colors.blue['300']}`,
        },
      }),
    }),
    [theme]
  );

  return (
    <ReactSelect
      options={items}
      // components={{ MultiValueContainer }}
      onChange={onChange}
      styles={chakraStyles}
      {...props}
    />
  );
};

export default Select;
