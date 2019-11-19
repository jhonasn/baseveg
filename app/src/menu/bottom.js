
import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
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
  const [value, setValue] = React.useState(0)

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.stickToBottom}
    >
      <BottomNavigationAction
        label="Lista"
        icon={<ListIcon />}
        component={Link}
        to={routes.categories}
      />
      <BottomNavigationAction
        label="Recentes"
        icon={<RestoreIcon />}
        component={Link}
        to={routes.recent}
      />
      <BottomNavigationAction
        label="Favoritos"
        icon={<FavoriteIcon />}
        component={Link}
        to={routes.favorites}
      />
    </BottomNavigation>
  )
}
