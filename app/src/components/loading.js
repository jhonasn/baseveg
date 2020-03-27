
import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  loading: {
    zIndex: theme.zIndex.drawer + 1,
  },
}))

export default () => {
  // TODO: change loading to run with a worker
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Backdrop className={classes.loading} open>
        <CircularProgress color="secondary" />
    </Backdrop>
  )
}
