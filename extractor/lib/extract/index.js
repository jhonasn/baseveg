import extractCategories from './category.js'
import extractObservations from './observation.js'
import extractItems, { finalizeItems } from './item.js'

const steps = ['start', 'categories', 'observations', 'items']
let step = steps[0] // current step

export const nextStep = () => {
  const idx = steps.indexOf(step)
  step = steps[idx + 1]
  if (step) console.log('step:', step)
}

export default data => {
  console.info('Intializing data extraction process')

  const sortContent = content => content.sort((a, b) => a.y - b.y)
    // ignore footer
    .filter(l => l.y < 34)

  let contentSorted = []
  let allLines = []
  const LINE_POSITION_DIFFERENCE = 0.095

  data.forEach(({ page, content, lines }, index) => {
    const addPage = c => { c.page = page }
    content.forEach(addPage)
    lines.forEach(l => {
      l.y -= LINE_POSITION_DIFFERENCE
      addPage(l)
    })
    contentSorted = contentSorted.concat(sortContent(content))
    allLines = allLines.concat(lines.sort((a, b) => a.y - b.y))
  })

  // workaroud buggy pdf formating...
  // it happens *sometimes* when
  // next line is an item and the option content above it
  // is sliced in the middle, hidding the content text.
  // to fix it i remove the line above the item
  contentSorted.filter((c, i) =>
    c.page > 14 && c.s > 22 && c.i && !c.t.includes('Opção') &&
    contentSorted[i + 1] && contentSorted[i + 1].t.includes('Opção')
  )
    .forEach(c => {
      const lineBelowItem = allLines.find(l => l.y > c.y && c.page === l.page)
      let idxLineAbove = null

      if (lineBelowItem) {
        idxLineAbove = allLines.indexOf(lineBelowItem) - 1
      } else {
        // if there isn't a line below the item
        // then get the first line of next page
        idxLineAbove = allLines.findIndex(l => l.page === (c.page + 1))
      }

      allLines.splice(idxLineAbove, 1)
    })

  contentSorted.forEach((c, index) => {
    processLines(c, index, allLines, contentSorted)
  })

  finalizeItems()
}

const pcDisplayed = []
function processLines ({ x, y, t, s, b, i, page }, index, lines, contentSorted) {
  // const nextLines = getNextLines(contentSorted, index)
  const nextLine = contentSorted[index + 1]

  switch (step) {
    case 'start':
      if (t.match(/.*Índice.*/)) nextStep()
      break
    case 'categories':
      extractCategories(t, x)
      break
    case 'observations':
      extractObservations(t, nextLine.t)
      break
    case 'items': {
      const previous = contentSorted[index - 1]
      let previousLineY = lines.find(l =>
        l.page === previous.page && l.y > previous.y
      )
      // if there is no line bellow the content get first line of next page
      if (!previousLineY) {
        previousLineY = lines.find(l =>
          l.page === page && l.y > -1 // get first line
        )
      }
      previousLineY = previousLineY && previousLineY.y

      const isItemLineEnd = y > previousLineY

      // console.log('item: ', index)
      // if (index === 30281) debugger

      // show progress percentual
      const pc = Math.round(((index + 1) * 100) / contentSorted.length)
      if (pc % 10 === 0 && !pcDisplayed.includes(pc)) {
        console.log(`${pc}%`)
        pcDisplayed.push(pc)
      }

      extractItems({ t, x, s, b, i }, isItemLineEnd, nextLine && nextLine.t)
      break
    }
  }
}

// const getNextLines = (content, index) => {
//   const current = content[index]
//   const lineSize = 1.7
//   return content.filter((c, i) =>
//     i >= index && c.y >= current.y && c.y <= (current.y + lineSize))
//     .reduce((str, { t }) => str.concat(t), '')
// }
