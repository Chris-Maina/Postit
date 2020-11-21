import { IUser } from '../common/interfaces';

export const getUserInitial = (user: IUser): string => {
  if (user.first_name) {
    return user.first_name[0].toUpperCase();
  } else {
    return user.email[0].toUpperCase();
  }
}

export const getUserFullname = (user: IUser): string => {
  if (user.first_name && !user.last_name) {
    return user.first_name;
  }
  if (!user.first_name && user.last_name) {
    return user.last_name;
  }
  return `${user.first_name} ${user.last_name}`;
}


export const hasVoted = (post, user) => {
  if (!Object.values(user).length || !Object.keys(post).length) return null;
  if (!post.votes || !post.votes.length) return null;
  return post.votes.reverse().find(vote => vote.user_id === user.id);
}

export const getVoteCount = post => {
  if (!Object.keys(post).length || !post.votes || !post.votes.length) return 0;
  return post.votes.reduce((acc, next) => {
    acc += parseInt(next.vote_type, 10);
    return acc;
  }, 0);
}
