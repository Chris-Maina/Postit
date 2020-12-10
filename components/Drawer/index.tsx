import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import clsx from 'clsx';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import useTheme from '@material-ui/core/styles/useTheme';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import NavItem from '../NavItem';
import classes from './Drawer.module.scss';
import { useAuthContext } from '../../helpers/authHelpers';

const AppDrawer = (props) => {
  const [open, setOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const theme = useTheme();
  const router = useRouter();
  const { user, token, fetchUser, logout, getToken } = useAuthContext();

  useEffect(() => {
    // called when the storage is changed by a different window
    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, []);

  /**
   * Logouts a user in all logged in browser tabs
   * @param evt
   * @returns void
   */
  const syncLogout = (evt) => {
    if (evt.key === 'logout') {
      router.push('/login');
    }
  };

  useEffect(() => {
    getToken();
    if (token && !user) {
      fetchUser();
    }
  }, [token, user]);

  const handleToggleClick = () => {
    setProfileOpen(!profileOpen);
  };

  return (
    <div className={classes.Root}>
      <AppBar
        position="fixed"
        className={clsx(classes.AppBar, {
          [classes.AppBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            className={clsx(classes.MenuButton, open && classes.Hide)}
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
        className={classes.Drawer}
        classes={{
          paper: classes.DrawerPaper,
        }}
      >
        <div className={classes.DrawerHeader}>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <NavItem linkTo="/" linkText="Posts" />
          <NavItem linkTo="/users" linkText="Users" />
        </List>
        {user && Object.values(user).length ? (
          <List dense className={classes.BottomNav}>
            <ListItem button onClick={handleToggleClick}>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              <ListItemIcon>
                {profileOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
            </ListItem>
            <Collapse in={profileOpen} timeout="auto" unmountOnExit>
              <List dense component="div" disablePadding>
                <NavItem linkTo="/profile" linkText="Profile" />
                <ListItem button onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        ) : (
          <List dense className={classes.BottomNav}>
            <NavItem linkTo="/login" linkText="Login" />
            <NavItem linkTo="/register" linkText="Register" />
          </List>
        )}
      </Drawer>
      <div
        className={clsx(classes.Content, {
          [classes.ContentShift]: open,
        })}
      >
        <main>
          <div className={classes.DrawerHeader} />
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default AppDrawer;
