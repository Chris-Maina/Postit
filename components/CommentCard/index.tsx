import React, { useState } from 'react';
import clsx from 'clsx';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from "@material-ui/core/ListItem";
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/EditOutlined';
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import classes from './CommentCard.module.scss';
import { getUserFullname } from '../../helpers/postHelpers';

const CommentCard = ({ user, comment, className, variant, onEdit, onDelete }) => {
  const [actionsAnchor, setActionsAnchor] = useState<null | HTMLElement>(null);
  const ACTIONS = [
    {
      label: 'Edit',
      onClick: () => {
        onEdit(comment);
        handleMenuClose();
      },
      icon: <EditIcon fontSize="small"  className={classes.Comment_Action_Icon}/>
    },
    {
      label: 'Delete',
      onClick: () => {
        onDelete(comment)
        handleMenuClose();
      },
      icon: <DeleteIcon fontSize="small"  className={classes.Comment_Action_Icon}/>
    }
  ];

  const handleMenuClick = (evt: React.MouseEvent<HTMLElement>) => {
    setActionsAnchor(evt.currentTarget);
  }

  const handleMenuClose = () => {
    setActionsAnchor(null);
  };


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
      {(user?.id === comment?.commented_by?.id) ? (
        <ListItemSecondaryAction>
          <IconButton
            size="small"
            aria-label="comment"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            keepMounted
            anchorEl={actionsAnchor}
            onClose={handleMenuClose}
            open={Boolean(actionsAnchor)}
          >
            {ACTIONS.map(action => (
              <MenuItem
                dense
                key={action.label}
                onClick={action.onClick}
                className={classes.Comment_Action}
              >
                {action.icon}
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
}

CommentCard.defaultProps = {
  variant: 'body1'
}

export default CommentCard;
