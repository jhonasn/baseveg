import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import CardActionArea from '@material-ui/core/CardActionArea'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FavoriteButton from 'routes/favorites/button'

const useStyles = makeStyles(theme => ({
  frame: {
    display: 'grid',
    padding: theme.spacing(1, 2, 3),
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(2),
    minHeight: theme.spacing(15),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  fullWidth: {
    margin: 0,
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    minHeight: theme.spacing(30),
  },
  content: {
    zIndex: 0,
  },
  bottom: {
    flex: 1,
  },
}))

export default function Banner({
  title,
  subtitle,
  imgName,
  link,
  type,
  isFullWidth = false,
  favoriteOptions,
  options,
}) {
  // TODO: create banner images for each screen size (xs, sm, md, lg, xl)
  const theme = useTheme()
  const classes = useStyles(theme)

  const banner = (
    <Paper
      className={clsx(classes.frame, isFullWidth ? classes.fullWidth : '')}
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/${imgName}.jpg)`}}
    >
      <img
        style={{ display: 'none' }}
        alt="background"
      />
      <div className={classes.overlay} />

      <Grid
        container
        className={classes.bottom}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        {type &&
          <Grid
            item
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Grid item className={classes.content}>
              <Typography variant="caption">
                {type}
              </Typography>
            </Grid>
          </Grid>
        }
        <Grid
          item
          container
          direction="row"
          justify="space-between"
          alignItems="flex-end"
        >
          <Grid item xs={10} className={classes.content}>
            <Typography variant={!isFullWidth ? 'subtitle1' : 'h5'} gutterBottom>
              {title}
            </Typography>
            {subtitle &&
              <Typography variant="caption" gutterBottom>{subtitle}</Typography>
            }
          </Grid>
          {favoriteOptions &&
            <Grid item xs className={classes.content}>
              <FavoriteButton {...favoriteOptions} />
            </Grid>
          }
        </Grid>
        {options &&
          <Grid
            item
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
            className={classes.bottom}
          >
            <Grid item xs={12} className={classes.content}>
              {options}
            </Grid>
          </Grid>
        }
      </Grid>
    </Paper>)

    if (link) return (
      <CardActionArea component={Link} to={link}>
        {banner}
      </CardActionArea>
    )

    return banner
}
