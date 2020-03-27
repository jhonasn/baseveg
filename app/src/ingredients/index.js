import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Loading from '../components/loading'
import Category from '../list/category'
import CardIngredient from './card-ingredient'
import api from '../api/ingredient'

export default () => {
  const [ingredients, setIngredients] = useState(null)

  useEffect(() => {
    (async () => setIngredients(await api.loadNext()))()
  }, [])

  if (!ingredients) return <Loading />

  return (
    <>
      <Category
        category={{
          name: 'Ingredientes não veganos',
          key: 'ingredients'
        }}
        noType
        banner
      />
      <Container>
        {ingredients.map(i => (
          <Grid item xs={12} key={i.id}>
            <CardIngredient
              id={i.id}
              ingredient={i}
            />
          </Grid>
        ))}
      </Container>
    </>
  )
}
