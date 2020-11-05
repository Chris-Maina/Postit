import React from 'react';
import LoginForm from '../../containers/LoginForm';

import classes from '../register/Register.module.scss';

const Register = () => {
  return (
    <div className={classes.Register}>
      <LoginForm />
    </div>
  );
}

export default Register;