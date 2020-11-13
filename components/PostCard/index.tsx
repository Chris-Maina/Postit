import { format } from 'date-fns';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from "@material-ui/icons/Edit";
import Divider from '@material-ui/core/Divider';
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import classes from './PostCard.module.scss';
import { getUserInitial, getUserFullname, hasVoted, getVoteCount } from '../../helpers/postHelpers';

const PostCard = ({ 
    post,
    user,
    onEdit,
    onVote,
    onDelete,
  }) => {
  const vote = hasVoted(post, user);
  return (
    <>
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          {getUserInitial(post.posted_by)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText 
        primary={
          <>
            <Typography
              className={classes.Item_Author}
              component="span"
            >
              {getUserFullname(post.posted_by)}
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
                  onClick={() => onVote(post.id, '1')}
                >
                  {vote && vote.vote_type === '1' ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                </IconButton>
                <span className={classes.Item_Votes}>{getVoteCount(post)}</span>
                <IconButton
                  aria-label="thumb-down"
                  size="small"
                  onClick={() => onVote(post.id, '-1')}
                >
                  {vote && vote.vote_type === '-1' ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
                </IconButton>
              </div>
            </>
          }
        />
      <ListItemSecondaryAction>
        <IconButton size="small" onClick={() => onEdit(post)}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(post.id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider variant="inset" component="li" />
    </>
  )
}

export default PostCard;
