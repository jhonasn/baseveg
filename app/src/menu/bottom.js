
import React from 'react'
import { useHistory, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Hidden from '@material-ui/core/Hidden'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ListIcon from '@material-ui/icons/List'
import { routes } from '../routes'

const useStyles = makeStyles({
  stickToBottom: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 1,
  }
})

export default () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Hidden smUp>
      <BottomNavigation
        value={history.location.pathname}
        showLabels
        className={classes.stickToBottom}
      >
        <BottomNavigationAction
          label="Lista"
          icon={<ListIcon />}
          component={Link}
          to={routes.categories}
          value={routes.categories}
        />
        <BottomNavigationAction
          label="Recentes"
          icon={<RestoreIcon />}
          component={Link}
          to={routes.recent}
          value={routes.recent}
        />
        <BottomNavigationAction
          label="Favoritos"
          icon={<FavoriteIcon />}
          component={Link}
          to={routes.favorites}
          value={routes.favorites}
        />
      </BottomNavigation>
    </Hidden>
  )
}
