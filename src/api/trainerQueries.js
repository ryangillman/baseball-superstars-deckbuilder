import firebase from '../firebase';

export default async () => {
  const data = await firebase.database().ref('/trainers').once('value');
  if (data.val()) {
    return data.val();
  }

  return null;
};
