import React, { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { useHistory, Link } from 'react-router-dom'
import { makeStyles, useTheme, fade } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import InputBase from '@material-ui/core/InputBase'
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
import SearchIcon from '@material-ui/icons/Search'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import BrightnessLowIcon from '@material-ui/icons/BrightnessLow'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import LinkMUI from '@material-ui/core/Link'
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
    justifyContent: 'flex-end',
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
  titleText: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
}))

export default ({ children, isLightTheme, changeTheme }) => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
  const [open, setOpen] = useState(false)

  const getSearchText = useCallback(() =>
    history.location.pathname.replace('/search/', ''),
  [history.location.pathname])

  const handleDrawerOpen = () => setOpen(true)

  const handleDrawerClose = () => setOpen(false)

  const handleChangeTheme = () => changeTheme(!isLightTheme)

  const handleSearchFocus = e => e.target.value = ''

  const handleSearchBlur = e => {
    const searchText = getSearchText()
    if (!e.target.value && searchText) e.target.value = getSearchText()
  }

  const handleSubmit = e => {
    e.preventDefault()
    history.push(routes.search.replace(':text', e.target.search.value))
    e.target.search.blur()
  }

  useEffect(() => {
    const isInSeachRoute = history.location.pathname.includes('/search/')
    const searchText = getSearchText()
    const searchInput = document.querySelector('input[name=search]')

    if (!isInSeachRoute) searchInput.value = ''
    else if (searchText && searchInput.value !== searchText)
      searchInput.value = searchText
  }, [history.location.pathname, getSearchText])

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
          <form className={classes.search} onSubmit={handleSubmit}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Buscar..."
              name="search"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
          </form>
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
        onClose={() => setOpen(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
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
          >
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary="Lista" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.favorites}
            onClick={handleDrawerClose}
          >
            <ListItemIcon><FavoriteIcon /></ListItemIcon>
            <ListItemText primary="Favoritos" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.recent}
            onClick={handleDrawerClose}
          >
            <ListItemIcon><RestoreIcon /></ListItemIcon>
            <ListItemText primary="Recentes" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.announcements}
            onClick={handleDrawerClose}
          >
            <ListItemIcon><AnnouncementIcon /></ListItemIcon>
            <ListItemText primary="Avisos" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.ingredients}
            onClick={handleDrawerClose}
          >
            <ListItemIcon><ColorizeIcon /></ListItemIcon>
            <ListItemText primary="Ingredientes" />
          </ListItem>
          <ListItem
            button
            component={LinkMUI}
            href={routes.facebook}
            target="_blank"
            onClick={handleDrawerClose}
          >
              <ListItemIcon><LinkIcon /></ListItemIcon>
              <ListItemText primary="Facebook" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={routes.download}
            onClick={handleDrawerClose}
          >
            <ListItemIcon><CloudDownloadIcon /></ListItemIcon>
            <ListItemText primary="Baixar" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={Link}
            to={routes.about}
            onClick={handleDrawerClose}
          >
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="Sobre" />
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
