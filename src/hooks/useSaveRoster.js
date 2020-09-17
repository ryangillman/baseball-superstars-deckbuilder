import { useMutation, queryCache } from 'react-query';
import { useCallback } from 'react';

const { default: useAuth } = require('./useAuth');
const { setRosterById } = require('../api/rosterQueries');

const useSaveRoster = () => {
  const { user } = useAuth();
  const [mutate] = useMutation(setRosterById);

  const saveRoster = useCallback(
    (roster) => {
      mutate(
        { id: user?.roster, value: roster },
        {
          onSuccess: () => {
            queryCache.invalidateQueries(['roster', user?.roster]);
          },
        }
      );
    },
    [mutate, user]
  );

  return saveRoster;
};

export default useSaveRoster;
