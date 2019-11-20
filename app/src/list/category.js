import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import CardActionArea from '@material-ui/core/CardActionArea'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FavoriteButton from '../favorites/button'

const useStyles = makeStyles(theme => ({
  category: {
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
  banner: {
    margin: 0,
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    minHeight: theme.spacing(30),
  },
  content: {
    zIndex: 0,
  },
}))

export default ({ category: c, item: i, link, banner = false, noType = false }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const category = (
    <Paper
      key={c.name}
      className={clsx(classes.category, banner ? classes.banner : '')}
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/${c.key}.jpg)`}}
    >
      <img
        style={{ display: 'none' }}
        alt="background"
      />
      <div className={classes.overlay} />

      {!noType &&
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <Grid item className={classes.content}>
            <Typography variant="caption">
              {c && i
                ? <>Produto <small>(item)</small></>
                : 'Categoria'
              }
            </Typography>
          </Grid>
        </Grid>
      }
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Grid item xs={10} className={classes.content}>
          {!i
            ? <Typography variant={!banner ? 'subtitle1' : 'h5'}>{c.name}</Typography>
            : <>
              <Typography variant="subtitle1" gutterBottom>{i.name}</Typography>
              <Typography variant="caption" gutterBottom>{c.name}</Typography>
            </>
          }
        </Grid>
        {!!i &&
          <Grid item xs className={classes.content}>
            <FavoriteButton />
          </Grid>
        }
      </Grid>
    </Paper>)

    if (link) return (
      <CardActionArea component={Link} to={link}>
        {category}
      </CardActionArea>
    )

    return category
}
