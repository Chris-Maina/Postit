import { GetStaticProps } from 'next';
import Api from '../helpers/apiHelpers';
import List from '@material-ui/core/List';
import AppDrawer from '../components/Drawer';
import styles from '../styles/Home.module.css';
import PostForm from '../containers/PostForm';
import PostCard from '../components/PostCard';
import LoginDialog from '../components/LoginDialog';
import { useState } from 'react';
import { useAuthContext } from '../helpers/authHelpers';

export default function Home({ posts }) {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({});
  const [error, setError] = useState("");


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
        const response = Api.deletePost(postId);
        setError("")
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
      <PostForm post={post} onCancel={onCancelClick} />
      <List>
        {posts.map(post => (
          <PostCard 
            key={post.id}
            post={post}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
          />
        ))}
      </List>
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
