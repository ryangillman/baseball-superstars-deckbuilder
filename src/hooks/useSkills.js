import { useQuery } from 'react-query';
import getSkills from '../api/skillQueries';

const useSkills = () =>
  useQuery('skills', getSkills, {
    staleTime: Infinity,
  });

export default useSkills;
