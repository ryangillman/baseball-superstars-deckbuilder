import { useQuery } from 'react-query';
import getComboEvents from '../api/comboEventQueries';

const useComboEvents = () =>
  useQuery('comboEvents', getComboEvents, {
    staleTime: Infinity,
  });

export default useComboEvents;
