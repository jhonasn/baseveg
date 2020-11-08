import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import ItemIcon from '@material-ui/icons/ShoppingCart'
import Loading from 'components/loading'
import Banner from 'components/banner'
import CardItem from '../card-item'
import categoryApi from '../categories/api'
import itemApi from '../items/api'
import api from './api'

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
      <Banner
        title={item.name}
        subtitle={category.name}
        imgName={category.id}
        type={<><ItemIcon style={{ fontSize: 'inherit' }} /> Produto <small>(item)</small></>}
        isFullWidth
        favoriteOptions={{ id: item.id, type: 'item' }}
      />
      <Container>
        {options.map((o, idx) => (
          <CardItem key={idx} item={o} isOption />
        ))}
      </Container>
    </>
  )
}
