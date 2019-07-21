import extractCategories from './category.js'
import extractObservations from './observation.js'
import extractItems, { finalizeItems } from './item.js'

const steps = [ 'start', 'categories', 'observations', 'items' ]
let step = steps[0] // current step
let accumulator = ''

export const nextStep = () => {
  accumulator = ''
  const idx = steps.indexOf(step)
  step = steps[idx + 1]
  if (step) console.log('step:', step)
}

export const clearAccumulator = () => accumulator = ''

export default data => {
  console.info('Intializing data extraction process')

  let lineStartX = null
  let previousX = null
  let lastFill = null
  data.forEach(({ page, content, fills }) => content.forEach(({ x, y, t }, index) => {
    const isLineEnd = x < 4 && y > 4
    const nextLines = getNextLines(content, index)

    switch (step) {
        case 'start':
          if (accumulator.match(/Lista.*Produtos.*Veganismo/)) nextStep()
        break
        case 'categories':
          extractCategories(accumulator, isLineEnd, lineStartX)
        break
        case 'observations':
          extractObservations(accumulator, isLineEnd, nextLines)
        break
        case 'items':
          const currentFill = fills.filter(f => f.y <= y).pop()
          const isItemLineEnd = currentFill && lastFill
            ? currentFill.y > lastFill.y
            : isLineEnd
          extractItems(accumulator, isItemLineEnd, previousX, y, nextLines)
          lastFill = currentFill
        break
      }

      if (y > 4) accumulator += t
      if (isLineEnd) lineStartX = x
      previousX = x
  }))

  finalizeItems()
}

const getNextLines = (content, index) => {
  const current = content[index]
  const lineSize = 1.7
  return content.filter((c, i) =>
    i >= index && c.y >= current.y && c.y <= (current.y + lineSize))
    .reduce((str, { t }) => str.concat(t), '')
}
