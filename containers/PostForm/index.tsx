import { mutate } from "swr";
import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import InputBase from "@material-ui/core/InputBase";
import FormHelperText from '@material-ui/core/FormHelperText';

import Api from '../../helpers/apiHelpers';
import classes from './PostForm.module.scss';
import { useAuthContext } from "../../helpers/authHelpers";


const PostForm = ({ post, onCancel }) => {

  const {isLoggedIn, token} = useAuthContext();
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (Object.keys(post).length) {
      setTitle(post.title)
    }
  }, [post])

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    setTitle(value);
  }

  const onSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    try {
      if (Object.keys(post).length) {
        await Api.updatePost({ ...post, title, token });
      } else {
        await Api.addPost({ title, token });
      }
      onCancelClick()

      // Revalidate posts
      mutate('/posts');
    } catch (error) {
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not add your post. Try again');
      }
    }
  }

  const onCancelClick = () => {
    setTitle("");
    setError("");
    onCancel();
  }


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
        <Button 
          type="submit"
          color="primary"
          variant="contained"
          disabled={!isLoggedIn()}
          className={classes.Form_Button}
          classes={{
            root: classes.Form_Button_Root
          }}
        >
          {Object.keys(post).length? 'Edit post' : 'Add post'}
        </Button>
        {Object.keys(post).length ? (
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onCancelClick}
            classes={{
              root: classes.Form_Button_Root
            }}
          >
            Cancel
          </Button>
        ): null}
      </div>
    </form>
  )
}

export default PostForm;
