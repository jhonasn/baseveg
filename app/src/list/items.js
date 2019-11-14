import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Fab from '@material-ui/core/Fab'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Category from './category'
import CardItem from './card-item'
import debounce from 'lodash/debounce'
import { getNextItems as getItems, categories } from '../api'

const useStyles = makeStyles(theme => ({
  loading: {
    position: 'fixed',
    top: theme.spacing(12),
    zIndex: 1,
    textAlign: 'center',
  },
  loadingFab: {
    backgroundColor: theme.palette.background.paper,
  }
}))

export default () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(null)

  const handleOpenCategory = (c) => {
    setItems(getItems(c.key))
    if (categoryOpen === c.key) setCategoryOpen(null)
    else setCategoryOpen(c.key)
  }

  useEffect(() => {
    return () => {
      window.onscroll = null
    }
  }, [])

  if (!categories) return <Container><CircularProgress /></Container>

  const infiniteScroll = debounce(() => {
    // TODO: detect when comming close to last loaded card and load more items
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
    }
    infiniteScroll()
  }

  return (
    <>
      {isLoading &&
        <Container className={classes.loading}>
            <Fab className={classes.loadingFab}>
              <CircularProgress color="secondary" className={classes.circle} />
            </Fab>
        </Container>}
      <Category
        category={{
          name: 'Lista de produtos liberados do grupo Vegajuda - Veganismo',
          key: 'vegajuda'
        }}
        banner
      />
      <Container fixed>
        {categories && categories.map((c, cidx) => (
          <React.Fragment key={cidx}>
            <Category
              category={c}
              isOpen={categoryOpen === c.key}
              onOpen={() => handleOpenCategory(c)}
            />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start"
              spacing={1}
            >
              {categoryOpen === c.key &&
                items.filter(i => i.category === c.key).map((i, iidx) => (
                  <Grid item xs={12} key={`${cidx}-${iidx}`}>
                    <CardItem
                      item={i}
                      link={`options/${c.key}/${i.key}`}
                    />
                  </Grid>))}
            </Grid>
          </React.Fragment>
        ))}
      </Container>
    </>
  )
}
