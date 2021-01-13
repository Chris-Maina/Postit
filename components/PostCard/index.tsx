import React, { useState } from 'react';
import { format } from 'date-fns';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ChatBubbleOutlinedIcon from '@material-ui/icons/ChatBubbleOutlined';

import classes from './PostCard.module.scss';
import {
  hasVoted,
  getVoteCount,
  getUserInitial,
  getUserFullname,
} from '../../helpers/postHelpers';
import CommentCard from '../CommentCard';
import { IComment, IPost, IUser } from '../../common/interfaces';
interface IPostCard {
  post: IPost;
  user: IUser;
  onEdit?: (post: IPost) => void;
  onVote?: (postId: number, vote_type: string) => void;
  onDelete?: (post: IPost) => void;
  onComment?: (post: IPost) => void;
  onEditComment?: (comment: IComment) => void;
  onDeleteComment?: (comment: IComment) => void;
  isProfile?: boolean;
}

const PostCard = ({
  post,
  user,
  onEdit,
  onVote,
  onDelete,
  onComment,
  isProfile,
  onEditComment,
  onDeleteComment,
}: IPostCard) => {

  const [viewComments, setViewComments] = useState<boolean>(false);
  const postAuthor = post?.posted_by;
  const vote = user && Object.values(user).length ? hasVoted(post, user) : null;
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar>{getUserInitial(postAuthor)}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Typography className={classes.Item_Author} component="span">
                {getUserFullname(postAuthor)}
              </Typography>
              <Typography
                component="span"
                variant="caption"
                color="textSecondary"
              >
                {format(new Date(post.created_at), 'dd MMM yyyy')}
              </Typography>
            </>
          }
          secondary={
            <>
              <Typography color="textPrimary">{post.title}</Typography>
              <div>
                <IconButton
                  aria-label="thumb-up"
                  size="small"
                  disabled={isProfile}
                  onClick={() => onVote(post.id, '1')}
                >
                  {vote && vote.vote_type === '1' ? (
                    <ThumbUpIcon />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}
                </IconButton>
                <span className={classes.Item_Votes}>{getVoteCount(post)}</span>
                <IconButton
                  size="small"
                  disabled={isProfile}
                  aria-label="thumb-down"
                  onClick={() => onVote(post.id, '-1')}
                >
                  {vote && vote.vote_type === '-1' ? (
                    <ThumbDownIcon />
                  ) : (
                    <ThumbDownOutlinedIcon />
                  )}
                </IconButton>
              </div>
              {post?.comments?.length ? (
                <div className={classes.Item_Comments} onClick={() => setViewComments(!viewComments)}>
                  View comments
                </div>
              ): null}
            </>
          }
        />
        {!isProfile && (
          <ListItemSecondaryAction>
            <IconButton
              size="small"
              aria-label="comment"
              onClick={() => onComment(post)}
            >
              <ChatBubbleOutlinedIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onEdit(post)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(post)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Collapse in={viewComments} timeout="auto" unmountOnExit>
        {
          post?.comments?.length ? (
            <List dense component="div" disablePadding>
              {post.comments.map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  variant="body2"
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                  className={classes.Item_Comment}
                />
              ))}
            </List>
          )
          : null
        }
        
      </Collapse>
      <Divider variant="inset" component="li" />
    </>
  );
};

PostCard.defultProps = {
  isProfile: false,
};

export default PostCard;
