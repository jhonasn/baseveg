import React, { useState } from 'react'
import clsx from 'clsx'
import { useHistory, Link } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Drawer from '@material-ui/core/SwipeableDrawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ListIcon from '@material-ui/icons/List'
import InfoIcon from '@material-ui/icons/Info'
import LinkIcon from '@material-ui/icons/Link'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ColorizeIcon from '@material-ui/icons/Colorize'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import BrightnessLowIcon from '@material-ui/icons/Brightness4'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LinkMUI from '@material-ui/core/Link'
import SearchField from './search'
import { routes } from '../routes'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarAbove: {
    zIndex: 1201,
  },
  menuButton: {
    [theme.breakpoints.only('xs')]: {
      marginRight: 0,
    },
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
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary.main,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.only('xs')]: {
      paddingTop: theme.spacing(7),
    },
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    '&:focus': {
      outlineStyle: 'none',
    },
  },
  brandIcon: {
    float: 'left',
    [theme.breakpoints.only('xs')]: {
      width: 26,
      height: 32,
    },
    [theme.breakpoints.up('sm')]: {
      width: 33,
      height: 40,
      marginRight: theme.spacing(1),
    },
  },
  logoDrawer: {
    height: 50,
  },
  logoWordsDrawer: {
    height: 45,
  },
  versionDrawer: {
    position: 'absolute',
    top: 39,
    left: 20,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  drawerCloseButton: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  titleText: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  selectedNavItem: {
    color: theme.palette.primary.main,
  },
  selectedNavIcon: {
    color: 'inherit',
  },
}))

export default ({ children, isLightTheme, changeTheme }) => {
  // TODO: implement show recents and favorites as suggestions
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
  const [open, setOpen] = useState(false)
  const currentUrl = history.location.pathname
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

  const handleDrawerOpen = () => setOpen(true)

  const handleDrawerClose = () => setOpen(false)

  const handleChangeTheme = () => changeTheme(!isLightTheme)

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarAbove]: !isMobile,
        })}
      >
        <Toolbar>
          {isMobile && <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>}
          <LinkMUI
            className={classes.title}
            color="inherit"
            component={Link}
            to={routes.categories}
          >
            <img
              alt="logo"
              className={classes.brandIcon}
              src={`${process.env.PUBLIC_URL}/logo.svg`}
            />
            <Typography variant="h6" noWrap className={classes.titleText}>
              VegAjuda
            </Typography>
          </LinkMUI>
          <SearchField />
          <IconButton color="inherit" onClick={handleChangeTheme}>
            {isLightTheme ? <BrightnessHighIcon /> : <BrightnessLowIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disableBackdropTransition={!iOS} disableDiscovery={iOS}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <img
            alt="full logo"
            className={classes.logoDrawer}
            src={`${process.env.PUBLIC_URL}/logo.svg`}
          />
          <img
            alt="logo words"
            className={classes.logoWordsDrawer}
            src={`${process.env.PUBLIC_URL}/logo_words.svg`}
          />
          <Typography variant="caption" className={classes.versionDrawer}>
            {process.env.REACT_APP_VERSION}
          </Typography>
          <IconButton className={classes.drawerCloseButton} onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            component={Link}
            to={routes.categories}
            onClick={handleDrawerClose}
            selected={currentUrl === routes.categories}
            classes={{ selected: classes.selectedNavItem }}
          >
            <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Lista" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.favorites}
            onClick={handleDrawerClose}
            selected={currentUrl === routes.favorites}
            classes={{ selected: classes.selectedNavItem }}
          >
            <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favoritos" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.recent}
            onClick={handleDrawerClose}
            selected={currentUrl === routes.recent}
            classes={{ selected: classes.selectedNavItem }}
          >
            <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
              <RestoreIcon />
            </ListItemIcon>
            <ListItemText primary="Recentes" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.announcements}
            onClick={handleDrawerClose}
            selected={currentUrl === routes.announcements}
            classes={{ selected: classes.selectedNavItem }}
          >
            <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
              <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="Avisos" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.ingredients}
            onClick={handleDrawerClose}
            selected={currentUrl === routes.ingredients}
            classes={{ selected: classes.selectedNavItem }}
          >
            <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
              <ColorizeIcon />
            </ListItemIcon>
            <ListItemText primary="Ingredientes" />
          </ListItem>
          <ListItem
            button
            component={LinkMUI}
            href={routes.facebook}
            target="_blank"
            onClick={handleDrawerClose}
            selected={currentUrl === routes.facebook}
            classes={{ selected: classes.selectedNavItem }}
          >
              <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary="Facebook" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.download}
            onClick={handleDrawerClose}
            selected={currentUrl === routes.download}
            classes={{ selected: classes.selectedNavItem }}
          >
            <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
              <CloudDownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Baixar" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={Link}
            to={routes.about}
            onClick={handleDrawerClose}
            selected={currentUrl === routes.about}
            classes={{ selected: classes.selectedNavItem }}
          >
            <ListItemIcon classes={{ root: classes.selectedNavIcon }}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Sobre" secondary="About" />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={classes.content}
      >
        {children}
      </main>
    </div>
  )
}
