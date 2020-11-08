import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from 'routes/recent/api'

export default function useRecentRecorder() {
  const location = useLocation()

  useEffect(() => {
    const [, path, ...params] = location.pathname.split('/')

    if (path === 'items') {
      const [categoryId] = params
      api.add('category', categoryId)
    } else if (path === 'options') {
      const [, itemId] = params
      api.add('item', itemId)
    } else if (path === 'search') {
      const [search] = params
      api.add('search', search)
    }
  }, [location])
}
