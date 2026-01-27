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
  const BaseEnum = Object.create({
    _names: [],
    [Symbol.iterator]: function* () {
      for (const name of this._names) {
        yield this[name]
      }
    },
    fromName: function (name) {
      for (const item of this) {
        if (item.name === name) {
          return item
        }
      }
      return null
    },
    fromValue: function (value) {
      for (const item of this) {
        if (item.value === value) {
          return item
        }
      }
      return null
    },
  })
  for (const obj of names) {
    const name = obj.hasOwnProperty('name') ? obj.name : obj
    const value = obj.hasOwnProperty('value') ? obj.value : Symbol(obj)
    BaseEnum._names.push(name)
    BaseEnum[name] = new EnumItem(name, value)
  }
  return Object.freeze(BaseEnum)
}
