import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Category from '../list/category'
import CardItem from '../list/card-item'
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
  console.log(favorites)

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
            <CardItem
              key={f.id}
              isOption={f.type === 'option'}
              item={f}
              onFavoriteChanged={refreshFavorites}
            />
          ))}
        </Grid>
      </Container>
    </>
  )
}
