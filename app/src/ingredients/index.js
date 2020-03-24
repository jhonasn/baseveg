import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Category from '../list/category'
import CardIngredient from './card-ingredient'
import api from '../api/ingredient'

export default () => {
  // FIXME: favoriting ingredient doesn't work
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    (async () => setIngredients(await api.load()))()
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
        {ingredients.map((i, idx) => (
          <Grid item xs={12} key={idx}>
            <CardIngredient
              id={`${i.type || 'general'}-${idx}`}
              ingredient={i}
            />
          </Grid>
        ))}
      </Container>
    </>
  )
}
