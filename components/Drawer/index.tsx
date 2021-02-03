import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import clsx from 'clsx';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
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

import NavItem from '../NavItem';
import classes from './Drawer.module.scss';
import useViewPort from '../../helpers/useViewPort';
import { useAuthContext } from '../../helpers/authHelpers';
import { getBreadcrumbListSchema } from '../../common/jsonLdSchema';

const AppDrawer = (props) => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const theme = useTheme();
  const router = useRouter();
  const { width } = useViewPort();
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
    if (token && (!user || !user.posts)) {
      fetchUser();
    }
  }, [token, user]);

  const handleToggleClick = () => {
    setProfileOpen(!profileOpen);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  }

  let pageName = 'Posts'
  if (router.pathname !== '/') {
    pageName = router.pathname.charAt(1).toUpperCase() + router.pathname.slice(2)
  }
  const title = `Posit - ${pageName}`;
  const url = `https://postit.chris-maina.vercel.app${router.pathname}`;

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbListSchema()) }}
        />
      </Head>
      <NextSeo
        title={title}
        canonical={url}
        openGraph={{
          url,
          title,
        }}
        noindex={pageName === 'Profile'}
      />
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
        <nav className={classes.Drawer}>
          <Hidden
            smUp={width < 600} // small screen devices
            xsDown={width > 600} // large screen devices
            implementation="css"
          >
            <Drawer
              open={width < 600 ? open : true}
              classes={{
                paper: classes.DrawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              onClose={handleDrawerToggle}
              variant={width < 600 ? "temporary" : "persistent"}
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            >
              <div className={classes.DrawerHeader}>
                <img src="/favicons/favicon-32x32.png" alt="logo" />
                <Typography
                  noWrap
                  variant="h6"
                  color="primary"
                  className={classes.DrawerHeader_Logo}
                >
                  Postit
                </Typography>
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
          </Hidden>
        </nav>
        <div className={classes.Content}>
          <main>
            <div className={classes.DrawerHeader} />
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AppDrawer;
