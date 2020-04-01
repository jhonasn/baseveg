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
import Banner from '../components/banner'
import Category from '../list/category'
import CardItem from '../list/card-item'
import CardIngredient from '../ingredients/card-ingredient'
import Loading from '../components/loading'
import Chiptip, { ChipContainer } from '../components/chiptip'
import FavoriteButton from '../favorites/button'
import configApi from '../api/config'
import api from '../api/search'

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
  Array.isArray(result)
    ? result.map((part, idx) => (
      part.bold ? <b key={idx}>{part.content}</b> : part.content
    ))
    : result
)

export default () => {
  // TODO: add category expand/collapse option
  // TODO: add search ingredients
  // TODO: implement infinite scroll
  const { text: search } = useParams()
  const theme = useTheme()
  const classes = useStyles(theme)

  const [showEndOfItems, setShowEndOfItems] = useState(false)
  const [showOptionTip, setShowOptionTip] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    (async () => setResult(await api.query(search)))()
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

  if (!result) return <Loading />

  return (
    <>
      <Banner
        title="Resultados da busca"
        subtitle={`${result.total} resulados para ${search}`}
        imgName="search"
        isFullWidth
      />
      <Container className={classes.root}>
        {result.categories.map(c => (
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
                data={{ ...c, name: <SearchResultText result={c.name} /> }}
              />
            </Grid>
            {(c.items || []).map(i => (
              <Grid key={i.id} item xs={12}>
                <CardItem
                  item={{ ...i, name: <SearchResultText result={i.name} /> }}
                  link={`/options/${i.categoryId}/${i.id}`}
                  badge={false}
                  actionsTitle={
                    i.options && i.options.length
                      ? <>Marcas <small>(opções)</small>:</>
                      : null
                  }
                  skipClick={'Chip'}
                >
                  <ChipContainer>
                    {(i.options || []).map(o => (
                      <Chiptip key={o.id} icon={
                        <FavoriteButton
                          type="option"
                          id={o.id}
                          noPad
                        />
                      }>
                        <SearchResultText result={o.name} />
                      </Chiptip>
                    ))}
                  </ChipContainer>
                </CardItem>
              </Grid>
            ))}
          </Grid>
        ))}
        {!!result.ingredients.length &&
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs={12}>
              <Banner
                title="Ingredientes não veganos"
                imgName="ingredients"
              />
            </Grid>
            {result.ingredients.map(i => (
              <Grid key={i.id} item xs={12}>
                <CardIngredient id={i.id} ingredient={{
                  ...i,
                  name: <SearchResultText result={i.name} />,
                  description: i.description && <SearchResultText result={i.description} />,
                  descriptionShort: i.descriptionShort &&
                    <SearchResultText result={i.descriptionShort} />,
                  use: i.use && <SearchResultText result={i.use} />,
                  alternatives: i.alternatives &&
                    i.alternatives.map((a, idx) => <SearchResultText key={idx} result={a} />),
                  otherNames: i.otherNames &&
                    i.otherNames.map((o, idx) => <SearchResultText key={idx} result={o} />),
                }} />
              </Grid>
            ))}
          </Grid>
        }
        {!result.total &&
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
