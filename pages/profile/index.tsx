import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import Api from '../../helpers/apiHelpers';
import classes from './Profile.module.scss';
import AppDrawer from '../../components/Drawer';
import { IUser } from '../../common/interfaces';
import PostCard from '../../components/PostCard';
import { getUserInitial } from '../../helpers/postHelpers';
import { useAuthContext } from '../../helpers/authHelpers';
import {
  validateEmail,
  validateMinLength,
  validateReguired,
} from '../../helpers/formUtils';

interface IFormErrors {
  first_name?: string;
  email?: string;
  last_name?: string;
  current?: string;
  new?: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<IUser>({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
  });
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<IFormErrors>({
    first_name: '',
    last_name: '',
    email: '',
    current: '',
    new: '',
  });
  const { user, token, fetchUser, updateUser } = useAuthContext();

  useEffect(() => {
    if (!user || !Object.values(user).length) {
      fetchUser();
    } else {
      setUserData(user);
    }
  }, [user]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;

    if (name === 'new' || name === 'current') {
      setPasswords((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateGeneralInfo = () => {
    const errors = {};

    const firstNameErr = validateReguired(userData.first_name);
    const lastNameErr = validateReguired(userData.last_name);

    let emailErr = validateReguired(userData.email);
    if (!emailErr) {
      emailErr = validateEmail(userData.email);
    }

    if (firstNameErr && lastNameErr) {
      errors['last_name'] = 'Provide either a first or last name';
    }
    if (emailErr) {
      errors['email'] = emailErr;
    }
    return errors;
  };

  const validatePasswords = () => {
    const passwordErrors = {};
    const fields = ['current', 'new'];

    fields.forEach((field) => {
      let error = validateReguired(passwords[field]);
      if (error) {
        passwordErrors[field] = error;
      }
      error = validateMinLength(passwords[field], 8);
      if (error) {
        passwordErrors[field] = error;
      }
    });
    return passwordErrors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateGeneralInfo();

    if (Object.values(errors).length) {
      setErrors(errors);
    } else {
      // update user information
      const payload = {
        ...userData,
        token,
      };
      updateUser(payload);
    }
  };

  const onPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePasswords();
    if (Object.values(errors).length) {
      setErrors(errors);
    } else {
      // reset password
      try {
        await Api.resetPassord({ email: user.email, password: passwords.new });
      } catch (error) {
        if (error.response && error.response.data.error.message) {
          setApiError(error.response.data.error.message);
        } else {
          setApiError('Could not reset password. Try again');
        }
      }
    }
  };

  if (!user || !Object.values(user).length) {
    return <CircularProgress />;
  }

  return (
    <AppDrawer>
      <FormHelperText error={!!apiError}>{apiError}</FormHelperText>
      <div className={classes.Section}>
        <h2>General Information</h2>
        <div className={classes.Section_General}>
          <Avatar className={classes.Section_Avatar}>
            {getUserInitial(user)}
          </Avatar>
          <form
            className={clsx(classes.Section_Form, classes.Section_General_Form)}
            onSubmit={onSubmit}
          >
            <FormControl margin="dense">
              <label className={classes.Section_Form_Label}>FIRST NAME</label>
              <OutlinedInput
                onChange={onChange}
                type="text"
                name="first_name"
                value={userData.first_name}
              />
              <FormHelperText error={!!errors.first_name}>
                {errors.first_name}
              </FormHelperText>
            </FormControl>
            <FormControl margin="dense">
              <label className={classes.Section_Form_Label}>LAST NAME</label>
              <OutlinedInput
                onChange={onChange}
                type="text"
                name="last_name"
                value={userData.last_name}
              />
              <FormHelperText error={!!errors.last_name}>
                {errors.last_name}
              </FormHelperText>
            </FormControl>
            <FormControl margin="dense">
              <label className={classes.Section_Form_Label}>EMAIL</label>
              <OutlinedInput
                onChange={onChange}
                type="email"
                name="email"
                value={userData.email}
                required
              />
              <FormHelperText error={!!errors.email}>
                {errors.email}
              </FormHelperText>
            </FormControl>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.Section_Form_Button}
                classes={{
                  root: classes.Section_Form_Button_Root,
                }}
              >
                SAVE
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className={classes.Section}>
        <h2>Password Change</h2>
        <form className={classes.Section_Form} onSubmit={onPasswordSubmit}>
          <FormControl margin="dense">
            <label className={classes.Section_Form_Label}>
              CURRENT PASSWORD
            </label>
            <OutlinedInput
              onChange={onChange}
              type="password"
              name="current"
              value={passwords.current}
              required
            />
            <FormHelperText error={!!errors.current}>
              {errors.current}
            </FormHelperText>
          </FormControl>
          <FormControl margin="dense">
            <label className={classes.Section_Form_Label}>NEW PASSWORD</label>
            <OutlinedInput
              onChange={onChange}
              type="password"
              name="new"
              value={passwords.new}
              required
            />
            <FormHelperText error={!!errors.new}>{errors.new}</FormHelperText>
          </FormControl>
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.Section_Form_Button}
              classes={{
                root: classes.Section_Form_Button_Root,
              }}
            >
              SAVE
            </Button>
          </div>
        </form>
      </div>
      <div className={classes.Section}>
        <h2>Posts</h2>
        <List dense>
          {user.posts && user.posts.length ? (
            user.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                isProfile={true}
              />
            ))
          ) : (
            <ListItem disableGutters>
              <ListItemText>You have no posts</ListItemText>
            </ListItem>
          )}
        </List>
      </div>
    </AppDrawer>
  );
};

export default Profile;
