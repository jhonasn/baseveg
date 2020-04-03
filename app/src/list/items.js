import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import Loading from '../components/loading'
import Category from './category'
import CardItem from './card-item'
import useInfiniteScroll from '../hooks/use-infinite-scroll'
import api from '../api/item'
import categoryApi from '../api/category'

export default () => {
  // TODO: add floating button to go top
  const { categoryId } = useParams()

  const [category, setCategory] = useState(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAllItemsLoaded, setIsAllItemsLoaded] = useState(false)
  const [openAllItemsLoaded, setOpenAllItemsLoaded] = useState(false)

  const getMoreItems = async () => {
    const lastId = (items.slice().pop() || {}).id
    const nextItems = await api.loadNext(categoryId, lastId)

    if (!nextItems.length) {
      setIsAllItemsLoaded(true)
      setOpenAllItemsLoaded(true)
    } else {
      setItems([...items, ...nextItems])
    }

    setIsLoading(false)
  }

  useInfiniteScroll(() => {
    if (!isLoading && !isAllItemsLoaded) {
      setIsLoading(true)
      getMoreItems()
    } else if (isAllItemsLoaded && !openAllItemsLoaded)
      setOpenAllItemsLoaded(true)
  })

  useEffect(() => {
    (async () => setCategory(await categoryApi.get(categoryId)))()
    getMoreItems()
    window.scrollTo(0, 0)
    // disable annoying react-hooks/exhaustive-deps getMoreItems as dependency
    // eslint-disable-next-line
  }, [categoryId])

  if (!category) return <Loading />

  return (
    <>
      {isLoading && <Loading />}
      <Category data={category} isBanner />
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
                  link={`/options/${i.categoryId}/${i.id}`}
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
