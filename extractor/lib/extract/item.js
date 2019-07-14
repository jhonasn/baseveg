import { writeFileSync as write } from 'fs'
import { nextStep, clearAccumulator } from './index.js'

export const items = []

export default (accumulator, isLineEnd) => {
  if (isLineEnd) {
    clearAccumulator()
  }

  if (accumulator.match(/EOF/)) {
    write('./items.json', JSON.stringify(items, 1, 2))
    nextStep()
  }
}
