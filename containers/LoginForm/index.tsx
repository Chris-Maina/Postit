import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useAuthContext } from '../../helpers/authHelpers';
import classes from '../RegisterForm/RegisterForm.module.scss';
import { validateReguired, validateEmail, validateMinLength } from '../../helpers/formUtils';

interface IFormData {
  email: string,
  password: string
}
interface IErrors {
  email?: string,
  password?: string
}

const LoginForm = () => {
  const initialState = {
    email: '',
    password: ''
  }
  const [errors, setErrors] = useState<IErrors>({});
  const [formData, setFormData] = useState<IFormData>(initialState);
  const { loading, error, login } = useAuthContext()

  const validate = () => {
    const errors = {};
    const fields = ['email', 'password'];
    fields.forEach(field => {
      let error = validateReguired(formData[field]);
      if (error) {
        errors[field] = error;
      }

      if (field === 'email') {
        error = validateEmail(formData.email);
        if (error) {
          errors[field] = error;
        }
      }

      if (field === 'password') {
        error = validateMinLength(formData[field], 8);
        if (error) {
          errors[field] = error;
        }
      }
    })

    return errors;
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    setErrors(prevData => ({
      ...prevData,
      [name]: ''
    }))
  } 

  const onSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const errors = validate();

    if (Object.values(errors).length) {
      setErrors(errors);
    } else {
      login(formData);
    }

  }

  return (
    <form onSubmit={onSubmit} className={classes.Form}>
      <FormHelperText error={!!error}>{error}</FormHelperText>

      <FormControl margin="dense" className={classes.Form_Control}>
        <label>Email</label>
        <OutlinedInput onChange={onChange} type="email" name="email" value={formData.email} required />
        <FormHelperText error={!!errors.email}>{errors.email}</FormHelperText>
      </FormControl>
      <FormControl margin="dense" className={classes.Form_Control}>
        <label>Password</label>
        <OutlinedInput onChange={onChange} type="password" name="password" value={formData.password} required />
        <FormHelperText error={!!errors.password}>{errors.password}</FormHelperText>
      </FormControl>
      <div className={classes.Form_Button}>
        {loading ? <CircularProgress /> : <Button type="submit" variant="contained"  color="primary" fullWidth>Login</Button>}
      </div>
    </form>
  )
}

export default LoginForm;
