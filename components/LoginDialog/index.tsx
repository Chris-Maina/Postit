import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import LoginForm from '../../containers/LoginForm';
import classes from './LoginDialog.module.scss';

const LoginDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open}
      onClose={onClose}
      classes={{
        paper: classes.Dialog
      }}
    >
      <DialogTitle>
        <Typography
          variant="h4"
          color="textPrimary"
          className={classes.Dialog_Title}
        >
          Postit
        </Typography>
        <CloseIcon
          onClick={onClose}
          aria-label="close"
          className={classes.Dialog_CloseBtn}
        />
      </DialogTitle>
      <DialogContent>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog;
