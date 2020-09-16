import firebase from '../firebase';
import { createRosterObject } from '../util';

export const getRosterById = async (_, id) => {
  if (id) {
    const data = await firebase.database().ref(`/rosters/${id}`).once('value');
    if (data.val()) {
      return data.val();
    }
  }
  if (localStorage.getItem('roster')) {
    return { trainers: JSON.parse(localStorage.getItem('roster') || {}) };
  }
  return null;
};

export const setRosterById = async ({ id, value }) => {
  if (id) {
    try {
      await firebase.database().ref(`/rosters/${id}/trainers`).set(value);
    } catch (e) {
      console.log(e);
    }
  } else {
    localStorage.setItem('roster', JSON.stringify(value));
  }
};

export const updateRosterData = async (id, values) => {
  if (id) {
    try {
      await firebase.database().ref(`/rosters/${id}`).update(values);
    } catch (e) {
      console.log(e);
    }
  }
};
