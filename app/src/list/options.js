import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Category from './category'
import CardItem from './card-item'
import { getOptions } from '../api'

export default () => {
  const { categoryIdx, itemIdx } = useParams()
  const { category, item, options } = getOptions(categoryIdx, itemIdx)

  return (
    <>
      <Category category={category} item={item} banner />
      <Container>
        {options.map((o, idx) => (
          <CardItem key={idx} item={o} />
        ))}
      </Container>
    </>
  )
}
