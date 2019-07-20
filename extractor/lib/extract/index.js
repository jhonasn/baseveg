import extractCategories from './category.js'
import extractObservations from './observation.js'
import extractItems, { finalizeItems } from './item.js'

// pre-process json file to extraction needs
export const preProcess = data => data.formImage.Pages.map((p, index) => ({
  page: (index + 1),
  content: p.Texts.map(
    ({ x, y, R: [ { T } ] }) => ({ x, y, t: decodeURIComponent(T) })
  )
}))

const steps = [ 'start', 'categories', 'observations', 'items' ]
let step = steps[0] // current step
let accumulator = ''

export const nextStep = () => {
  accumulator = ''
  const idx = steps.indexOf(step)
  step = steps[idx + 1]
}

export const clearAccumulator = () => accumulator = ''

export default data => {
  console.info('Intializing data extraction process')

  let lineStartX = null
  let previousX = null
  data.forEach(({ page, content }) => content.forEach(({ x, y, t }, index) => {
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
          extractItems(accumulator, isLineEnd, previousX, y, nextLines)
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
