import { useContext } from 'react';
import { AuthContext } from '../components/AuthProvider/AuthProvider';

const useAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};

export default useAuth;
