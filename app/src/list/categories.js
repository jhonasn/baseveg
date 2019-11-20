import React from 'react'
import Container from '@material-ui/core/Container'
import Loading from '../components/loading'
import Category from './category'
import { categories } from '../api'

export default () => {
  if (!categories) return <Loading />

  return (
    <>
      <Category
        category={{
          name: 'Lista de produtos liberados do grupo Vegajuda - Veganismo',
          key: 'vegajuda'
        }}
        noType
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
