import React, { useState, useEffect } from 'react';
import { mutate } from 'swr';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';

import Api from '../../helpers/apiHelpers';
import { useAuthContext } from '../../helpers/authHelpers';
import classes from './CommentForm.module.scss';
import { IPost, IComment } from '../../common/interfaces';

interface CommentFormProps {
  post: IPost,
  commentProp?: IComment,
  onCancel: () => void,
}
const CommentForm = ({ post, onCancel, commentProp }: CommentFormProps) => {
  const { token } = useAuthContext()
  const [error, setError] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  
  useEffect(() => {
    if (Object.keys(commentProp).length) {
      setComment(commentProp.title);
    }
  }, [commentProp]);

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    setComment(value);
  }

  const onSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    try {
      if (Object.keys(commentProp).length) {
        await Api.updateComment({ ...commentProp, title: comment });
      } else {
        await Api.addComment({ title: comment, post_id: post.id, token });
      }
      onCancelClick();

      // Revalidate posts
      mutate('/posts');
    } catch (error) {
      console.log('error', error);
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not add your comment. Try again');
      }
    }
  }

  const onCancelClick = () => {
    setComment('');
    setError('');
    onCancel();
  };

  return (
    <form className={classes.Form} onSubmit={onSubmit}>
      <FormControl className={classes.Form_Control}>
        <FormHelperText error={!!error}>{error}</FormHelperText>
        <OutlinedInput
          required
          multiline
          rowsMin={2}
          name="comment"
          value={comment}
          onChange={onChange}
          placeholder="Write your comment here"
        />
      </FormControl>
      <div className={classes.Form_Actions}>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={onCancelClick}
          className={classes.Form_Button}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.Form_Button}
        >
          Add
        </Button>
      </div>
    </form>
  )
}

CommentForm.defaultProps = {
  commentProp : {}
}

export default CommentForm;
