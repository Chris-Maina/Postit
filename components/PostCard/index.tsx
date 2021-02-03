import React, { useState } from 'react';
import Head from 'next/head';
import { format } from 'date-fns';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/EditOutlined';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import classes from './PostCard.module.scss';
import {
  hasVoted,
  getVoteCount,
  getUserInitial,
  getUserFullname,
} from '../../helpers/postHelpers';
import CommentCard from '../CommentCard';
import { getPostSchema } from '../../common/jsonLdSchema';
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
  const ACTIONS = [
    {
      icon: <EditIcon fontSize="small" className={classes.Item_Action_Icon} />,
      name: 'Edit',
      onClick: (post) => {
        onEdit(post);
        handleClose();
      } 
    },
    {
      icon: <DeleteIcon fontSize="small" className={classes.Item_Action_Icon} />,
      name: 'Delete',
      onClick: (post) => {
        onDelete(post);
        handleClose();
      } 
    }
  ]
  const [viewComments, setViewComments] = useState<boolean>(false);
  const [actionsAnchor, setActionsAnchor] = useState<null | HTMLElement>(null);

  // the author can be one who posted or logged in user in his/her profile
  const postAuthor = post?.posted_by || user;
  const vote = user && Object.values(user).length ? hasVoted(post, user) : null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionsAnchor(event.currentTarget);
  }

  const handleClose = () => {
    setActionsAnchor(null);
  }
  return (
    <>
      <Head>
        <script
          key={post.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getPostSchema(post, postAuthor)) }}
        />
      </Head>
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
                  aria-label="chat bubble"
                  size="small"
                  onClick ={() => {
                    onComment(post);
                    handleClose();
                  }} 
                >
                  <ChatBubbleOutlineIcon fontSize="small" />
                </IconButton>
                <span className={classes.Item_Votes}>{post?.comments?.length || 0}</span>
                <IconButton
                  aria-label="thumb-up"
                  size="small"
                  disabled={isProfile}
                  onClick={() => onVote(post.id, '1')}
                >
                  {vote && vote.vote_type === '1' ? (
                    <ThumbUpIcon fontSize="small" />
                  ) : (
                      <ThumbUpOutlinedIcon fontSize="small" />
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
        {(!isProfile && user?.id === post?.posted_by?.id) ? (
          <ListItemSecondaryAction>
            <IconButton
              size="small"
              aria-label="comment"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              keepMounted
              onClose={handleClose}
              anchorEl={actionsAnchor}
              open={Boolean(actionsAnchor)}
            >
              {
                ACTIONS.map(action => (
                  <MenuItem
                      dense
                      key={action.name}
                      className={classes.Item_Action}
                      onClick={() => action.onClick(post)}
                    >
                      {action.icon}
                      {action.name}
                    </MenuItem>
                ))
              }
            </Menu>
          </ListItemSecondaryAction>
        ): null}
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
                  user={user}
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
