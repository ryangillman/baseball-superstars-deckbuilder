import React from 'react';

const TypeIcon = ({ type }) => {
  switch (type) {
    case 'STR':
      return <div className='str-icon type-icon' />;
    case 'INT':
      return <div className='int-icon type-icon' />;
    case 'DEX':
      return <div className='dex-icon type-icon' />;
    case 'MNT':
      return <div className='mnt-icon type-icon' />;
    case 'SP':
      return <div className='sp-icon type-icon' />;
    case 'GP':
      return <div className='gp-icon type-icon' />;
    default:
      return null;
  }
};

export default TypeIcon;
