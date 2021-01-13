import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import CommentForm from '../../containers/CommentForm';

import classes from './CommentDialog.module.scss';

interface CommentDialogProps {
  post: any,
  open: boolean,
  onClose: () => void,
}
const CommentDialog = ({ post, open, onClose }: CommentDialogProps) => {
  return (
    <Dialog 
      open={open}
      fullWidth
      onClose={onClose}
      classes={{
        paper: classes.Dialog,
      }}
    >
      <DialogTitle disableTypography>
        <Typography
          variant="h5"
          color="textPrimary"
          className={classes.Dialog_Title}
        >
          Add Comment
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={classes.Dialog_Subtitle}
        >
          on <span>{post.title}</span>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <CommentForm post={post} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog;
