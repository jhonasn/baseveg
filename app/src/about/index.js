import React from 'react'
import { Link as Route } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { routes } from '../routes'

const useStyles = makeStyles(theme => ({
  title: {
    marginTop: theme.spacing(3),
  },
  body: {
    marginBottom: theme.spacing(2),
  },
}))

export default () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  return (
    <Container>
      <Typography variant="h6" className={classes.title}>About the app</Typography>
      <Typography variant="body2" className={classes.body}>
        This app is an
        <Link href={routes.github} target="_blank"> opensource software </Link>
        created by
        <Link href="https://facebook.com/jhonasnasc" target="_blank"> Jhonas Nascimento</Link>.
        All the data contained in this software were made by the
        <Link href={routes.facebook} target="_blank"> facebook group </Link>
        moderators and members and is open to download in computer format (json)
        or excel here in
        <Link component={Route} to={routes.download}> dowload section</Link>.
      </Typography>
      <Typography variant="h6">Many thanks to photographers</Typography>
      <Typography variant="caption">
        Who made their photos available to download for free on
        <Link href="https://unsplash.com" target="_blank"> Unsplash website</Link>. Those photos
        were included in this app in the category backgrounds.
      </Typography>
      <ul>
        {[
          'Joe Holiday',
          'Vaun0815',
          'Mae Mu',
          'Zeidy Vargas',
          'Lisa Hobbs',
          'Kobby Mendez',
          'Daiga Ellaby',
          'Sarah Gualtieri',
          'Lucas Gruwez',
          'Piron Guillaume',
          'Josh Sorenson',
          'Mel Poole',
          'Jazmin Quaynor',
          'DESIGNECOLOGIST',
          'Luis Quintero',
          'Clem Onojeghuo',
          'Angélica Echeverry',
          'Frank Lloyd de la Cruz',
          'Raphael Lovaski',
          'Sam Carter',
          'Angel Sinigersky',
          'Laura Mitulla',
          'Gabriel Matula',
          'Lucas Benjamin',
          'Jaredd Craig',
          'Ashim D’Silva',
        ].map(name => <li><Typography variant="body2">{name}</Typography></li>)}
      </ul>
    </Container>)
}
