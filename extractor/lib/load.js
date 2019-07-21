import {
    readFileSync as read,
    writeFileSync as write,
    existsSync as exists
} from 'fs'
import { basename, extname } from 'path'
import PdfParser from 'pdf2json'
import { prepareData } from './extract/prepare.js'

export default async () => {
  const [,,path] = process.argv

  if (!path || !extname(path).includes('pdf') || !exists(path)) {
    console.warn('Inform a pdf file!')
    process.exit()
  }

  const pathCacheFile = `./cache-${basename(path).replace(extname(path), '.json')}`
  if (exists(pathCacheFile)) {
    console.info('Cache file found!')
    return JSON.parse(read(pathCacheFile))
  } else console.info('Analysing file: ', path)

  const getPdfDataAsync = () => new Promise((res, rej) => {
    const parser = new PdfParser()
    parser.loadPDF(path)
    parser.on('pdfParser_dataReady', data => res(data))
  })
  const data = await getPdfDataAsync()

  const cache = prepareData(data)
  write(pathCacheFile.replace('.json', '_original.json'), JSON.stringify(data, 1, 2))
  write(pathCacheFile, JSON.stringify(cache, 1, 2))
  return cache
}
