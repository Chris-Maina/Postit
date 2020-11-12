import { IUser } from '../common/interfaces';

export const getUserInitial = (user: IUser): string => {
  if (user.first_name) {
    return user.first_name[0].toUpperCase();
  } else {
    return user.email[0].toUpperCase();
  }
}

export const getUserFullname = (user: IUser): string => 
  `${user.first_name} ${user.last_name}`


export const hasVoted = (post, user) => {
  if (!Object.keys(user).length) return false;
  if (!Object.keys(post.posted_by).length) return false;
  return post.posted_by.id === user.id;
}
