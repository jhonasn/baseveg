import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import Loading from '../components/loading'
import Category from './category'
import CardItem from './card-item'
import debounce from 'lodash/debounce'
import api from '../api/item'
import categoryApi from '../api/category'

export default () => {
  // TODO: fix show loading in nonsense times
  // TODO: add floating button to go top
  const { categoryId } = useParams()

  const [category, setCategory] = useState(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAllItemsLoaded, setIsAllItemsLoaded] = useState(false)
  const [openAllItemsLoaded, setOpenAllItemsLoaded] = useState(false)

  useEffect(() => {
    (async () =>
      !categoryId && !(categoryId && category.id === categoryId) &&
        setCategory(await categoryApi.get(categoryId))
    )()
  }, [categoryId])

  const getMoreItems = (categoryId, items, isLoading) => {
    const nextItems = api.loadNext(categoryId)
    if (nextItems.length < 50) setIsAllItemsLoaded(true)
    const data = [...items, ...nextItems]
    setItems(data)
    if (isLoading) setIsLoading(false)
  }

  if (!category) return <Loading />

  const infiniteScroll = debounce(() => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight) {
      getMoreItems(categoryId, items, isLoading)
    }
  }, 100)

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight && !isLoading) {
      if (isAllItemsLoaded) setOpenAllItemsLoaded(true)
      else setIsLoading(true)
    }
    infiniteScroll()
  }, [isLoading, isAllItemsLoaded, infiniteScroll])

  useEffect(() => {
    window.scrollTo(0, 0)
    getMoreItems(categoryId, items, isLoading)
    window.onscroll = handleScroll

    return () => {
      window.onscroll = null
      setItems([])
      setIsLoading(false)
      setIsAllItemsLoaded(false)
      // FIXME:
      // resetCategory()
    }
  }, [categoryId])

  return (
    <>
      {isLoading && <Loading />}
      <Category
        category={category}
        banner
      />
      <Container fixed>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={1}
        >
          {items.map((i, idx) => (
              <Grid item xs={12} key={idx}>
                <CardItem
                  item={i}
                  link={`/options/${i.category}/${i.id}`}
                />
              </Grid>
          ))}
        </Grid>
      </Container>
      <Snackbar
        open={openAllItemsLoaded}
        onClose={() => setOpenAllItemsLoaded(false)}
        TransitionComponent={props => <Slide {...props} direction="up" />}
        autoHideDuration={2000}
        message={'Fim dos items dessa categoria'}
      />
    </>
  )
}
