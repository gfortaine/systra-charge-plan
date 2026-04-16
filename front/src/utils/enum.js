class EnumItem {
  constructor (name, value) {
    this.name = name
    this.value = value
  }

  toString () {
    return this.name
  }
}
/**
 * Usage:
 *
 * const Color = createEnum(
 *   'red',
 *   'green',
 *   'blue',
 * )
 * Color.red !== undefined && Color.red !== null
 * Color.red.name === 'red'
 * Color.red.value.toString() === 'Symbol(red)'
 * Color.red.toString() === 'red'
 * Color.fromName('red') === Color.red
 * Color.fromName('yellow') === null
 * JSON.stringify([...Color]) === JSON.stringify([Color.red, Color.green, Color.blue])
 *
 * const ColorValue = createEnum(
 *   { name: 'red', value: '#FF0000' },
 *   { name: 'green', value: '#00FF00' },
 *   { name: 'blue', value: '#0000FF' },
 * )
 * ColorValue.red !== undefined && ColorValue.red !== null
 * ColorValue.red.name === 'red'
 * ColorValue.red.value === '#FF0000'
 * ColorValue.red.toString() === 'red'
 * ColorValue.fromName('red') === ColorValue.red
 * ColorValue.fromName('yellow') === null
 * JSON.stringify([...ColorValue]) === JSON.stringify([ColorValue.red, ColorValue.green, ColorValue.blue])
 */
export default function createEnum (...names) {
  const items = names.map(obj => {
    const isObject = typeof obj == 'object'
    const name = isObject ? obj.name : obj
    const value = isObject && Object.prototype.hasOwnProperty.call(obj, 'value') ? obj.value : Symbol(name)
    return new EnumItem(name, value)
  })
  const itemsByName = items.reduce((acc, item) => {
    acc[item.name] = item
    return acc
  }, {})
  const enumCollection = {
    ...itemsByName,
    * [Symbol.iterator]() {
      yield* items
    },
    fromName(name) {
      return itemsByName[name] ?? null
    },
    fromValue(value) {
      return items.find(item => item.value === value) ?? null
    },
  }
  return Object.freeze(enumCollection)
}
