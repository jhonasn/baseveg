import { writeFileSync as write } from 'fs'
import { nextStep, clearAccumulator } from './index.js'
import { categories } from './category.js'
import { observations } from './observation.js'
import { textFixings } from './utils.js'

export const items = []
const columns = [
  2.5, // item
  11.9, // option 1
  21.6, // option 2
  31.3, // option 3
  40.8 // option 4
]
let category = null
let currentColumn = 0
let currentLine = 0
let lastItemLine = 0

export default (accumulator, isLineEnd, x, y, nextLines) => {
  if (isLineEnd) currentLine++
  if (y <= 4) return

  // header
  const line = accumulator.concat(nextLines).trim()
  if (findCategory(line) && line.match(/ITEM/)) {
    // category change
    if (accumulator.match(/ITEM.*Opção.*1.*Opção.*2.*Opção.*3.*Opção.*4/) &&
    isLineEnd) {
      category = findCategory(accumulator).name
      clearAccumulator()
      return
    }
    return
  }

  // item
  let currentItem = items.slice().pop()
  if (x > columns[0] && x < columns[1]) {
    if (currentLine !== lastItemLine)
      items.push({ name: accumulator, category, options: [] })
    else currentItem.name += accumulator

    currentColumn = 0
    lastItemLine = currentLine
    clearAccumulator()
    return
  }

  // options
  const column = columns.find((c, i) => x > c && x < (columns[i + 1] || 200))
  const index = columns.indexOf(column)
  if (index > currentColumn) {
    currentColumn = index
    currentItem.options.push({ name: accumulator })
  } else {
    const currentOption = currentItem.options.slice().pop()
    currentOption.name += accumulator
  }
  clearAccumulator()
}

export const finalizeItems = () => {
  console.log('items extracted, finalizing')
  const adjustedItems = adjustItems()
  write('./items.json', JSON.stringify(adjustedItems, 1, 2))
  nextStep()
}

const adjustItems = () => {
  const fixOptions = options => options.map(o => ({ name: textFixings(o.name) }))
    .filter(o => o.name.length > 1)

  return items.reduce((arr, i) => {
    const name = textFixings(removeRoman(i.name))
    let item = arr.find(ai => ai.name === name)

    if (item) item.options = item.options.concat(fixOptions(i.options))
    else {
      item = { ...i, name, options: fixOptions(i.options) }
      arr.push(item)
    }

    item = addObservation(item)
    item.options = item.options.map(addObservation)

    return arr
  }, [])
}

const addObservation = item => {
  const result = item.name.match(new RegExp(/(?<=\*\()\d+(?=\))/))

  if (result) {
    const id = Number(result)
    const obs = { ...observations.find(o => o.id === id) }
    obs.obsId = obs.id
    delete obs.id

    // remove observations in the item name
    const rgxId = '\\*\\(\\d+\\)'
    const removePhrases = [
      new RegExp(`(\\ )?-.*ver.*em.*${rgxId}`, 'i'),
      new RegExp(`(\\ )?-.*ver.*quais.*(são.*liberados.*)?(em.*)?${rgxId}`, 'i'),
      new RegExp(`${rgxId}(\\ )?-.*quais.*produtos.*(não)?.*são.*liberados`, 'i'),
      new RegExp(`${rgxId}(\\ )?-.*quais.*são.*os.*produtos.*liberados`, 'i'),
      new RegExp(`(\\ )?-(\\ )?${rgxId}`, 'i'),
      new RegExp(rgxId),
    ]
    const rgx = removePhrases.find(rgx => item.name.match(rgx))
    item.name = item.name.replace(item.name.match(rgx)[0], '').trim()

    // TODO: evaluate the need of extract observation in the item name

    return { ...item, ...obs }
  } else return item
}

const findCategory = accumulator => categories.find(c =>
  accumulator.match(
    new RegExp(`^${c.name.replace(/\ /g, '.*')}`)
  )
);

const removeRoman = text => {
  let result = text.trim().match(/[IVXLCDM]+$/)
  if (result) return text.substring(0, result.index).trim()
  else return text
}
