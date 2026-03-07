export const trim = true
export const trimLines = true
export const trimNewlines = true
const simpleFormat = 'msgid'
const fullFormat = {
  one: 'msgid',
  other: 'msgid_plural',
  context: 'msgctxt',
}
export const funcArgumentsMap = {
  t: [simpleFormat],
  ti: [fullFormat],
}
export const componentPropsMap = {
  T: fullFormat,
}
