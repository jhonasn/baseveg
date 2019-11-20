import React from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Category from './category'
import CardItem from './card-item'
import { getOptions } from '../api'

export default () => {
  const { categoryId, itemId } = useParams()
  const { category, item, options } = getOptions(categoryId, itemId)
  window.scrollTo(0, 0)

  return (
    <>
      <Category category={category} item={item} banner />
      <Container>
        {options.map((o, idx) => (
          <CardItem key={idx} item={o} isOption />
        ))}
      </Container>
    </>
  )
}
