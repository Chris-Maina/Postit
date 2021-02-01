const title = 'Postit - have fun with posts';
const description = 'Create posts, comment, upvote and downvote.';

export default {
  title,
  description,
  canonical: 'https://postit.chris-maina.vercel.app/',
  openGraph: {
    type: 'website',
    url: 'https://postit.chris-maina.vercel.app/', // canonical url
    title,
    description,
    locale: 'en_IE',
    site_name: 'Postit',
    images: [
      {
        url: 'https://postit.chris-maina.vercel.app/postit.png',
        alt: title,
      }
    ]
  }
}
