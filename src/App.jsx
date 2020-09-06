import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ChakraProvider, DarkMode } from '@chakra-ui/core';
import DeckBuilder from './components/DeckBuilder';
import customTheme from './customTheme';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <ChakraProvider resetCSS theme={customTheme}>
        <DarkMode>
          <Layout>
            <Switch>
              <Route exact path='/'>
                <Redirect to='/deck' />
              </Route>
              <Route path='/deck/:trainers?'>
                <DeckBuilder />
              </Route>
            </Switch>
          </Layout>
        </DarkMode>
      </ChakraProvider>
    </Router>
  );
}

export default App;
