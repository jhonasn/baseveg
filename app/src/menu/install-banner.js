import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import HeartIcon from '@material-ui/icons/Favorite'
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1, 0),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    margin: 0,
    borderRadius: 0,
  },
  heart: {
    color: theme.palette.secondary.light,
    marginLeft: theme.spacing(1),
  },
  bg: {
    position: 'absolute',
    width: 96,
    top: 54,
    left: -20,
    opacity: 0.5,
    fill: theme.palette.primary.dark,
  },
  overBg: {
    zIndex: 1,
  },
  dontShowAgainBtn: {
    marginTop: theme.spacing(2),
    fontSize: 'x-small',
    fontWeight: 'bold',
  },
}))

export default function InstallBanner({
  canInstall,
  installPrompt,
  setShow,
}) {
  // TODO: implement don't show again option
  const theme = useTheme()
  const classes = useStyles(theme)

  const [showInstallBanner, setShowInstallBanner] = useState(true)

  const handleClose = () => setShowInstallBanner(false)

  const handleDontShowAgain = () => {}

  if (!canInstall || !showInstallBanner) return null

  return (
    <Paper className={classes.root}>
      <AddToHomeScreenIcon class={classes.bg} />
      <Grid
        container
        className={classes.bottom}
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid
          container
          item
          xs={1}
          direction="row"
          justify="center"
          className={classes.overBg}
        >
          <IconButton color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid
          container
          item
          xs={8}
          direction="column"
          justify="flex-start"
          alignItems="center"
          className={classes.overBg}
        >
          <Grid
            item
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Typography variant="body2">
              Instalar o vegajuda
            </Typography>
            <HeartIcon className={classes.heart} />
          </Grid>
          <Grid
            item
            container
            direction="row"
            justify="flex-start"
          >
            <Typography variant="caption">
              Ao instalar você terá acesso offline ao aplicativo e não ocupará espaço em seu celular!
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          xs={3}
          container
          direction="row"
          justify="flex-end"
          className={classes.overBg}
        >
          <Button variant="outlined" color="inherit" onClick={installPrompt}>
            Instalar
          </Button>
        </Grid>
      </Grid>
      <Button
        color="inherit"
        size="small"
        className={classes.dontShowAgainBtn}
        onClick={handleDontShowAgain}
      >
        Não quero mais ver isso!
      </Button>
    </Paper>
  )
}
