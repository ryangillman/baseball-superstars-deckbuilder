import uniqid from 'uniqid';
import firebase from '../firebase';
import allTrainers from '../allTrainers';
import { createRosterObject } from '../util';

export const createInitialUser = async (id, trainerlist) => {
  const rosterId = uniqid();
  const updates = {
    [`/users/${id}/username`]: 'Anonymous',
    [`/users/${id}/roster`]: rosterId,
  };
  await firebase.database().ref().update(updates);
  const rosterUpdate = {
    [`/rosters/${rosterId}/trainers`]:
      trainerlist || allTrainers.reduce(createRosterObject, {}),
    [`/rosters/${rosterId}/isShared`]: false,
  };
  await firebase.database().ref().update(rosterUpdate);
};

export const getUserData = async (id) => {
  if (id) {
    const data = await firebase.database().ref(`/users/${id}`).once('value');
    if (data.val()) {
      return data.val();
    }
  }

  return null;
};

export const updateUserData = async (id, values) => {
  if (id) {
    try {
      const data = await firebase.database().ref(`/users/${id}`).update(values);
    } catch (e) {
      console.log(e);
    }
  }

  return null;
};
