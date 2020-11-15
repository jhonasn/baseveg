import { writeFileSync as write } from 'fs'
import { nextStep } from './index.js'
import { textFixings } from './utils.js'

export let observations = []
let obsId = 0

export default (text, nextLineText) => {
  if (nextLineText.match(/Produtos.alimentícios.e.bebidas.não.alcoólicas/g)) {
    observations = adjustObservations()
    write('./observations.json', JSON.stringify(observations, 1, 2))
    nextStep()
    return
  }

  const regexFilter = [
    // removes id and brand
    /(?<=\*\(\d+\).*- ).*/,
    /(?<=\*\(\d+\).*-).*/,
    /(?<=\*\(\d+\).*: ).*/,
    /(?<=\*\(\d+\).*:).*/,
    // removes id
    /(?<=\*\(\d+\) ).*/,
    /(?<=\*\(\d+\)).*/
  ]
  const rgxId = /(?<=\*\()\d+/

  const id = rgxId.test(text) &&
    Number(text.match(rgxId)[0])

  let obs = null
  regexFilter.find(r => {
    obs = text.match(r)
    return obs
  })
  if (obs) obs = obs[0]

  if (!obs && (id || text.length < 4)) return
  else if (!obs) obs = text

  if (id && id > obsId) {
    obsId = id
    observations.push({ id, values: [obs] })
  } else {
    const observation = observations.find(
      ({ id: oid }) => oid === obsId
    )
    if (observation) observation.values.push(obs)
  }
}

// adjust observations spreading warnings, only and except
const adjustObservations = () => {
  const rgxWarning = /^Atenção/i
  const rgxOnly = /^Somente/i
  const rgxExcept = /^Exceto/i
  const allRgx = [rgxWarning, rgxOnly, rgxExcept]
  const getAllAdjacentItems = (arr, item, rgx) => {
    const idx = arr.indexOf(item)
    const otherRgx = allRgx.filter(r => r !== rgx)
    return arr.filter((i, index) => index >= idx &&
      !otherRgx.some(r => i.match(r)))
  }

  const rgxArticles = '(\\ )?(as)?(os)?(a)?(o)?'
  const rgxOnlyAdd = '(esses são liberados)?(\\:)?'
  const rgxExceptAdd = '((\\()?(não são liberados)(\\))?(\\:)?)?'

  return observations.map(o => {
    const warningItem = o.values.find(v => v.match(rgxWarning))
    let warnings = warningItem
      ? getAllAdjacentItems(o.values, warningItem, rgxWarning)
      : []

    const onlyItem = o.values.find(v => v.match(rgxOnly))
    let only = onlyItem
      ? getAllAdjacentItems(o.values, onlyItem, rgxOnly)
      : []

    const exceptItem = o.values.find(v => v.match(rgxExcept))
    let except = exceptItem
      ? getAllAdjacentItems(o.values, exceptItem, rgxExcept)
      : []

    const values = o.values.filter(v =>
      !warnings.some(w => w === v) &&
      !only.some(on => on === v) &&
      !except.some(e => e === v)
    ).join('')

    warnings = warnings.map(v => v.replace(
      new RegExp(`^(Atenção\\:|\\*Atenção)${rgxArticles}`, 'i'), '')
      .trim()).join('')

    only = only.map(v => v.replace(
      new RegExp(`^(Somente\\:|Somente)${rgxArticles}${rgxOnlyAdd}`, 'i'), '')
      .trim()).join('')

    except = except.map(v => v.replace(
      new RegExp(`^(Exceto\\:|Exceto)${rgxExceptAdd}${rgxArticles}`, 'i'), '')
      .trim()).join('')

    const { id } = o
    return removeEmptyProps({
      id,
      observations: textFixings(values),
      warnings: textFixings(warnings),
      only: textFixings(only),
      except: textFixings(except)
    })
  })
}

const removeEmptyProps = obj => Object.keys(obj)
  .reduce((o, k) => obj[k]
    ? { ...o, [k]: obj[k] }
    : o, {})
