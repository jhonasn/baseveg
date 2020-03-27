import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Category from '../list/category'
import CardItem from '../list/card-item'
import CardIngredient from '../ingredients/card-ingredient'
import api from '../api/favorite'

export default () => {
  const [favorites, setFavorites] = useState([])

  const refreshFavorites = () => {
    (async () => setFavorites(await api.query()))()
  }

  useEffect(refreshFavorites, [])

  async function search (e) {
    e.preventDefault()
    const text = e.target.search.value
    const res = await api.query(text)
    setFavorites(res)
  }

  return (
    <>
      <Category
        category={{
          name: 'Favoritos',
          key: 'favorites'
        }}
        noType
        banner
      />
      <Container fixed>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          <form onSubmit={search}>
            <input name="search" />
          </form>
          <br />
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
