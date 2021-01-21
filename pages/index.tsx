import React, { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { GetStaticProps } from 'next';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import LoginDialog from '../components/LoginDialog';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import Api from '../helpers/apiHelpers';
import classes from './Index.module.scss';
import AppDrawer from '../components/Drawer';
import PostForm from '../containers/PostForm';
import PostCard from '../components/PostCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuthContext } from '../helpers/authHelpers';
import CommentDialog from '../components/CommentDialog';

export default function Home({ posts }) {
  const { user, token, isLoggedIn } = useAuthContext();
  const [post, setPost] = useState <{[x: string]: any}>({});
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [comment, setComment] = useState<{ [x: string]: any }>({});
  const [editCommentMode, setEditCommentMode] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const { data, error: postsErr } = useSWR('/posts', Api.fetcher, {
    initialData: posts,
  });

  useEffect(() => {
    // Close dialog after successful login
    if (open && isLoggedIn()) {
      setOpen(false);
    }
  }, [token]);

  const onEditClick = (post) => {
    if (!isLoggedIn()) {
      setOpen(true);
    } else {
      setPost(post);
      setEditMode(true);
    }
  };

  const onCancelClick = () => {
    setPost({});
    editMode && setEditMode(false);
  };

  const openLoginDialog = () => {
    setOpen(true);
  };

  const onDeleteSuccess = () => {
    try {
      Api.deletePost({ postId: post.id, token });
      if (error) {
        setError('');
      }

      // Update cache and not revalidate
      mutate(
        '/posts',
        data.filter((el) => el.id !== post.id),
        false
      );
    } catch (error) {
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not delete your post');
      }
    }
    onDeleteClose();
  }

  const onDeleteClose = () => {
    setIsConfirmOpen(false);
    setPost({});
  }

  const onDeleteClick = (post) => {
    if (!isLoggedIn()) {
      setOpen(true);
    } else {
      // Set edit mode to false if it is active
      editMode && setEditMode(false);
      setIsConfirmOpen(true);
      setPost(post);
    }
  };

  const upvoteOrDownVote = async (postId, voteType) => {
    if (!isLoggedIn()) {
      setOpen(true);
    } else {
      try {
        await Api.vote({
          post_id: postId,
          vote_type: voteType,
          token,
        });
        mutate('/posts');
      } catch (error) {
        if (error.response && error.response.data.error.message) {
          setError(error.response.data.error.message);
        } else {
          setError('Could not complete your request');
        }
      }
    }
  };

  const onCommentClick = (post) => {
    if (!isLoggedIn()) {
      setOpen(true);
    } else {
      // Set edit mode to false if it is active
      editMode && setEditMode(false);
      setIsCommentOpen(true);
      setPost(post);
    }
  }

  const onCommentClose = () => {
    setIsCommentOpen(false);
    setComment({});
    editCommentMode && setEditCommentMode(false);
  }

  const onEditComment = comment => {
    setEditCommentMode(true);
    setComment(comment);
    setIsCommentOpen(true);
  }
  const onDeleteComment = comment => {
    setComment(comment);
    setIsConfirmOpen(true);
  }

  const onDeleteCommentSuccess = async () => {
   try {
      if (error) {
        setError('');
      }

      await Api.deleteComment({ id: comment.id, token });
      mutate('/posts');
   } catch (error) {
     if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not delete your comment');
      }
   }
    onDeleteCommentClose();
  }

  const onDeleteCommentClose = () => {
    setComment({});
    setIsConfirmOpen(false);
  }

  const onConfirmDialogSuccess = () => {
    if (Object.keys(comment).length) {
      onDeleteCommentSuccess();
    } else {
      onDeleteSuccess();
    }
  }

  const onConfirmDialogClose = () => {
    if (Object.keys(comment).length) {
      onDeleteCommentClose();
    } else {
      onDeleteClose();
    }
  }
  let confirmDialogTitle = 'Delete post';
  let confirmDialogContent = post.title;
  if (isConfirmOpen && Object.keys(comment).length) {
    confirmDialogTitle = 'Delete comment';
    confirmDialogContent = comment.title;
  }

  if (!data)
    return (
      <AppDrawer>
        <FormHelperText error={!!error || !!postsErr}>
          {error || postsErr}
        </FormHelperText>
        <PostForm
          post={post}
          editMode={editMode}
          onCancel={onCancelClick}
          openLoginDialog={openLoginDialog}
        />
        <CircularProgress className={classes.loader} />
      </AppDrawer>
    );

  return (
    <AppDrawer>
      <FormHelperText error={!!error || !!postsErr}>
        {error || postsErr}
      </FormHelperText>
      <PostForm
        post={post}
        editMode={editMode}
        onCancel={onCancelClick}
        openLoginDialog={openLoginDialog}
      />
      {data && !data.length ? (
        <List>
          <ListItem>
            <ListItemText
              disableTypography
              primary={
                <Typography variant="h4">
                  There are no posts currently.{' '}
                  <span role="img" aria-label="writing hand">
                    ✍️
                  </span>{' '}
                  it!
                </Typography>
              }
            />
          </ListItem>
        </List>
      ) : (
        <List>
          {data?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              onEdit={onEditClick}
              onDelete={onDeleteClick}
              onComment={onCommentClick}
              onVote={upvoteOrDownVote}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </List>
      )}
      <LoginDialog open={open} onClose={() => setOpen(false)} />
      <ConfirmDialog
        open={isConfirmOpen}
        title={confirmDialogTitle}
        onClose={onConfirmDialogClose}
        onSuccess={onConfirmDialogSuccess}
      >
        <div>You are about to delete <span className={classes.postTitle}>{confirmDialogContent}</span></div>
      </ConfirmDialog>
      <CommentDialog
        post={post}
        open={isCommentOpen}
        comment={comment}
        onClose={onCommentClose}
        editCommentMode={editCommentMode}
      />
    </AppDrawer>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const res = await Api.getPosts();
  return {
    revalidate: 1,
    props: {
      posts: res.data || [],
    },
  };
};
