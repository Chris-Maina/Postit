import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import CommentForm from '../../containers/CommentForm';
import classes from './CommentDialog.module.scss';

interface CommentDialogProps {
  post: any;
  open: boolean;
  comment: any;
  editCommentMode: boolean;
  onClose: () => void;
}
const CommentDialog = ({
  post,
  open,
  onClose,
  comment,
  editCommentMode
}: CommentDialogProps) => {
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
          {editCommentMode ? 'Edit': 'Add'} Comment
        </Typography>
        {post?.title ? (
          <Typography
            variant="subtitle1"
            color="textSecondary"
            className={classes.Dialog_Subtitle}
          >
            on <span>{post.title}</span>
          </Typography>
        ): null}
      </DialogTitle>
      <DialogContent>
        <CommentForm
          post={post}
          commentProp={comment}
          editMode={editCommentMode}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog;
