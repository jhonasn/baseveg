import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import CardActionArea from '@material-ui/core/CardActionArea'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(1),
  },
}))

export default ({ item: i, link }) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const card = (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {i.name} {i.options && `(${(i.options).length})`}
        </Typography>

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
      </CardContent>
    </Card>)

    if (link) return <CardActionArea component={Link} to={link}>{card}</CardActionArea>
    else return card
}
