import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import Loading from '../components/loading'
import Category from '../list/category'
import CardIngredient from './card-ingredient'
import useInfiniteScroll from '../hooks/use-infinite-scroll'
import api from '../api/ingredient'

export default () => {
  // TODO: implement search only ingredients
  // QUESTION: bring total with loadNext? keep search in mind
  const [ingredients, setIngredients] = useState(null)
  const [total, setTotal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAllItemsLoaded, setIsAllItemsLoaded] = useState(false)
  const [openAllItemsLoaded, setOpenAllItemsLoaded] = useState(false)

  useInfiniteScroll(() => {
    if (!isLoading && !isAllItemsLoaded) {
      setIsLoading(true)

      const lastId = (ingredients.slice().pop() || {}).id
      ;(async () => {
        const nextIngredients = await api.loadNext(lastId)

        if (!nextIngredients.length) {
          setIsAllItemsLoaded(true)
          setOpenAllItemsLoaded(true)
        } else {
          setIngredients([ ...ingredients, ...nextIngredients ])
        }

        setIsLoading(false)
      })()
    } else if (isAllItemsLoaded && !openAllItemsLoaded)
      setOpenAllItemsLoaded(true)
  })

  useEffect(() => {
    (async () => {
      setIngredients(await api.loadNext())
      setTotal(await api.count())
    })()
    window.scrollTo(0, 0)
  }, [])

  if (!ingredients) return <Loading />

  return (
    <>
      {isLoading && <Loading />}
      <Category
        item={{ id: 'ingredients', name: 'Ingredientes não veganos' }}
        category={{
          id: 'count', name: total && `${total} ingredientes cadastrados`
        }}
        noType
        banner
      />
      <Container>
        {ingredients.map(i => (
          <Grid item xs={12} key={i.id}>
            <CardIngredient
              id={i.id}
              ingredient={i}
            />
          </Grid>
        ))}
      </Container>
      <Snackbar
        open={openAllItemsLoaded}
        onClose={() => setOpenAllItemsLoaded(false)}
        TransitionComponent={props => <Slide {...props} direction="up" />}
        autoHideDuration={2000}
        message={'Fim da lista de ingredientes'}
      />
    </>
  )
}
