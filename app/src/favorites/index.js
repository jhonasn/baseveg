import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Banner from '../components/banner'
import CardItem from '../list/card-item'
import CardIngredient from '../ingredients/card-ingredient'
import api from '../api/favorite'

export default () => {
  // TODO: add category in items cards and item and category in options cards
  // TODO: add link to item in options cards
  // TODO: add no favorites message
  const [favorites, setFavorites] = useState([])

  const refreshFavorites = () => {
    (async () => setFavorites(await api.load()))()
  }

  useEffect(refreshFavorites, [])

  return (
    <>
      <Banner
        title="Favoritos"
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
        </Grid>
      </Container>
    </>
  )
}
