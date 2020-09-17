import uniqid from 'uniqid';
import firebase from '../firebase';
import getTrainers from './trainerQueries';
import { createRosterObject } from '../util';

export const createInitialUser = async (id, trainerlist) => {
  const rosterId = uniqid();
  let allTrainers;
  if (!trainerlist) {
    const data = await getTrainers();
    allTrainers = data
      .map((row) => ({ ...row, stars: 1 }))
      .reduce(createRosterObject, {});
  }
  const updates = {
    [`/users/${id}/username`]: 'Anonymous',
    [`/users/${id}/roster`]: rosterId,
  };
  await firebase.database().ref().update(updates);
  const rosterUpdate = {
    [`/rosters/${rosterId}/trainers`]: trainerlist || allTrainers,
    [`/rosters/${rosterId}/isShared`]: false,
    [`/rosters/${rosterId}/owner`]: 'Anonymous',
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
      await firebase.database().ref(`/users/${id}`).update(values);
    } catch (e) {
      console.log(e);
    }
  }

  return null;
};
