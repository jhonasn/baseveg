import React from 'react'
import clsx from 'clsx'
import { useHistory, Link } from 'react-router-dom'
import { makeStyles, useTheme, fade } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ListIcon from '@material-ui/icons/List'
import InfoIcon from '@material-ui/icons/Info'
import LinkIcon from '@material-ui/icons/Link'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import SearchIcon from '@material-ui/icons/Search'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
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
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
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
    marginLeft: -drawerWidth,
    [theme.breakpoints.only('xs')]: {
      paddingTop: theme.spacing(7),
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  florist: {
    float: 'left',
    marginRight: 5,
    marginTop: 3,
  },
  title: {
    flexGrow: 1,
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

export default ({ children }) => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()

  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => setOpen(true)

  const handleDrawerClose = () => setOpen(false)

  const handleSubmit = e => {
    e.preventDefault()
    history.push(routes.search.replace(':text', e.target.search.value))
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <LinkMUI
            className={classes.title}
            color="inherit"
            component={Link}
            to={routes.items}
          >
            <LocalFloristIcon className={classes.florist} />
            <Typography variant="h6" noWrap>
              VegAjuda
            </Typography>
          </LinkMUI>
          <form className={classes.search} onSubmit={handleSubmit}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              name="search"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </form>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to={routes.items}>
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary="Lista" />
          </ListItem>
          <ListItem button component={Link} to={routes.favorites}>
            <ListItemIcon><FavoriteIcon /></ListItemIcon>
            <ListItemText primary="Favoritos" />
          </ListItem>
          <ListItem button component={Link} to={routes.recent}>
            <ListItemIcon><RestoreIcon /></ListItemIcon>
            <ListItemText primary="Recentes" />
          </ListItem>
          <ListItem button component={Link} to={routes.announcements}>
            <ListItemIcon><AnnouncementIcon /></ListItemIcon>
            <ListItemText primary="Avisos" />
          </ListItem>
          <ListItem
            button
            component={LinkMUI}
            href={routes.facebook}
            target="_blank"
          >
              <ListItemIcon><LinkIcon /></ListItemIcon>
              <ListItemText primary="Facebook" />
          </ListItem>
          <ListItem button component={Link} to={routes.download}>
            <ListItemIcon><CloudDownloadIcon /></ListItemIcon>
            <ListItemText primary="Baixar" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to={routes.about}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="Sobre" />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        {children}
      </main>
    </div>
  )
}
