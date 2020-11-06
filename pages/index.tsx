import { GetStaticProps } from 'next';
import Api from '../helpers/apiHelpers';
import List from '@material-ui/core/List';
import AppDrawer from '../components/Drawer';
import styles from '../styles/Home.module.css';
import PostForm from '../containers/PostForm';
import PostCard from '../components/PostCard';

export default function Home({ posts }) {
  return (
    <AppDrawer>
      <PostForm />
      <List>
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </List>
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
