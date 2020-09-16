import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider, DarkMode } from '@chakra-ui/core';

import { ReactQueryDevtools } from 'react-query-devtools';
import DeckBuilder from './components/DeckBuilder';
import customTheme from './customTheme';
import SignUp from './components/SignUp';
import RosterManager from './components/RosterManager';
import Profile from './components/Profile';

import Layout from './components/Layout';
import AuthProvider from './components/AuthProvider/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ChakraProvider resetCSS theme={customTheme}>
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
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
