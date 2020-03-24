import React from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Category from '../list/category'
import CardIngredient from './card-ingredient'
import { getIngredients } from '../api'

export default () => {
  // FIXME: favoriting ingredient doesn't work
  let ingredients = getIngredients()

  const mapOtherIngredients = (type, i) => ({
    type,
    name: i,
    descriptionShort: ingredients[type].descriptionShort,
    fontId: ingredients[type].fontId
  })

  ingredients = ingredients.general.slice(0, 8)
    .concat(ingredients.general
      .filter(i => i.otherNames && i.otherNames.length > 1).slice(0, 2))
    .concat(ingredients.general.filter(i => i.alternatives).slice(0, 3))
    .concat(ingredients.animal.ingredients.slice(0, 5)
      .map(mapOtherIngredients.bind(null, 'animal'))
    )
    .concat(ingredients.milk.ingredients.slice(0, 5)
      .map(mapOtherIngredients.bind(null, 'milk'))
    )

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
