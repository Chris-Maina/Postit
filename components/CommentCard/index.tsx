import React from 'react';
import clsx from 'clsx';
import ListItem from "@material-ui/core/ListItem";
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import classes from './CommentCard.module.scss';
import { getUserFullname } from '../../helpers/postHelpers';

const CommentCard = ({ comment, className, variant }) => {
  return (
    <ListItem className={clsx(className, classes.Comment)}>
      <ListItemText
        primary={
          <>
            <Typography
              variant={variant}
              component="span"
              className={classes.Comment_User}
            >
              {getUserFullname(comment.commented_by)}
            </Typography>
            <Typography
              variant={variant}
              component="span"
              color="textPrimary"
            >
              {comment.title}
            </Typography>
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="more"
        >
          <MoreVertIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

CommentCard.defaultProps = {
  variant: 'body1'
}

export default CommentCard;
