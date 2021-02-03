import { getUpDownVoteCount, getUserFullname } from '../helpers/postHelpers';

export const getPostSchema = (post, author) => {
  let count = getUpDownVoteCount(post)
  return {
    '@context': 'http://schema.org',
    '@type': 'Comment',
    'postition': post.id,
    'dateCreated': post.created_at,
    'headline': post.title,
    'author': getUserSchema(author),
    'upvoteCount': count.upvotes,
    'downvoteCount': count.downvotes,
    'inLanguage': 'en',
    'commentCount': post?.comments?.length || 0,
    'keywords': 'post'
  }
}

export const getCommentSchema = (comment) => ({
  '@context': 'http://schema.org',
  '@type': 'Comment',
  'dateCreated': comment.created_at,
  'headline': comment.title,
  'inLanguage': 'en',
  'postition': comment.id,
  'author': getUserSchema(comment.commented_by),
  'keywords': ['post', 'comment']
});

export const getUserSchema = user => ({
  '@type': 'Person',
  'name': getUserFullname(user),
});

export const getBreadcrumbListSchema = () => ({
  '@context': 'http://schema.org',
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "name": "Posts",
    "item": process.env.NEXT_PUBLIC_CLIENT_URL
  }, {
    "@type": "ListItem",
    "name": "Users",
    "item": `${process.env.NEXT_PUBLIC_CLIENT_URL}/users`
  }, {
    "@type": "ListItem",
    "name": "Profile",
    "item": `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile`
  }, {
    "@type": "ListItem",
    "name": "Login",
    "item": `${process.env.NEXT_PUBLIC_CLIENT_URL}/login`
  }, {
    "@type": "ListItem",
    "name": "Register",
    "item": `${process.env.NEXT_PUBLIC_CLIENT_URL}/register`
  }]
})
