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
import { getNextItems as getItems, categories, resetCategory } from '../api'

export default () => {
  // TODO: add floating button to go top
  const { categoryId } = useParams()

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAllItemsLoaded, setIsAllItemsLoaded] = useState(false)
  const [openAllItemsLoaded, setOpenAllItemsLoaded] = useState(false)

  if (!categories) return <Loading />

  const category = categories.find(c => c.key === categoryId)

  const getMoreItems = useCallback(() => {
    const nextItems = getItems(categoryId)
    if (nextItems.length < 50) setIsAllItemsLoaded(true)
    const data = [...items, ...nextItems]
    setItems(data)
    if (isLoading) setIsLoading(false)
  }, [categoryId, items, isLoading])

  useEffect(() => {
    window.scrollTo(0, 0)
    getMoreItems(categoryId)

    return () => {
      window.onscroll = null
      setItems([])
      setIsLoading(false)
      setIsAllItemsLoaded(false)
      resetCategory()
    }
  }, [categoryId])


  const infiniteScroll = debounce(() => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight) {
      getMoreItems()
    }
  }, 100)

  window.onscroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight && !isLoading) {
      if (isAllItemsLoaded) setOpenAllItemsLoaded(true)
      else setIsLoading(true)
    }
    infiniteScroll()
  }

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
                  link={`/options/${i.category}/${i.key}`}
                />
              </Grid>))}
        </Grid>
      </Container>
      <Snackbar
        open={openAllItemsLoaded}
        onClose={() => setOpenAllItemsLoaded(false)}
        TransitionComponent={props => <Slide {...props} direction="up" />}
        message={'Fim dos items dessa categoria'}
      />
    </>
  )
}
