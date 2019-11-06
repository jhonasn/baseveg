import { writeFileSync as write } from 'fs'
import { nextStep, clearAccumulator } from './index.js'

export const categories = []
let lastParent = null

export default (accumulator, isLineEnd, x) => {
  if (accumulator.match(/\.+\d+/) && isLineEnd) {
    const rgx = /.*(?=(?<=[a-z]|\)|\ )\.+\d+)/
    let name = accumulator.match(rgx)[0].trim()
    const fixings = name.match(/[a-z][A-Z]/g) || []
    fixings.forEach(fix => {
      const i = name.indexOf(fix) + 1
      if (i) name = name.substring(0, i)
        .concat(' ')
        .concat(name.substring(i))
    })

    const category = { name }

    // is parent category, level 0
    if (x < 3) lastParent = name
    else category.parent = lastParent

    const key = category.name.toLowerCase().replace(/\,/g, '').split(' ')
    if (!key[0].includes('produto')) category.key = key[0]
    else if (!key[1].includes('para')) category.key = key[1]
    else category.key = key[2]

    categories.push(category)
    clearAccumulator()
  }

  if (accumulator.match(/OBSERVAÇÕES.*PRODUTOS.*\*/)) {
    write('./categories.json', JSON.stringify(categories, 1, 2))
    nextStep()
  }
}
