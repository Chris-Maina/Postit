import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import FormHelperText from '@material-ui/core/FormHelperText';

import Api from '../../helpers/apiHelpers';
import classes from './PostForm.module.scss';
import { useAuthContext } from '../../helpers/authHelpers';

interface PostFormProps {
  editMode: boolean,
  onCancel: () => void,
  post: { [x: string]: any },
  openLoginDialog: () => void,
  handleSnackbarOpen: (message: string) => void,
}
const PostForm = ({ post, editMode, onCancel, openLoginDialog, handleSnackbarOpen }: PostFormProps) => {
  const { isLoggedIn, token } = useAuthContext();
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (editMode && Object.keys(post).length) {
      setTitle(post.title);
    } else {
      setTitle('');
    }
  }, [post]);

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    setTitle(value);
  };

  const onSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!isLoggedIn()) {
      openLoginDialog();
      return null;
    }
    try {
      let response = null;
      if (Object.keys(post).length) {
        response = await Api.updatePost({ id: post.id, title, token });
      } else {
        response = await Api.addPost({ title, token });
      }
      onCancelClick();
      response && handleSnackbarOpen(response.data.message);
    } catch (error) {
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not add your post. Try again');
      }
    }
  };

  const onCancelClick = () => {
    setTitle('');
    setError('');
    onCancel();
  };

  return (
    <form className={classes.Form} onSubmit={onSubmit}>
      <FormControl fullWidth>
        <FormHelperText error={!!error}>{error}</FormHelperText>
        <InputBase
          required
          multiline
          autoFocus
          rowsMin={2}
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Write your post here"
        />
      </FormControl>
      <div className={classes.Form_Button_Wrapper}>
        {(editMode && Object.keys(post).length) ? (
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onCancelClick}
            classes={{
              root: classes.Form_Button_Root,
            }}
          >
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.Form_Button}
          classes={{
            root: classes.Form_Button_Root,
          }}
        >
          {(editMode && Object.keys(post).length) ? 'Edit post' : 'Add post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
