
import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Fab from '@material-ui/core/Fab'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  loading: {
    position: 'fixed',
    top: theme.spacing(12),
    zIndex: 1,
    textAlign: 'center',
  },
  loadingFab: {
    backgroundColor: theme.palette.background.paper,
  }
}))

export default () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Container className={classes.loading}>
      <Fab className={classes.loadingFab}>
        <CircularProgress color="secondary" className={classes.circle} />
      </Fab>
    </Container>)
}
