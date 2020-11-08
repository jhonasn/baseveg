import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import DeleteIcon from '@material-ui/icons/Delete'
import api from './api'

const useStyles = makeStyles(theme => ({
  favorite: {
    color: theme.palette.secondary.light,
  },
  noPadding: {
    padding: 0,
  }
}))

export default ({ type, id, className, noPad, onFavoriteChanged }) => {
  const [isFavorite, setIsFavorite] = useState(null)
  const theme = useTheme()
  const classes = useStyles(theme)

  if (isFavorite === null) (async () => {
    const favorited = await api.isFavorite(type, id)
    setIsFavorite(favorited)
  })()

  const handleFavorite = async () => {
    const isFavorited = await api.save(type, id)
    if (onFavoriteChanged) return onFavoriteChanged()
    setIsFavorite(isFavorited)
  }

  return (
    <IconButton
      color="inherit"
      onClick={handleFavorite}
      className={clsx(className, noPad ? classes.noPadding : '')}
    >
      {!onFavoriteChanged && (isFavorite
        ? <FavoriteIcon className={classes.favorite} />
        : <FavoriteBorderIcon />)
      }
      {!!onFavoriteChanged &&
        <DeleteIcon />
      }
    </IconButton>
  )
}
