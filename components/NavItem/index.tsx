import Link from 'next/link';
import ListItem  from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const NavItem = ({linkText, linkTo}) => {
  return (
    <ListItem>
      <ListItemText>
        <Link href={linkTo}>
          <a>{linkText}</a>
        </Link>
      </ListItemText>
    </ListItem>
  )
}

export default NavItem;