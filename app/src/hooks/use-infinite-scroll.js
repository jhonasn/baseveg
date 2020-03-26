import { useEffect } from 'react'
import debounce from 'lodash/debounce'

export default function useInfiniteScroll (onBottomReached) {
  const infiniteScroll = debounce(() => {
    if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight) {
      onBottomReached()
    }
  }, 100)

  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll)

    return () => {
      window.removeEventListener('scroll', infiniteScroll)
    }
  }, [infiniteScroll])
}
