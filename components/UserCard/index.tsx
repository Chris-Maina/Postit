import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Typography from '@material-ui/core/Typography';

import classes from './UserCard.module.scss';
import { IUser } from '../../common/interfaces';
import { getUserFullname, getUserInitial } from '../../helpers/postHelpers';

interface IUserCard {
  user: IUser;
}
const UserCard = ({ user }: IUserCard) => {
  return (
    <Paper className={classes.Card}>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar className={classes.Card_Avatar}>
            {getUserInitial(user)}
          </Avatar>
        </Grid>
        <Grid item xs={12} sm zeroMinWidth>
          <Typography>{getUserFullname(user)}</Typography>
          <div className={classes.Card_Wrapper}>
            <PostAddIcon className={classes.Card_PostIcon} />
            <Typography
              component="span"
              variant="caption"
              color="textSecondary"
            >
              {user.posts.length} posts added
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserCard;
