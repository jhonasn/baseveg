import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Loading from '../components/loading'
import Banner from '../components/banner'
import InfiniteScroll from '../components/infinite-scroll'
import CardIngredient from './card-ingredient'
import api from '../api/ingredient'

export default () => {
  // TODO: implement search only ingredients
  // QUESTION: bring total with loadNext? keep search in mind
  const [ingredients, setIngredients] = useState(null)
  const [total, setTotal] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadMoreIngredients = async () => {
    setIsLoading(true)

    const lastId = (ingredients.slice().pop() || {}).id
    const nextIngredients = await api.loadNext(lastId)

    if (nextIngredients.length) setIngredients([
      ...ingredients, ...nextIngredients
    ])

    setIsLoading(false)

    return !nextIngredients.length
  }

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
      <Banner
        title="Ingredientes não veganos"
        subtitle={total && `${total} ingredientes cadastrados`}
        imgName="ingredients"
        isFullWidth
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
      <InfiniteScroll
        onBottomReached={loadMoreIngredients}
        noMoreItemsMessage="Fim da lista de ingredientes"
      />
    </>
  )
}
