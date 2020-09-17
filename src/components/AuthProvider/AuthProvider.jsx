import React, { useState, useCallback, useEffect } from 'react';
import firebase from '../../firebase';
import { getUserData, createInitialUser } from '../../api/userQueries';

export const AuthContext = React.createContext(null);

const getUser = async (uid) => {
  let userData = await getUserData(uid);
  if (!userData) {
    await createInitialUser(uid, JSON.parse(localStorage.getItem('roster')));
    userData = await getUserData(uid);
  }
  return userData;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const { uid, displayName, email } = user;
        const userData = await getUser(uid);
        setIsLoading(false);
        setCurrentUser({ uid, displayName, email, ...userData });
      } else {
        setIsLoading(false);
        setCurrentUser(null);
      }
    });
    return () => {
      listener();
    };
  }, []);

  const signOut = useCallback(() => firebase.auth().signOut(), []);

  return (
    <AuthContext.Provider value={{ user: currentUser, signOut }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
