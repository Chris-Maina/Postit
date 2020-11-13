import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import LoginForm from '../../containers/LoginForm';

const LoginDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog;
