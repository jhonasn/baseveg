import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'

const useStyles = makeStyles(theme => ({
  favorite: {
    color: theme.palette.secondary.light,
  },
}))

export default ({ item, className }) => {
  // TODO: finish save favorites
  const [isFavorite, setIsFavorite] = useState(false)
  const theme = useTheme()
  const classes = useStyles(theme)

  const handleFavorite = () => setIsFavorite(!isFavorite)

  return (
    <IconButton color="inherit" onClick={handleFavorite} className={className}>
      {isFavorite
        ? <FavoriteIcon className={classes.favorite} />
        : <FavoriteBorderIcon />
      }
    </IconButton>
  )
}
