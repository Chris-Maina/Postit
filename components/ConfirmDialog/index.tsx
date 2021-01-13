import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import classes from './ConfirmDialog.module.scss';

interface ConfirmDialogProps {
  open: boolean,
  title: string,
  onClose: () => void,
  onSuccess: () => void,
  children: React.ReactChild
}

const ConfirmDialog = ({ open, title, children, onClose, onSuccess }: ConfirmDialogProps) => {
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
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          color="secondary"
          variant="contained"
          onClick={onSuccess}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog;
