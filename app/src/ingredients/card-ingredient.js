import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import FavoriteButton from '../favorites/button'
import { getIngredients } from '../api'

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
  chip: {
    maxWidth: '251px',
    marginLeft: '2px',
    marginBottom: '2px',
  },
  chipLabel: {
    whiteSpace: ['nowrap', '!important'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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

  const ingredients = getIngredients()

  const font = ingredients.links.find(l => l.id === i.fontId)

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
            <Tooltip
              key={idx}
              title={a}
            >
              <Chip
                label={a}
                color="primary"
                className={classes.chip}
                classes={{ label: classes.chipLabel }}
                variant="outlined"
                clickable
              />
            </Tooltip>
          ))}
        </Typography>}

        <Typography variant="caption" className={classes.font}>
          <strong>Fonte:</strong>&nbsp;
          <Link href={font.link} target="_blank">{font.name}</Link>
        </Typography>
      </CardContent>
    </Card>)
}
