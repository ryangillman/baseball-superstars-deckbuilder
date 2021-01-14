import React from 'react';

const TypeIcon = ({ type, className }) => {
  switch (type) {
    case 'STR':
      return <div className={`str-icon type-icon ${className || ''}`} />;
    case 'INT':
      return <div className={`int-icon type-icon ${className || ''}`} />;
    case 'DEX':
      return <div className={`dex-icon type-icon ${className || ''}`} />;
    case 'MNT':
      return <div className={`mnt-icon type-icon ${className || ''}`} />;
    case 'SP':
      return <div className={`sp-icon type-icon ${className || ''}`} />;
    case 'GP':
      return <div className={`gp-icon type-icon ${className || ''}`} />;
    default:
      return null;
  }
};

export default TypeIcon;
