import Link from 'next/link';
import ListItem  from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import classes from './NavItem.module.scss';

const NavItem = ({linkText, linkTo}) => {
  return (
    <ListItem button>
      <ListItemText>
        <Link href={linkTo}>
          <a className={classes.Item_Link}>{linkText}</a>
        </Link>
      </ListItemText>
    </ListItem>
  )
}

export default NavItem;