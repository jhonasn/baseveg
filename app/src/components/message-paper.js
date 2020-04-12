import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  noFavorites: {
    padding: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
}))

export default function MessagePaper({ message, hasMarginTop, children }) {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Paper className={clsx(classes.noFavorites, {
      [classes.marginTop]: hasMarginTop,
    })}>
      {message
        ? <Typography variant="body1">{message}</Typography>
        : children
      }
    </Paper>
  )
}
