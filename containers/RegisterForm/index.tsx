import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import classes from './RegisterForm.module.scss';
import { useAuthContext } from '../../helpers/authHelpers';
import { validateEmail, validateMinLength, validateReguired } from '../../helpers/formUtils';

interface IFormData {
  firstName?: string,
  email: string,
  lastName?: string,
  password: string,
  confirmPassword?: string
}

interface IFormErrors {
  firstName?: string,
  email?: string,
  lastName?: string,
  password?: string,
  confirmPassword?: string
}
const RegisterForm = () => {
  const initialState = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  }
  const [errors, setErrors] = useState<IFormErrors>({});
  const [formData, setFormData] = useState<IFormData>(initialState);
  const { loading, error, register } = useAuthContext();

  const validate = () => {
    const errors = {};
    const fields = ['firstName', 'email', 'password', 'confirmPassword'];
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

      if (field === 'password' || field === 'confirmPassword') {
        error = validateMinLength(formData[field], 8);
        if (error) {
          errors[field] = error;
        }
      }
    })

    if (formData.password !== formData.confirmPassword) {
      errors['confirmPassword'] = 'Passwords do not match';
    }

    return errors;
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevState => ({
      ...prevState,
      [name]: ''
    }));
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();

    if (Object.values(errors).length) {
      setErrors(errors);
    } else {
      // register
      register(formData);
    }
  }
  return (
    <form onSubmit={onSubmit} className={classes.Form}>
      <FormHelperText error={!!error}>{error}</FormHelperText>
      <FormControl margin="dense" className={classes.Form_Control}>
        <label>First name</label>
        <OutlinedInput onChange={onChange} type="text" name="firstName" value={formData.firstName} required />
        <FormHelperText error={!!errors.firstName}>{errors.firstName}</FormHelperText>
      </FormControl>
      <FormControl margin="dense" className={classes.Form_Control}>
        <label>Last name</label>
        <OutlinedInput onChange={onChange} type="text" name="lastName" value={formData.lastName} />
      </FormControl>
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
      <FormControl margin="dense" className={classes.Form_Control}>
        <label>Confrim password</label>
        <OutlinedInput onChange={onChange} type="password" name="confirmPassword" value={formData.confirmPassword} required />
        <FormHelperText error={!!errors.confirmPassword}>{errors.confirmPassword}</FormHelperText>
      </FormControl>
      <div className={classes.Form_Button}>
        {loading ? <CircularProgress /> : <Button type="submit" variant="contained"  color="primary" fullWidth>Register</Button>}
      </div>
    </form>
  )
}

export default RegisterForm;