import { format } from 'date-fns';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from "@material-ui/icons/Edit";
import Divider from '@material-ui/core/Divider';
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import classes from './PostCard.module.scss';

const PostCard = ({ post }) => {
  return (
    <>
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          {post.created_by}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={
        <>
          <Typography className={classes.Item_Author} component="span">Chris Maina</Typography>
          <Typography 
            component="span"
            variant="caption"
            color="textSecondary"
          >
              {format(new Date(post.created_at), 'dd-MM-yy')}
            </Typography>
        </>
      }
      secondary={<Typography color="textPrimary">{post.title}</Typography>} />
      <ListItemSecondaryAction>
        <IconButton size="small">
          <EditIcon />
        </IconButton>
        <IconButton size="small">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Divider variant="inset" component="li" />
    </>
  )
}

export default PostCard;
