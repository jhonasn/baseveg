import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Category from './category'
import CardItem from './card-item'
import useData from '../hooks/useData'

export default () => {
  const { categoryIdx, itemIdx } = useParams()
  const data = useData()

  if (!data.categories) return <Container><CircularProgress /></Container>

  const c = data.categories[categoryIdx]
  const i = c.items[itemIdx]
  return (
    <Container>
      <Category category={c} item={i} />

      {i.options.map((o, idx) => (
        <CardItem item={o} key={idx} />
      ))}
    </Container>
  )
}
