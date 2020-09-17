import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Input,
  FormHelperText,
  Checkbox,
  FormLabel,
  Heading,
  Button,
  useToast,
  Flex,
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import useRoster from '../../hooks/useRoster';
import useAuth from '../../hooks/useAuth';
import { updateUserData } from '../../api/userQueries';
import { updateRosterData } from '../../api/rosterQueries';

const Profile = () => {
  const [username, setUserName] = useState('');
  const [shareRoster, setShareRoster] = useState(false);
  const { user, signOut } = useAuth();
  const { data } = useRoster();

  const history = useHistory();

  useEffect(() => {
    setShareRoster(data?.isShared || false);
  }, [data]);

  useEffect(() => {
    setUserName(user?.username);
  }, [user]);

  const toast = useToast();
  const saveSettings = () => {
    const userValues = {
      '/username': username,
    };
    const rosterValues = {
      '/owner': username,
      '/isShared': shareRoster,
    };
    updateUserData(user.uid, userValues);
    updateRosterData(user.roster, rosterValues);
    toast({
      title: 'Success.',
      description: 'Saved your data',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Heading color='gray.300'>Profile</Heading>
      <FormControl color='gray.300' id='email'>
        <FormLabel>Username</FormLabel>
        <Input value={username} onChange={(e) => setUserName(e.target.value)} />
        <FormHelperText>
          If you decide to share your roster this name will be displayed when
          someone is looking at your roster.
        </FormHelperText>
      </FormControl>
      <FormControl color='gray.300' id='email' mt={10}>
        <FormLabel>Roster</FormLabel>
        <Checkbox
          isChecked={shareRoster || false}
          onChange={(e) => setShareRoster(e.target.checked)}
        >
          Make your Roster visible to anyone with the link
        </Checkbox>
        <FormHelperText>
          The link to your roster is:{' '}
          <code>{`${process.env.REACT_APP_URL}?rosterid=${user?.roster}`}</code>
        </FormHelperText>
      </FormControl>
      <Flex w='100%' mt={10} justifyContent='space-between'>
        <Button colorScheme='blue' onClick={saveSettings}>
          Save Settings
        </Button>
        <Button
          colorScheme='red'
          onClick={() => {
            signOut();
            history.push('/');
          }}
        >
          Logout
        </Button>
      </Flex>
    </>
  );
};

export default Profile;
