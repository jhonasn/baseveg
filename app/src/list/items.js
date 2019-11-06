import React from 'react'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Category from './category'
import CardItem from './card-item'
import useData from '../hooks/useData'

export default () => {
  const data = useData()

  if (!data.categories) return <Container><CircularProgress /></Container>

  const { categories } = data
  return (
    <>
      <Category
        category={{
          name: 'Lista de produtos liberados do grupo Vegajuda - Veganismo',
          key: 'vegajuda'
        }}
        noMargin
      />
      <Container fixed>
        {categories && categories.length &&
        data.categories.map((c, cidx) => (
          <>
            <Category category={c} />
            {c.items.map((i, iidx) => (
              <CardItem item={i} link={`options/${cidx}/${iidx}`} />
            ))}
          </>
        ))}
      </Container>
    </>
  )
}
