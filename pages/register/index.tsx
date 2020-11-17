import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import RegisterForm from '../../containers/RegisterForm';

import classes from './Register.module.scss';

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
        <RegisterForm />
      </Paper>
    </div>
  );
}

export default Register;