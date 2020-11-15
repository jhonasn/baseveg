import { writeFileSync as write } from 'fs'
import { nextStep } from './index.js'

export const categories = []
let lastParent = null
let isIgnoring = false

export default (text, x) => {
  if (!isIgnoring) {
    let name = text.replace(/\t/g, ' ').trim()
    const fixings = name.match(/[a-z][A-Z]/g) || []
    fixings.forEach(fix => {
      const i = name.indexOf(fix) + 1
      if (i) {
        name = name.substring(0, i)
          .concat(' ')
          .concat(name.substring(i))
      }
    })

    // fix over a randon number in the page
    if (name.match(/\d+|Observações/)) {
      return
    }

    const category = { name }

    // is parent category, level 0
    if (x < 3) lastParent = name
    else category.parent = lastParent

    // remove accents, diacritics and commas
    const id = category.name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/,/g, '')
      // eslint-disable-next-line
      .split(' ')
    if (!id[0].includes('produto')) category.id = id[0]
    else if (!id[1].includes('para')) category.id = id[1]
    else category.id = id[2]

    categories.push(category)

    if (category.id === 'diversos') isIgnoring = true
  }

  if (text.match(/OBSERVAÇÕES.*PRODUTOS.*\*/)) {
    write('./categories.json', JSON.stringify(categories, 1, 2))
    nextStep()
  }
}
