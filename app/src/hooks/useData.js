import { useState, useEffect } from 'react'
import jsonData from '../data.json'

export default () => {
  const [data, setData] = useState({})

  if (!data.categories && jsonData) {
    // TODO: Implement render more when scroll hit the end of screen
    const categories = jsonData.categories
    categories.forEach(c => c.items = c.items.slice(0, 20))
    setData({ categories })
  }

  return data
}
