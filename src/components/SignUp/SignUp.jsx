import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from 'react-router-dom';
import firebasePackage from 'firebase/app';
import 'firebase/auth';
import firebase from '../../firebase';
import useAuth from '../../hooks/useAuth';
import { getUserData, createInitialUser } from '../../api/userQueries';

const checkForNewUser = async ({ user }) => {
  if (!(await getUserData(user.uid))) {
    createInitialUser(user.uid, JSON.parse(localStorage.getItem('roster')));
  }
  return false;
};

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',

  // signInSuccessUrl: '/roster',
  callbacks: {
    signInSuccessWithAuthResult: (user) => {
      checkForNewUser(user);
      return false;
    },
  },
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebasePackage.auth.GoogleAuthProvider.PROVIDER_ID,
    firebasePackage.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const SignUp = (props) => {
  const { user } = useAuth();

  if (user) return <Redirect to='/roster' />;
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
};

export default SignUp;
