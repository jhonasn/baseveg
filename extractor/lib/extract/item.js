import { writeFileSync as write } from 'fs'
import { nextStep } from './index.js'
import { categories } from './category.js'
import { textFixings } from './utils.js'

export let items = []
export let options = []
const columns = [
  1.512, // start option 1
  9.778, // start option 2
  17.862, // start option 3
  26.129, // start option 4
  33.756, // start option 5
  41.469 // end option 5
]
let categoryId = null
let currentLine = 0
let itemId = 0
let optionId = 0

export default ({ t: text, x, s, b, i }, isLineEnd, nextLineText) => {
  if (isLineEnd) currentLine++

  const isItem = s > 22 && i
  const isCategory = (s > 34 && i) || (s > 19 && b)

  // is option line or blank option
  if (text.match(/Opção.*\d/) || text.match(/\/+/)) {
    if (isLineEnd) currentLine++
    return
  }

  // category
  // workaroud difference in index naming
  const isFirstCategory = text.match(/Produtos.alimentícios.e.bebidas/)
  const category = findCategory(text)
  if (isFirstCategory || (isCategory && category)) {
    if (isFirstCategory) categoryId = categories[0].id
    // category change
    else if (isCategory && isLineEnd) categoryId = category.id
    return
  }

  // item
  if (isItem && nextLineText && nextLineText.includes('Opção')) {
    items.push({ id: ++itemId, name: text, categoryId })

    currentLine++
    return
  }

  // options
  const column = columns.find((c, i) => x >= c && x < (columns[i + 1] || 200))
  const index = columns.indexOf(column)
  const option = options.find(o => o.line === currentLine && o.column === index)
  if (!option) {
    options.push({
      id: ++optionId,
      name: text,
      itemId: itemId,
      line: currentLine,
      column: index
    })
  } else option.name += text
}

export const finalizeItems = () => {
  console.log('items extracted, finalizing')
  options = adjustOptions()
  items = adjustItems()
  write('./items.json', JSON.stringify(items, 1, 2))
  write('./options.json', JSON.stringify(options, 1, 2))
  nextStep()
}

const adjustItems = () => {
  return items.reduce((arr, i) => {
    // group items removing roman sufix
    const name = textFixings(removeRoman(i.name))
    let item = arr.find(ai => ai.name === name)
    let isItemAdd = false

    if (!item) {
      item = { ...i, name }
      isItemAdd = true
    } else if (i.id !== item.id) {
      // group item name, so bring options from the current item
      options.filter(o => o.itemId === i.id).forEach(o => {
        o.itemId = item.id
      })
    }

    item.optionsCount = options.filter(o => o.itemId === item.id).length
    item = addObservation(item)

    if (isItemAdd) arr.push(item)

    return arr
  }, [])
}

const adjustOptions = () =>
  options.map(o => {
    delete o.line
    delete o.column
    return { ...o, name: textFixings(o.name) }
  })
    .filter(o => o.name.length > 1)
    .map(addObservation)

const addObservation = item => {
  const result = item.name.match(new RegExp(/(?<=\*\()\d+(?=\))/))

  if (result) {
    const obsId = Number(result)

    // remove observations in the item name
    const rgxId = '\\*\\(\\d+\\)'
    const removePhrases = [
      new RegExp(`(\\ )?-.*ver.*em.*${rgxId}`, 'i'),
      new RegExp(`(\\ )?-.*ver.*quais.*(são.*liberados.*)?(em.*)?${rgxId}`, 'i'),
      new RegExp(`${rgxId}(\\ )?-.*quais.*produtos.*(não)?.*são.*liberados`, 'i'),
      new RegExp(`${rgxId}(\\ )?-.*quais.*são.*os.*produtos.*liberados`, 'i'),
      new RegExp(`(\\ )?-(\\ )?${rgxId}`, 'i'),
      new RegExp(rgxId)
    ]
    const rgx = removePhrases.find(rgx => item.name.match(rgx))
    item.name = item.name.replace(item.name.match(rgx)[0], '').trim()

    // TODO: evaluate the need of extract observation in the item name

    return { ...item, obsId }
  } else return item
}

const findCategory = text => categories.find(c =>
  text.toLowerCase().match(
    new RegExp(`^${c.name.toLowerCase().replace(/ /g, '.*')}`)
  )
)

const removeRoman = text => {
  const result = text.trim().match(/[IVXLCDM]+$/)
  if (result) return text.substring(0, result.index).trim()
  else return text
}
