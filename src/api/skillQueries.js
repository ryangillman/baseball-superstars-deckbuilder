import { queryCache } from 'react-query';
import firebase from '../firebase';

export const getSkills = () => queryCache.getQueryData('skills');

export default async () => {
  const data = await firebase.database().ref('/skills').once('value');
  if (data.val()) {
    return data.val();
  }

  return null;
};
