import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { GetStaticProps } from 'next';
import List from '@material-ui/core/List';
import LoginDialog from '../components/LoginDialog';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';

import Api from '../helpers/apiHelpers';
import AppDrawer from '../components/Drawer';
import PostForm from '../containers/PostForm';
import PostCard from '../components/PostCard';
// import styles from '../styles/Home.module.css';
import { useAuthContext } from '../helpers/authHelpers';

export default function Home({ posts }) {
  const { user } = useAuthContext();
  const [post, setPost] = useState({});
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { data, error: postsErr } = useSWR('/posts', Api.fetcher, { initialData: posts })


  const onEditClick = post => {
    if (!Object.keys(user).length) {
      setOpen(true)
    } else {
      setPost(post);
    }
  }

  const onCancelClick = () => {
    setPost({});
  }

  const onDeleteClick = postId => {
    if (!Object.keys(user).length) {
      setOpen(true)
    } else {
      try {
        Api.deletePost(postId);
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
                onEdit={onEditClick}
                onDelete={onDeleteClick}
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
      posts: res.data,
    },
  }
}
