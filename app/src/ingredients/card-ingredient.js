import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Chiptip from '../components/chiptip'
import FavoriteButton from '../favorites/button'

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  'd-block': {
    display: 'block',
  },
  cardContent: {
    padding: [theme.spacing(0.5, 1, 1), '!important'],
  },
  font: {
    float: 'right',
  }
}))

export default ({
  id,
  ingredient: i,
  onFavoriteChanged,
}) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const formatArrayFinishByAnd = arr => {
    const start = arr.slice(0, arr.length).join(', ')
    const end = arr[arr.length - 1]
    if (arr.length > 1) return `${start} e ${end}`
    else return start
  }

  return (
    <Card className={classes.card}>
      <CardContent
        className={classes.cardContent}
      >
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <Grid item className={classes.content}>
            <Typography variant="caption">Ingrediente</Typography>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="baseline"
        >
          <Grid item xs={11} className={classes.content}>
            <Typography variant="subtitle1">
              {i.name}
            </Typography>
            {i.otherNames &&
            <Typography variant="caption">
              <strong>Também conhecido como</strong>&nbsp;
              {formatArrayFinishByAnd(i.otherNames)}
            </Typography>}
          </Grid>
          <Grid item xs={1}>
            <FavoriteButton
              noPad
              type="ingredient"
              id={id}
              onFavoriteChanged={onFavoriteChanged}
            />
          </Grid>
        </Grid>

        {i.descriptionShort &&
        <Typography variant="body2" gutterBottom>
          {i.descriptionShort}
        </Typography>}

        {i.description &&
        <Typography variant="caption" className={classes['d-block']} gutterBottom>
          {i.description}
        </Typography>}

        {i.use &&
        <Typography variant="caption" className={classes['d-block']} gutterBottom>
          <strong>Usado em:</strong> {i.use}
        </Typography>}

        {i.alternatives &&
        <Typography variant="caption" className={classes['d-block']} gutterBottom>
          <strong>Alternativas:</strong>
          {i.alternatives.map((a, idx) => (
            <Chiptip key={idx} maxWidth={196}>{a}</Chiptip>
          ))}
        </Typography>}

        <Typography variant="caption" className={classes.font}>
          <strong>Fonte:</strong>&nbsp;
          <Link href={i.font.link} target="_blank">{i.font.name}</Link>
        </Typography>
      </CardContent>
    </Card>)
}
