import { isAbsolute, join } from 'path'

async function load(fileName) {
  try {
    const content = (await import(fileName)).default
    const scss = transformJSONtoSass(content)
    console.log('/* stylelint-disable */')
    console.log(scss)
  } catch (error) {
    throw new Error('Error transforming JS module to SASS. Check if your JS module parses correctly.', { cause: error })
  }
}

export function transformJSONtoSass(json) {
  return parseMapAsList(json)
    .map(line => `$${line};`)
    .join('\n')
}

export function toKebabCase(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase()
}

function parseMapAsList(map) {
  return Object.keys(map)
    .filter(key => isValidKey(key))
    .map(key => `${toKebabCase(key)}: ${parseValue(map[key])}`)
}

function isValidKey(key) {
  return /^[^$@:].*/.test(key) && key !== '#' // json5 comments
}

function parseValue(value) {
  if (Array.isArray(value)) {
    return parseList(value)
  } else if (typeof value === 'object') {
    return parseMap(value)
  } else if (value === '') {
    return '""' // Return explicitly an empty string
  } else {
    return value
  }
}

function parseList(list) {
  const lst = list.map(value => parseValue(value))
  return `(${lst.join(',')})`
}

function parseMap(map) {
  return `(${parseMapAsList(map)})`
}

const moduleFileName = process.argv[2]
if (!moduleFileName) {
  console.error('Please provide a JS module file path as an argument.')
  process.exit(1)
}
// Convert the relative path to an absolute path
const absoluteFileName = isAbsolute(moduleFileName) ? moduleFileName : join(process.cwd(), moduleFileName)
load(absoluteFileName)
