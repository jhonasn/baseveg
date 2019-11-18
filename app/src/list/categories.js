import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import Loading from '../components/loading'
import Category from './category'
import CardItem from './card-item'
import debounce from 'lodash/debounce'
import { getNextItems as getItems, categories, resetCategory } from '../api'

export default () => {
  if (!categories) return <Loading />

  return (
    <>
      <Category
        category={{
          name: 'Lista de produtos liberados do grupo Vegajuda - Veganismo',
          key: 'vegajuda'
        }}
        banner
      />
      <Container fixed>
        {categories && categories
          .map((c, idx) => (
          <React.Fragment key={idx}>
            <Category
              category={c}
              link={`items/${c.key}`}
            />
          </React.Fragment>
        ))}
      </Container>
    </>
  )
}
