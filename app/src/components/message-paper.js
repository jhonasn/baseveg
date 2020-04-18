import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  rootDense: {
    padding: theme.spacing(1),
  },
  marginDense: {
    marginTop: theme.spacing(1),
  },
}))

export default function MessagePaper({ message, hasMarginTop, dense, children }) {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Paper className={clsx({
      [classes.root]: !dense,
      [classes.rootDense]: dense,
      [classes.margin]: hasMarginTop && !dense,
      [classes.marginDense]: hasMarginTop && dense,
    })}>
      {message
        ? <Typography variant="body1">{message}</Typography>
        : children
      }
    </Paper>
  )
}
