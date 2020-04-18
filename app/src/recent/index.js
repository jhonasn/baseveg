import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CategoryIcon from '@material-ui/icons/Category'
import ItemIcon from '@material-ui/icons/ShoppingCart'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import Loading from '../components/loading'
import MessagePaper from '../components/message-paper'
import Banner from '../components/banner'
import { routes } from '../routes'
import api from '../api/recent'

const useStyles = makeStyles(theme => ({
  deleteIcon: {
    padding: '8px',
  },
  link: {
    textDecoration: 'none',
  },
}))

export default () => {
  // TODO: implement infinite scroll
  const theme = useTheme()
  const classes = useStyles(theme)

  const [recents, setRecents] = useState(null)

  const reload = useCallback(
    async () => setRecents(await api.load()),
    [setRecents]
  )

  useEffect(() => {
    reload()
  }, [reload])

  const handleRemove = async id => {
    const removed = await api.remove(id)
    if (removed) reload()
  }

  const handleClear = async () => {
    await api.clear()
    reload()
  }

  if (!recents) return <Loading />

  const link = i => ({
    component: Link,
    to: ({
      'category': routes.items.replace(':categoryId', i.typeId),
      'item': routes.options.replace(':categoryId', i.categoryId)
        .replace(':itemId', i.typeId),
      'search': routes.search.replace(':text', i.typeId),
    })[i.type],
    className: classes.link,
  })

  return (
    <>
      <Banner
        title="Recentes"
        subtitle={
          !!recents && !!recents.length &&
          `${recents.length} itens visitados`
        }
        imgName="recent"
        isFullWidth
        options={(
          <Button color="inherit" onClick={handleClear} style={{ float: 'right' }}>
            Limpar histórico
          </Button>
        )}
      />
      <Container>
        {!recents.length &&
          <MessagePaper
            message="Nenhum foi item recentemente visitado"
            hasMarginTop
          />
        }
        {recents.map(i => (
          <MessagePaper key={i.id} hasMarginTop dense>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={2} {...link(i)}>
                <Avatar>
                  {({
                    'category': <CategoryIcon />,
                    'item': <ItemIcon />,
                    'search': <SearchIcon />,
                  })[i.type]}
                </Avatar>
              </Grid>
              <Grid
                item
                xs={9}
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                {...link(i)}
              >
                <Grid item xs={12}>
                  <Typography variant="body2" color="textPrimary">{i.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">{getTimePast(i.date)}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => handleRemove(i.id)} className={classes.deleteIcon}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </MessagePaper>
        ))}
      </Container>
    </>
  )
}

function getTimePast(date) {
  const getMonthDays = (month, year) => {
    let days = 27
    while (month === (new Date(year, month, days)).getMonth()) days++
    return days - 1
  }

  // without time
  const getDateOnly = today => new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const today = new Date()
  const todayDateOnly = getDateOnly(today)
  const time = today - date
  const timeDateOnly = todayDateOnly - getDateOnly(date)

  const aMinute = 1000 * 60
  const anHour = aMinute * 60
  const aDay = anHour * 24
  const anYear = aDay * 365

  const year = today.getFullYear()
  const month = todayDateOnly.getMonth()
  const lastMonth = month > 0 ? month - 1 : 11

  const dayStart = (today.getHours() * 60 * 60 * 1000) + (today.getMinutes() * 60 * 1000)
  const monthStart = todayDateOnly.getDate() * 24 * 60 * 60 * 1000
  const prevMonthDays = getMonthDays(lastMonth, year) * 24 * 60 * 60 * 1000
  const yearStart = todayDateOnly - new Date(year, 0, 1)

  if (time < aMinute) return `à pouco`
  else if (time < anHour) return `à ${Math.floor(time / 1000 / 60)} minutos`
  else if (time < dayStart) return `à ${Math.floor(time / 1000 / 60 / 60)} horas`
  else if (time < dayStart + aDay) return 'ontem'
  else if (timeDateOnly < monthStart) return `à ${Math.round(timeDateOnly / 1000 / 60 / 60 / 24)} dias`
  else if (timeDateOnly < monthStart + prevMonthDays) return 'mes passado'
  else if (timeDateOnly < yearStart) return `à ${Math.round(timeDateOnly / 1000 / 60 / 60 / 24 / 30)} meses`
  else if (timeDateOnly < yearStart + anYear) return 'ano passado'
  else return `à ${Math.floor(timeDateOnly / 1000 / 60 / 60 / 24 / 365)} anos`
}
