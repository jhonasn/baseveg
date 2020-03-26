import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Loading from '../components/loading'
import Category from './category'
import CardItem from './card-item'
import categoryApi from '../api/category'
import itemApi from '../api/item'
import api from '../api/option'

export default () => {
  const { categoryId, itemId } = useParams()

  const [category, setCategory] = useState(null)
  const [item, setItem] = useState(null)
  const [options, setOptions] = useState([])

  useEffect(() => {
    (async () => {
      const iid = Number(itemId)
      setCategory(await categoryApi.get(categoryId))
      setItem(await itemApi.get(iid))
      setOptions(await api.load(iid))
    })()
    window.scrollTo(0, 0)
  }, [categoryId, itemId])

  if (!category || !item) return <Loading />

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
