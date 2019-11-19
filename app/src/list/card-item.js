import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardActionArea from '@material-ui/core/CardActionArea'
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  badge: {
    width: '100%',
  },
  cardContent: {
    padding: [theme.spacing(1), '!important'],
  },
  cardActions: {
    maxWidth: '100%',
  },
}))

export default ({ item: i, link, children, badge = true, width }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const cardContent = (
    <>
      <Typography variant="subtitle1">
        {i.name}
      </Typography>

      <Typography variant="caption"></Typography>

      {i.observations && <>
        <Typography variant="body1">Obs:</Typography>
        <Typography variant="body2" gutterBottom>{i.observations}</Typography>
      </>}

      {i.warnings && <>
        <Typography variant="body1">Atenção:</Typography>
        <Typography variant="body2" gutterBottom>{i.warnings}</Typography>
      </>}

      {i.only && <>
        <Typography variant="body1">Somente:</Typography>
        <Typography variant="body2" gutterBottom>{i.only}</Typography>
      </>}

      {i.except && <>
        <Typography variant="body1">Exceto:</Typography>
        <Typography variant="body2" gutterBottom>{i.except}</Typography>
      </>}
    </>
  )

  const card = (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        {!link
          ? cardContent
          : <CardActionArea component={Link} to={link}>{cardContent}</CardActionArea>
        }
      </CardContent>
      {!!children &&
        <CardActions disableSpacing className={classes.cardActions}>
          {children}
        </CardActions>
      }
    </Card>
  )

  const optionsLength = i.options && i.options.length

  if (optionsLength && badge) {
    return (
      <Badge
        badgeContent={optionsLength}
        color="error"
        className={classes.badge}
      >
        {card}
      </Badge>
    )
  }

  return card
}
