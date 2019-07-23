import { writeFileSync as write } from 'fs'
import { categories } from './extract/category.js'
import { observations } from './extract/observation.js'
import { items } from './extract/item.js'

export default () => {
  console.info('mapping')

  const mappedData = categories.map(category => ({
    ...category,
    items: items.filter(item => item.category === category.name).map(mapItem)
  }))

  const data = {
    rev: (new Date()).toLocaleDateString(),
    categories: mappedData
  }

  write(`./data.json`, JSON.stringify(data, 1, 2))
}

const mapItem = ({ name, obsId, options }) => {
  let result = { name, options }

  // add obs
  if (obsId) result = addObs(obsId, result)

  // add obs to options
  result.options = result.options.map(o => {
    const option = addObs(o.obsId, o)
    delete option.obsId
    return option
  })

  return result
}

const addObs = (id, obj) => {
  const obs = { ...observations.find(o => o.id === id) }
  delete obs.id
  return { ...obj, ...obs }
}
