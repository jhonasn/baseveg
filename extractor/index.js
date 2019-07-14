import {
    readFileSync as read,
    writeFileSync as write, 
    existsSync as exists
} from 'fs'
import { basename, extname } from 'path'
import PdfParser from 'pdf2json'

let jsonFile = null

const [,,file] = process.argv

if (!file || !extname(file).includes('pdf') || !exists(file)) {
    console.warn('Inform a pdf file!')
    process.exit()
}

const nameJsonFile = `./cache-${basename(file).replace(extname(file), '.json')}`
if (exists(nameJsonFile)) {
    console.info('Cache file found!')
    jsonFile = JSON.parse(read(nameJsonFile))
} else console.info('Analysing file: ', file)


const categories = []
let observations = []

const steps = [ 'start', 'categories', 'observations', 'items' ]
let step = steps[0] // current step

const processJson = data => {
    console.info('Intializing data scrap process')
    let simplified = null
    if (!jsonFile) {
        simplified = data.formImage.Pages.map((p, index) => ({
            page: (index + 1),
            content: p.Texts.map(
                ({ x, y, R: [ { T } ] }) => ({ x, y, t: decodeURIComponent(T) })
            )
        }))
        
        write(nameJsonFile, JSON.stringify(simplified, 1, 2))
    } else simplified = jsonFile
    
    let accumulator = ''
    let lastParent = null
    let obsId = 0
    const nextStep = () => {
        accumulator = ''
        const idx = steps.indexOf(step)
        step = steps[idx + 1]
    }

    simplified.forEach(({ page, content }) => content.forEach(({ x, y, t }) => {
        const isLineEnd = x < 4 && y > 4

        switch (step) {
            case 'start':
                if (accumulator.match(/Lista.*Produtos.*Veganismo/)) nextStep()
            break
            case 'categories':
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
                    const category = { name, productTypes: [] }

                    // is parent category, level 0
                    if (x < 3) lastParent = name
                    else category.parent = lastParent
                    
                    categories.push(category)
                    accumulator = ''
                }
                
                if (accumulator.match(/OBSERVAÇÕES.*PRODUTOS.*\*/)) nextStep()
            break
            case 'observations':                
                if (isLineEnd) {
                    const regexFilter = [
                        // removes id and brand
                        /(?<=\*\(\d+\).*\-\ ).*/,
                        /(?<=\*\(\d+\).*\-).*/,
                        /(?<=\*\(\d+\).*\:\ ).*/,
                        /(?<=\*\(\d+\).*\:).*/,
                        // removes id
                        /(?<=\*\(\d+\)\ ).*/,
                        /(?<=\*\(\d+\)).*/,
                    ]
                    const rgxId = /(?<=\*\()\d+/
                    
                    const id = rgxId.test(accumulator) &&
                        Number(accumulator.match(rgxId)[0])
                        
                    let obs = null 
                    regexFilter.find(r => obs = accumulator.match(r))
                    if (obs) obs = obs[0]
                    
                    if (!obs && id || accumulator.length < 4) break
                    else if (!obs) obs = accumulator

                    if (id && id > obsId) {
                        obsId = id
                        observations.push({
                            id, values: [ obs ]
                        })
                    } else {
                        const observation = observations.find(
                            ({ id: oid }) => oid === obsId
                        )
                        observation.values.push(obs)
                    }
                    
                    accumulator = ''
                }
                
                const rgx = categories[0].name.replace(/\ /g, '.*')
                if (accumulator.match(new RegExp(rgx))) {
                    adjustObservations()
                    nextStep()
                }
            break
            case 'items':
            break
        }
        
        if (y > 4) accumulator += t
    }))
    
    write('categories.json', JSON.stringify(categories, 1, 2))
    write('observations.json', JSON.stringify(observations, 1, 2))
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
    
    observations = observations.map(o => {
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

        return { id: o.id, values, warnings, only, except }
    })
}

if (jsonFile) processJson(jsonFile)
else {
    const parser = new PdfParser()
    parser.loadPDF(file)
    parser.on('pdfParser_dataReady', processJson)
}

