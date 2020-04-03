import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Loading from '../components/loading'
import Banner from '../components/banner'
import CardItem from '../list/card-item'
import CardIngredient from '../ingredients/card-ingredient'
import api from '../api/favorite'

const useStyles = makeStyles(theme => ({
  noFavorites: {
    padding: theme.spacing(2),
  },
}))

export default () => {
  // TODO: add category in items cards and item and category in options cards
  // TODO: add link to item in options cards
  const theme = useTheme()
  const classes = useStyles(theme)

  const [favorites, setFavorites] = useState(null)

  const refreshFavorites = () => {
    (async () => setFavorites(await api.load()))()
  }

  useEffect(refreshFavorites, [])

  if (!favorites) return <Loading />

  return (
    <>
      <Banner
        title="Favoritos"
        subtitle={
          !!favorites && !!favorites.length &&
          `${favorites.length} itens favoritos`
        }
        imgName="favorites"
        isFullWidth
      />
      <Container fixed>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          {favorites.map(f => (
            f.type === 'ingredient'
              ? (
                <CardIngredient
                  key={f.id}
                  id={f.typeId}
                  ingredient={f}
                  onFavoriteChanged={refreshFavorites}
                />
              ) : (
                <CardItem
                  key={f.id}
                  item={f}
                  isOption={f.type === 'option'}
                  link={f.type === 'item' && `/options/${f.categoryId}/${f.typeId}`}
                  onFavoriteChanged={refreshFavorites}
                />
              )
          ))}
          {!favorites.length &&
            <Paper className={classes.noFavorites}>
              <Typography variant="body1">
                Você não adicionou nenhum item aos seus favoritos
              </Typography>
            </Paper>
          }
        </Grid>
      </Container>
    </>
  )
}
