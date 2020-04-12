import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import useInfiniteScroll from '../hooks/use-infinite-scroll'

export default function InfiniteScroll({
  onBottomReached,
  noMoreItemsMessage = 'Fim da lista de items',
}) {
  const [noMoreItems, setNoMoreItems] = useState(false)
  const [openNoMoreItems, setOpenNoMoreItems] = useState(false)

  useInfiniteScroll(async () => {
    if (!noMoreItems) {
      let allItemsLoaded = onBottomReached()
      if (allItemsLoaded instanceof Promise) allItemsLoaded = await allItemsLoaded
      if (typeof allItemsLoaded !== 'boolean') throw new Error(
        `onBottomReached callback passed to InfiniteScroll component is not \
        returning a boolean indicating if there are no more items to load`
      )
      if (noMoreItems !== allItemsLoaded) setNoMoreItems(allItemsLoaded)
    } else setOpenNoMoreItems(true)
  })

  return (
    <Snackbar
      open={openNoMoreItems}
      onClose={() => setOpenNoMoreItems(false)}
      TransitionComponent={props => <Slide {...props} direction="up" />}
      autoHideDuration={2000}
      message={noMoreItemsMessage}
    />
  )
}
