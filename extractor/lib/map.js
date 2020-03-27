import {
  readFileSync as read,
  writeFileSync as write,
  existsSync as exists
} from 'fs'
import { categories } from './extract/category.js'
import { observations } from './extract/observation.js'
import { items, options } from './extract/item.js'

export default () => {
  console.info('mapping')

  const { ingredients, fonts } = getIngredients()

  const data = {
    rev: (new Date()).toLocaleDateString(),
    categories: categories,
    items,
    options,
    fonts,
    ingredients,
  }

  console.info('saving...')
  const jsonData = JSON.stringify(data, 1, 2)
  write('./data.json', jsonData)

  console.info('exporting to app...')
  write('../app/public/data.json', jsonData)
}

const getIngredients = () => {
  console.info('mapping ingredients')
  const pathIngredients = './ingredients.json'
  if (!exists(pathIngredients)) return []

  const ingredients = JSON.parse(read(pathIngredients, 'utf8'))

  const mapOtherIngredients = (type, i) => ({
    type,
    name: i,
    descriptionShort: ingredients[type].descriptionShort,
    fontId: ingredients[type].fontId,
  })

  let id = 0

  const data = ingredients.general.concat(
    ingredients.animal.ingredients.map(mapOtherIngredients.bind(null, 'animal'))
  ).concat(
    ingredients.milk.ingredients.map(mapOtherIngredients.bind(null, 'milk'))
  ).map(i => ({
    // add id and general type
    id: ++id, type: i.type || 'general', ...i
  }))

  return { ingredients: data, fonts: ingredients.links }
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
