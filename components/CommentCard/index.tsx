import React, { useState } from 'react';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemText from "@material-ui/core/ListItemText";
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDial from '@material-ui/lab/SpeedDial';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import classes from './CommentCard.module.scss';
import { getUserFullname } from '../../helpers/postHelpers';

const CommentCard = ({ comment, className, variant, onEdit, onDelete }) => {
  const [speedDialOpen, setSpeedDialOpen] = useState<boolean>(false);
  const Actions = [
    {
      label: 'Edit',
      action: () => {
        onEdit(comment);
        handleSpeedDialClose();
      },
      icon: <EditIcon />
    },
    {
      label: 'Delete',
      action: () => {
        onDelete(comment)
        handleSpeedDialClose();
      },
      icon: <DeleteIcon />
    }
  ];

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  }

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
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
      <ListItemSecondaryAction>
        <SpeedDial
          ariaLabel="speed dial"
          direction="left"
          open={speedDialOpen}
          icon={<MoreVertIcon />}
          onOpen={handleSpeedDialOpen}
          onClose={handleSpeedDialClose}
          FabProps={{
            classes: {
              root: classes.Comment_SpeedDialFab
            }
          }}
        >
          {Actions.map(option => (
            <SpeedDialAction
              key={option.label}
              icon={option.icon}
              tooltipTitle={option.label}
              tooltipPlacement="top"
              FabProps={{
                classes: {
                  root: classes.Comment_SpeedDialFab
                }
              }}
              onClick={option.action}
            />
          ))}
        </SpeedDial>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

CommentCard.defaultProps = {
  variant: 'body1'
}

export default CommentCard;
