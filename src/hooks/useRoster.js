import { useQuery } from 'react-query';
import useAuth from './useAuth';
import { getRosterById } from '../api/rosterQueries';

const useRoster = (id) => {
  const { user } = useAuth();

  return useQuery(['roster', id || user?.roster], getRosterById, {
    staleTime: Infinity,
    enabled: 'trainers',
  });
};

export default useRoster;
