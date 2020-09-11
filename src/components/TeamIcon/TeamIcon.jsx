import React from 'react';

const TeamIcon = ({ team }) => {
  switch (team) {
    case 'Cruel Pumas':
      return <div className='team-icon team-pumas' alt={team} title={team} />;
    case 'Shining Angels':
      return <div className='team-icon team-angels' alt={team} title={team} />;
    case 'River City':
      return (
        <div className='team-icon team-rivercity' alt={team} title={team} />
      );
    default:
      return null;
  }
};

export default TeamIcon;
