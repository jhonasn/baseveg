import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Category from './category'
import CardItem from './card-item'
import debounce from 'lodash/debounce'
import { getNextItems as getItems, resetItems, categories } from '../api'

const useStyles = makeStyles(theme => ({
  loading: {
    position: 'fixed',
    top: theme.spacing(12),
    zIndex: 1,
  },
}))

export default () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setItems(getItems())
    return () => {
      resetItems()
      window.onscroll = null
    }
  }, [])

  if (!categories || !items.length) return <Container><CircularProgress /></Container>

  const idxShowCategoriesUntil = categories.findIndex(c =>
    c.key === items[items.length - 1].category)

  const infiniteScroll = debounce(() => {

    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight) {
      const data = [...items, ...getItems()]
      setItems(data)
      setIsLoading(false)
    }
  }, 100)

  window.onscroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 500 && !isLoading) {
      setIsLoading(true)
      console.log('infinite')
    }
    infiniteScroll()
  }

  return (
    <>
      {isLoading &&
        <Container className={classes.loading}>
          <CircularProgress color="secondary" />
        </Container>}
      <Category
        category={{
          name: 'Lista de produtos liberados do grupo Vegajuda - Veganismo',
          key: 'vegajuda'
        }}
        banner
      />
      <Container fixed>
        {categories && categories.filter((_, idx) => idx <= idxShowCategoriesUntil)
          .map((c, cidx) => (
            <React.Fragment key={cidx}>
              <Category category={c} />
              {items.filter(i => i.category === c.key).map((i, iidx) => (
                <CardItem key={`${cidx}-${iidx}`} item={i} link={`options/${cidx}/${items.indexOf(i)}`} />
              ))}
            </React.Fragment>
          ))}
      </Container>
    </>
  )
}
