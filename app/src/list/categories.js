import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Loading from '../components/loading'
import Category from './category'
import api from '../api/category'

export default () => {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    (async () => setCategories(await api.load()))()
  }, [])

  if (!categories) return <Loading />

  return (
    <>
      <Category
        category={{
          name: 'Lista de produtos liberados do grupo Vegajuda - Veganismo',
          id: 'vegajuda'
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
              link={`items/${c.id}`}
            />
          </React.Fragment>
        ))}
      </Container>
    </>
  )
}
