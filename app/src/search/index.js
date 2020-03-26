import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import debounce from 'lodash/debounce'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import Category from '../list/category'
import CardItem from '../list/card-item'
import Loading from '../components/loading'
import Chiptip, { ChipContainer } from '../components/chiptip'
import FavoriteButton from '../favorites/button'
import { query } from '../api'
import configApi from '../api/config'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  notFountPaper: {
    padding: theme.spacing(2),
  },
  brandsDescription: {
    display: 'block',
  },
  infoSnack: {
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    fontSize: 20,
  },
  infoIcon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  infoMessage: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const SearchResultText = ({ result }) => (
  Array.isArray(result.name)
    ? result.name.map((part, idx) => (
      part.bold ? <b key={idx}>{part.content}</b> : part.content
    ))
    : result.name
)

export default () => {
  // TODO: add category expand/collapse option
  // TODO: add search ingredients
  // BUG: options not shown
  const { text: search } = useParams()
  const theme = useTheme()
  const classes = useStyles(theme)

  const [showEndOfItems, setShowEndOfItems] = useState(false)
  const [showOptionTip, setShowOptionTip] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    (async () => setResult(await query(search)))()
    window.scrollTo(0, 0)
  }, [search])

  useEffect(() => {
    (async () => {
      const isAlreadyShown = await configApi.getIsSearchTipPresented()
      setShowOptionTip(!isAlreadyShown)
    })()
  }, [])

  useEffect(() => {
    window.onscroll = debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop
          >= document.documentElement.offsetHeight && !showEndOfItems)
          setShowEndOfItems(true)
    }, 100)

    return () => window.onscroll = null
  })

  const handleInfoClose = () => {
    configApi.setIsSearchTipPresented(true)
    setShowOptionTip(false)
  }

  // TODO: bring total results from query
  const total = 123
  if (!result) return <Loading />

  return (
    <>
      <Category
        category={{ name: `${total} resulados para ${search}` }}
        item={{ id: 'search', name: 'Resultados da busca' }}
        noType
        banner
      />
      <Container className={classes.root}>
        {result.map(c => (
          <Grid
            key={c.id}
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs={12}>
              <Category
                category={{ ...c, name: <SearchResultText result={c} /> }}
                link={`/items/${c.id}`}
              />
            </Grid>
            {c.items.map(i => (
              <Grid key={i.id} item xs={12}>
                <CardItem
                  item={{ ...i, name: <SearchResultText result={i} /> }}
                  link={`/options/${i.category}/${i.id}`}
                  badge={false}
                  actionsTitle={
                    i.options.length ? <>Marcas <small>(opções)</small>:</> : null
                  }
                >
                  <ChipContainer>
                    {i.options.map(o => (
                      <>
                        <Chiptip key={o.id} icon={<FavoriteButton noPad />}>
                          <SearchResultText result={o} />
                        </Chiptip>
                      </>
                    ))}
                  </ChipContainer>
                </CardItem>
              </Grid>
            ))}
          </Grid>
        ))}
        {!result.length &&
          <Paper className={classes.notFountPaper}>
            <Typography variant="body1">
              Nenhum resultado encontrado na busca de "{search}"
            </Typography>
          </Paper>
        }
        <Snackbar
          open={showEndOfItems}
          onClose={() => setShowEndOfItems(false)}
          autoHideDuration={2000}
          TransitionComponent={props => <Slide {...props} direction="up" />}
          message={'Fim dos resultados da busca'}
        />
        <Hidden mdUp>
          <Snackbar
            style={!(showOptionTip && result.length) ? { display: 'none' } : {}}
            open={showOptionTip && result.length}
            onClose={handleInfoClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            TransitionComponent={props => <Slide {...props} direction="up" />}
            message={
              <span className={classes.infoMessage}>
                <InfoIcon className={clsx(classes.icon, classes.infoIcon)} />
                Para visualizar todo conteúdo de uma opção (marca),
                basta tocar nela
                <IconButton key="close" color="inherit" onClick={handleInfoClose}>
                  <CloseIcon className={classes.icon} />
                </IconButton>
              </span>
            }
            ContentProps={{
              classes: { root: classes.infoSnack }
            }}
          />
        </Hidden>
      </Container>
    </>
  )
}
