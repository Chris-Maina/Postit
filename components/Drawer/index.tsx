import { useState, useEffect } from "react";
import clsx from "clsx";
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from "@material-ui/core/Divider";
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import useTheme from '@material-ui/core/styles/useTheme';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import makeStyles from '@material-ui/core/styles/makeStyles';
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import NavItem from "../NavItem";
import { useAuthContext } from "../../helpers/authHelpers";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['martin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
   display: 'none', 
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    padding: `${theme.spacing(3)} 0px`,
    transition: theme.transitions.create('margin', { 
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  bottomNav: {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
  },
}));

const AppDrawer = (props) => {
  const [open, setOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const theme = useTheme();
  const classes = useStyles();
  const { user, fetchUser, logout } = useAuthContext();
  useEffect(() => {
    if (!Object.keys(user).length) {
      fetchUser();
    }
  }, [user]);

  const handleToggleClick = () => {
    setProfileOpen(!profileOpen);
  }


  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Postit
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <NavItem linkTo="/" linkText="Posts" />
          <NavItem linkTo="/users" linkText="Users" />
        </List>
        {Object.keys(user).length ? (
          <List className={classes.bottomNav}>
            <ListItem button onClick={handleToggleClick}>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              <ListItemIcon>
                {profileOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />} 
              </ListItemIcon>
            </ListItem>
            <Collapse in={profileOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <NavItem linkTo="/profile" linkText="Profile" />
                <ListItem button onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        ) : (
          <List className={classes.bottomNav}>
            <NavItem linkTo="/login" linkText="Login" />
          </List>
        )}
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <main>
          <div className={classes.drawerHeader} />
          {props.children}
        </main>
      </div>
    </div>
  );
}

export default AppDrawer;