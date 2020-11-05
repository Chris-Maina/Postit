import React from 'react';
import RegisterForm from '../../containers/RegisterForm';

import classes from './Register.module.scss';

const Register = () => {
  return (
    <div className={classes.Register}>
      <RegisterForm />
    </div>
  );
}

export default Register;