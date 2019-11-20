import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'

const useStyles = makeStyles(theme => ({
  favorite: {
    color: theme.palette.secondary.light,
  },
  noPadding: {
    padding: 0,
  }
}))

export default ({ item, className, noPad }) => {
  // TODO: finish save favorites
  const [isFavorite, setIsFavorite] = useState(false)
  const theme = useTheme()
  const classes = useStyles(theme)

  const handleFavorite = () => setIsFavorite(!isFavorite)

  return (
    <IconButton
      color="inherit"
      onClick={handleFavorite}
      className={clsx(className, noPad ? classes.noPadding : '')}
    >
      {isFavorite
        ? <FavoriteIcon className={classes.favorite} />
        : <FavoriteBorderIcon />
      }
    </IconButton>
  )
}
