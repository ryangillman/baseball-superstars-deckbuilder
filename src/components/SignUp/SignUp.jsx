import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from 'react-router-dom';
import firebasePackage from 'firebase/app';
import 'firebase/auth';
import { Text } from '@chakra-ui/core';
import firebase from '../../firebase';
import useAuth from '../../hooks/useAuth';

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',

  // signInSuccessUrl: '/roster',
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebasePackage.auth.GoogleAuthProvider.PROVIDER_ID,
    firebasePackage.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const SignUp = () => {
  const { user } = useAuth();

  if (user) return <Redirect to='/roster' />;

  return (
    <>
      <Text color='gray.300'>
        Using a login is not mandatory. If you decide to not create a user all
        the changes to your roster will be saved in your browser locally. This
        however has the caveat that your roster will disappear if you decide to
        delete your Cookies etc. You will also not be able to share your Roster
        with others to let them help you build decks if you do not have an
        account.
      </Text>
      <Text color='gray.300' fontSize={18} fontWeight='600'>
        If you decided to create an account after having built your roster the
        roster that is currently saved in your browser will be pushed to your
        account so you do not have to do it again.
      </Text>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </>
  );
};

export default SignUp;
