import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider, DarkMode, useToast } from '@chakra-ui/core';

import { ReactQueryDevtools } from 'react-query-devtools';
import DeckBuilder from './components/DeckBuilder';
import customTheme from './customTheme';
import SignUp from './components/SignUp';
import RosterManager from './components/RosterManager';
import Profile from './components/Profile';

import Layout from './components/Layout';
import AuthProvider from './components/AuthProvider/AuthProvider';
import useRoster from './hooks/useRoster';

import useSaveRoster from './hooks/useSaveRoster';
import useAuth from './hooks/useAuth';
import { createRosterObject } from './util';
import useTrainers from './hooks/useTrainers';

function WrappedApp() {
  return (
    <AuthProvider>
      <Router>
        <ChakraProvider resetCSS theme={customTheme}>
          <App />
        </ChakraProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthProvider>
  );
}

const App = () => {
  const { user } = useAuth();
  const { data: trainers, isSuccess: isSuccessTrainers } = useTrainers();
  const saveRosterPersistent = useSaveRoster();
  const { data: roster, isSuccess: isSuccessRoster } = useRoster();
  const toast = useToast();

  useEffect(() => {
    // If user is not logged out and no roster in localstorage create roster in locastorage
    if (isSuccessRoster && isSuccessTrainers && !user && !roster) {
      saveRosterPersistent(
        trainers
          .map((row) => ({ ...row, stars: 1 }))
          .reduce(createRosterObject, {}),
        true
      );
      toast({
        title: 'Success.',
        description: 'Initial rostersetup complete.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [
    isSuccessRoster,
    isSuccessTrainers,
    user,
    roster,
    toast,
    saveRosterPersistent,
    trainers,
  ]);

  return (
    <>
      <DarkMode>
        <Layout>
          <Switch>
            <Route exact path='/login'>
              <SignUp />
            </Route>
            <Route exact path='/profile'>
              <Profile />
            </Route>
            <Route path='/roster/:rosterid?'>
              <RosterManager />
            </Route>
            <Route path='/:trainers?'>
              <DeckBuilder />
            </Route>
          </Switch>
        </Layout>
      </DarkMode>
    </>
  );
};

export default WrappedApp;
