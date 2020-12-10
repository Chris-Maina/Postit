import React from 'react';
import useSWR from 'swr';
import { GetStaticProps } from 'next';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import classes from './Users.module.scss';
import Api from '../../helpers/apiHelpers';
import AppDrawer from '../../components/Drawer';
import UserCard from '../../components/UserCard';

export default function Users({ users }) {
  const { data, error: userErr } = useSWR('/auth/users', Api.fetcher, {
    initialData: users,
  });

  if (!data)
    return (
      <AppDrawer>
        <FormHelperText error={!!userErr}>{userErr}</FormHelperText>
        <CircularProgress className={classes.Loader} />
      </AppDrawer>
    );
  return (
    <AppDrawer>
      <FormHelperText error={!!userErr}>{userErr}</FormHelperText>
      {data && !data.length ? (
        <List>
          <ListItem>
            <ListItemText
              disableTypography
              primary={
                <Typography className={classes.ItemText} variant="h4">
                  Yay{' '}
                  <span role="img" aria-label="party popper">
                    🎉
                  </span>{' '}
                  Nice to meet you, now register!
                </Typography>
              }
            />
          </ListItem>
        </List>
      ) : (
        <div className={classes.Section}>
          <h2>Users</h2>
          <Grid container spacing={2}>
            {data.map((user) => (
              <Grid key={user.id} item>
                <UserCard user={user} />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
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
  };
};
