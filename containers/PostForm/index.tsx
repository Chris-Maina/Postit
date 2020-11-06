import { useState } from "react";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import InputBase from "@material-ui/core/InputBase";
import FormHelperText from '@material-ui/core/FormHelperText';

import Api from '../../helpers/apiHelpers';
import classes from './PostForm.module.scss';
import { useAuthContext } from "../../helpers/authHelpers";


const PostForm = () => {

  const { user } = useAuthContext();
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    setTitle(value);
  }

  const onSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    try {
      await Api.addPost({ title, created_by: user.id });
      setTitle("");
    } catch (error) {
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not add your post. Try again');
      }
    }
  }


  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <FormHelperText error={!!error}>{error}</FormHelperText>
        <InputBase 
          required
          multiline
          fullWidth
          rowsMin={2}
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Write your post here"
        />
      </FormControl>
      <Button 
        type="submit"
        variant="contained"
        classes={{
          root: classes.Form_Button_Root
        }}
        className={classes.Form_Button}
      >
        Add post
      </Button>
    </form>
  )
}

export default PostForm;
