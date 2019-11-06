import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  category: {
    padding: theme.spacing(3, 2),
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(6),
    // backgroundImage: `url(${process.env.PUBLIC_URL}/not_found.svg)`,
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
  categoryContent: {
    position: 'relative',
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(8),
      paddingRight: 0,
    },
  },
  noMargin: {
    margin: 0,
    borderRadius: 0,
    minHeight: '500px',
  },
  noMarginContent: {
    padding: 0,
  },
}))

export default ({ category: c, item: i, noMargin = false }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Paper
      key={c.name}
      className={clsx(classes.category, noMargin ? classes.noMargin : '')}
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/${c.key}.jpg)`}}
    >
      <img
        style={{ display: 'none' }}
        alt="background"
      />
      <div className={classes.overlay} />
      <Container className={clsx(classes.categoryContent, !noMargin ? '' : classes.noMarginContent)}>
        {!i
          ? <Typography variant={!noMargin ? 'subtitle1' : 'h5'}>{c.name}</Typography>
          : <>
            <Typography variant="subtitle1" gutterBottom>{i.name}</Typography>
            <Typography variant="caption" gutterBottom>{c.name}</Typography>
          </>}

      </Container>
    </Paper>)
}
