import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import List from '@material-ui/core/List';
import LoginDialog from '../components/LoginDialog';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import Api from '../helpers/apiHelpers';
import AppDrawer from '../components/Drawer';
import PostForm from '../containers/PostForm';
import PostCard from '../components/PostCard';
import { useAuthContext } from '../helpers/authHelpers';

export default function Home({ posts }) {
  const { user, token, isLoggedIn } = useAuthContext();
  const [post, setPost] = useState({});
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { data, error: postsErr } = useSWR('/posts', Api.fetcher, { initialData: posts });

  const onEditClick = post => {
    if (!isLoggedIn()) {
      setOpen(true)
    } else {
      setPost(post);
    }
  }

  const onCancelClick = () => {
    setPost({});
  }

  const onDeleteClick = postId => {
    if (!isLoggedIn()) {
      setOpen(true)
    } else {
      try {
        Api.deletePost({ postId, token });
        if (error) {
          setError("");
        }
        
        // Update cache and not revalidate
        mutate('/posts', data.filter(el => el.id !== postId), false);
      } catch (error) {
        if (error.response && error.response.data.error.message) {
          setError(error.response.data.error.message);
        } else {
          setError('Could not delete your post');
        }
      }
    }
  }

  const upvoteOrDownVote = async (postId, voteType) => {
    if (!isLoggedIn()) {
      setOpen(true)
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
  }

  return (
    <AppDrawer>
      <FormHelperText error={!!error || !!postsErr}>{error || postsErr}</FormHelperText>
      <PostForm post={post} onCancel={onCancelClick} />
      {!data 
        ? (<CircularProgress />) 
        : (
          <List>
            {data?.map(post => (
              <PostCard 
                key={post.id}
                post={post}
                user={user}
                onEdit={onEditClick}
                onDelete={onDeleteClick}
                onVote={upvoteOrDownVote}
              />
            ))}
          </List>
        )
      }
      <LoginDialog open={open} onClose={() => setOpen(false)} />
    </AppDrawer>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const res = await Api.getPosts();
  return {
    revalidate: 1,
    props: {
      posts: res.data || [],
    },
  }
}
