import React from 'react';
import Link from 'next/link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LoginForm from '../../containers/LoginForm';
import classes from '../register/Register.module.scss';

const Login = () => {
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
        <Typography color="textPrimary" className={classes.Register_Caption}>
          Do not have an account?{' '}
          <Link href="/register">
            <a color="primary">Register</a>
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;
