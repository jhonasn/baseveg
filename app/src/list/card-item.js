import React from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardActionArea from '@material-ui/core/CardActionArea'
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography'
import red from '@material-ui/core/colors/red'
import lightBlue from '@material-ui/core/colors/lightBlue'
import orange from '@material-ui/core/colors/orange'
import teal from '@material-ui/core/colors/teal'
import FavoriteButton from '../favorites/button'

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  badge: {
    width: '100%',
  },
  cardContent: {
    padding: [theme.spacing(0.5, 1, 1), '!important'],
  },
  cardActions: {
    maxWidth: '100%',
  },
  actionsTitle: {
    marginTop: theme.spacing(1),
  },
  actionsWithTitle: {
    paddingTop: 0,
  },
  contentWithActionsTitle: {
    paddingBottom: [0, '!important'],
  },
  warning: {
    color: red[500],
  },
  only: {
    color: lightBlue[500],
  },
  except: {
    color: orange[500],
  },
  observation: {
    color: teal[500],
  },
}))

export default ({
  item: i,
  link,
  width,
  actionsTitle,
  badge = true,
  isOption,
  onFavoriteChanged,
  children,
}) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const history = useHistory()

  const handleLinkClick = e => {
    const findParentButton = el => el.tagName === 'BUTTON'
      ? el
      : findParentButton(el.parentNode)

    if (findParentButton(e.target).className.includes('MuiCardActionArea-root'))
      history.push(link)
  }

  const cardContent = (
    <>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-end"
      >
        <Grid item className={classes.content}>
          <Typography variant="caption">
            {isOption
              ? <>Marca <small>(opção)</small></>
              : <>Produto <small>(item)</small></>
            }
          </Typography>
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
        </Grid>
        <Grid item xs={1}>
          <FavoriteButton
            noPad
            type={isOption ? 'option' : 'item'}
            id={i.typeId || i.id}
            onFavoriteChanged={onFavoriteChanged}
          />
        </Grid>
      </Grid>

      {i.warnings && <>
        <Typography variant="body2" className={classes.warning} gutterBottom>
          <strong>Atenção:</strong> {i.warnings}
        </Typography>
      </>}

      {i.only && <>
        <Typography variant="body2" className={classes.only} gutterBottom>
          <strong>Somente:</strong> {i.only}
        </Typography>
      </>}

      {i.except && <>
        <Typography variant="body2" className={classes.except} gutterBottom>
          <strong>Exceto:</strong> {i.except}
        </Typography>
      </>}

      {i.observations && <>
        <Typography variant="body2" className={classes.observation} gutterBottom>
          <strong>Obs:</strong> {i.observations}
        </Typography>
      </>}

      {!!actionsTitle &&
        <Typography color="textSecondary" className={classes.actionsTitle}>
          {actionsTitle}
        </Typography>}
    </>
  )

  const content = (
    <>
      <CardContent
        className={clsx(classes.cardContent,
          actionsTitle ? classes.contentWithActionsTitle : '')}
      >
        {cardContent}
      </CardContent>
      {!!children &&
        <CardActions
          disableSpacing
          className={clsx(classes.cardActions, actionsTitle ? classes.actionsWithTitle : '')}
        >
          {children}
        </CardActions>
      }
    </>
  )

  const card = (
    <Card className={classes.card}>
      {link
        ? <CardActionArea onClick={handleLinkClick}>{content}</CardActionArea>
        : content
      }
    </Card>
  )

  if (i.optionsCount && badge) {
    return (
      <Badge
        badgeContent={i.optionsCount}
        color="secondary"
        className={classes.badge}
      >
        {card}
      </Badge>
    )
  }

  return card
}
