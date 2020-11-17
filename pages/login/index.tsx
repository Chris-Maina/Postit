import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LoginForm from '../../containers/LoginForm';
import classes from '../register/Register.module.scss';

const Register = () => {
  return (
    <div className={classes.Register}>
      <Paper className={classes.Register_Wrapper}>
        <Typography
          variant="h4"
          color="textPrimary"
          className={classes.Register_Title}
        >
          Postit
        </Typography>
        <LoginForm />
      </Paper>
    </div>
  );
}

export default Register;