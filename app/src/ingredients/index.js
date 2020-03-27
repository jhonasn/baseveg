import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Category from '../list/category'
import CardIngredient from './card-ingredient'
import api from '../api/ingredient'

export default () => {
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    (async () => setIngredients(await api.loadNext()))()
  }, [])

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
