import { useQuery } from 'react-query';
import getTrainers from '../api/trainerQueries';

const useTrainers = () =>
  useQuery(['trainers'], getTrainers, {
    staleTime: Infinity,
  });

export default useTrainers;
