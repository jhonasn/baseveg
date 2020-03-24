import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Category from './category'
import CardItem from './card-item'
import categoryApi from '../api/category'
import itemApi from '../api/option'
import api from '../api/option'

export default () => {
  const { categoryId, itemId } = useParams()

  const [category, setCategory] = useState(null)
  const [item, setItem] = useState(null)
  const [options, setOptions] = useState(null)

  useEffect(() => {
    (async () => {
      setCategory(await categoryApi.get(categoryId))
      setItem(await itemApi.get(itemId))
      setOptions(await api.load(itemId))
    })()
  }, [])
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
