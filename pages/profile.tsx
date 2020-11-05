import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { useAuthContext, useIsLogged } from '../helpers/authHelpers';
import { useEffect } from 'react';

const Profile = () => {
 const router = useRouter();
  if (typeof window !== 'undefined' && !useIsLogged()) {
    router.push('/login');
  };

  const { user, fetchUser } = useAuthContext();
  useEffect(() => {
    if (!Object.keys(user).length) {
      fetchUser();
    }
  }, [user]);


  if (!Object.keys(user).length) {
    return <CircularProgress />;
  }
  return (
    <div>
      <h3>User: {user.first_name} - {user.last_name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

export default Profile;
