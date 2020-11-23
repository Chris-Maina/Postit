import useSWR from 'swr';
import { GetStaticProps } from 'next';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import Api from '../../helpers/apiHelpers';
import classes from './Users.module.scss';
import AppDrawer from '../../components/Drawer';
import UserCard from '../../components/UserCard';

export default function Users({ users }) {
  const { data, error: userErr } = useSWR('/auth/users', Api.fetcher, { initialData: users });
  return (
    <AppDrawer>
      <FormHelperText error={!!userErr}>{userErr}</FormHelperText>
      <div className={classes.Section}>
        <h2>Users</h2>
        {!data
          ? <CircularProgress />
          : (
            <Grid container spacing={2}>
              {data.map(user => (
                <Grid key={user.id} item>
                  <UserCard user={user} />
                </Grid>
              ))}
            </Grid>
          )
        }
      </div>
    </AppDrawer>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const res = await Api.getUsers();
  return {
    revalidate: 1,
    props: {
      users: res.data || [],
    },
  }
}
