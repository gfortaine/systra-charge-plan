import { jsx } from 'react/jsx-runtime'
import {
  Children,
  Fragment,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import Gettext from 'node-gettext'

// Note that [^] is used rather than . to match any character. This
// is because . doesn't span over multiple lines, whereas [^] does.
const variableRegex = /(\{\{\s[^]+?(?=\s\}\})\s\}\})/g
/**
 * Returns whether a string is a template variable.
 *
 * @param  {String}    str  A string
 * @return {Boolean}        True if the string is a template variable,
 *                          false if not
 */
export function isTemplateVariable(str) {
  return new RegExp(variableRegex).test(str)
}
/**
 * Returns a "key:value" as a [key, value] tuple.
 *
 * @param  {String} keyValue  A "key:value" string
 * @return {Array}            A [key, value] tuple
 */
function getScopeKeyValuePair(keyValue) {
  const parts = keyValue.split(/:([^]+)/)
  return parts.length > 1
    ? [parts[0], parts[1]]
    : [parts[0], null]
}
/**
 * Interpolates a string, with support for injecting React components.
 *
 * @param  {String}    str    A string to be interpolated
 * @param  {Object}    scope  An object with variable names and their
 *                            replacements
 * @return {String|Component} A string or React component
 */
export function interpolate(str, scope = {}) {
  if (!str) {
    return str
  }
  // Split string into array with regular text and variables split
  // into separate segments, like ['This is a ', '{{ thing }}', '!']
  const parts = str.split(new RegExp(variableRegex)).filter(x => x)
  // If the only thing we have is a single regular string, just return it as is
  if (parts.length === 1
    && parts[0] !== undefined
    && isTemplateVariable(parts[0]) === false) {
    return str
  }
  const interpolatedParts = parts.map((part, i) => {
    // Not a template variable, return as is
    if (isTemplateVariable(part) === false) {
      return part
    }
    const partContents = part
      .replace(/^\{\{\s/, '')
      .replace(/\s\}\}$/, '')
    const [key, value] = getScopeKeyValuePair(partContents)
    const replacement = scope[key]
    // No matching scope replacement, return raw string
    if (replacement === undefined) {
      return part
    }
    // Let the caller create the result
    if (typeof replacement === 'function') {
      return replacement(value)
    }
    // If the interpolated scope variable is not a React element, render
    // it as a string
    if (isValidElement(replacement) === false) {
      return String(replacement)
    }
    // Returns a clone of the to-be injected element, passing child content
    // from the scope if it exists
    const reactKey = `${part}_${i}`
    return value === null
      ? cloneElement(replacement, { key: reactKey })
      : cloneElement(replacement, { key: reactKey }, value)
  })
  if (interpolatedParts.every((part) => isValidElement(part) === false)) {
    return interpolatedParts.join('')
  }
  if (interpolatedParts.length === 1) {
    return interpolatedParts[0]
  }
  return jsx(Fragment, { children: Children.toArray(interpolatedParts) })
}

/**
 * Creates an adapter for node-gettext.
 *
 * @param  {GettextOptions} options  node-gettext options
 * @return {Adapter}                 An adapter
 */
export function createNodeGettextAdapter(options) {
  const gt = new Gettext(options)
  return {
    /**
     * Add translations for each locale
     */
    setup: (messages, locale) => {
      Object.keys(messages).forEach(lang => {
        gt.addTranslations(lang, 'messages', messages[lang])
      })
      gt.setLocale(locale)
    },
    /**
     * Set current locale
     */
    setLocale: locale => gt.setLocale(locale),
    /**
     * Get a translation
     */
    translate: ({ one, other = '', context = '', count = 1 }) => gt.npgettext(context, one, other, count),
  }
}

const Context = createContext({})
const inputIdentity = (x) => x

export function LionessProvider({ adapter, messages, locale, children, transformInput = inputIdentity }) {
  adapter.setup(messages, locale)
  // Pass on new locales
  useEffect(() => {
    adapter.setLocale(locale)
  }, [adapter, locale])
  // Create a simple translation function
  const t = useCallback((message, scope) => {
    const translation = adapter.translate({
      one: transformInput(message),
    })
    if (scope) {
      const interpolatedTranslation = interpolate(translation, scope)
      return interpolatedTranslation
    } else {
      return translation
    }
  }, [adapter, transformInput])
  // Create translation+interpolation function
  const ti = useCallback((params, scope) => {
    const transformedParams = {
      ...params,
      one: transformInput(params.one),
    }
    if (params.other) {
      transformedParams.other = transformInput(params.other)
    }
    const translation = adapter.translate(transformedParams)
    if (scope) {
      const interpolatedTranslation = interpolate(translation, scope)
      return interpolatedTranslation
    } else {
      return translation
    }
  }, [adapter, transformInput])
  const context = {
    locale,
    t,
    ti,
  }
  return jsx(Context.Provider, { value: context, children: children })
}

/**
 * A hook that returns the Lioness context.
 *
 * @example Render a translation using `t`:
 * ```js
 * function Comp() {
 *   const { t } = useTranslation()
 *
 *   return (
 *     <div>{t('Some translated text')}</div>
 *   )
 * }
 * ```
 *
 * @returns {LionessContext} The Lioness context
 */
export function useTranslation() {
  return useContext(Context)
}

/**
 * Provides the given component with Lioness context as props.
 */
export function withTranslation(WrappedComponent) {
  return (props) => {
    const context = useTranslation()
    return jsx(WrappedComponent, { ...context, ...props })
  }
}

/**
 * Renders translated content.
 *
 * @example Render a simple translation
 * ```jsx
 * <T>Have a nice day</T>
 * ```
 *
 * @example Render a pluralized translation
 * ```jsx
 * <T one="One thing" other="{{ count }} things" count={things.length} />
 * ```
 *
 * @example Render simple interpolated content
 * ```jsx
 * <T one="Welcome, {{ name }}!" name={user.name} />
 * ```
 *
 * @example Render translation with interpolated component
 * ```jsx
 * <T one="{{ icon }} Error" icon={<ErrorIcon />} />
 * ```
 *
 * @example Render interpolated component with injected content
 * ```jsx
 * <T
 *   one="Learn more at {{ link:our website }}"
 *   link={<a href="http://website.com" />}
 * />
 * ```
 *
 * @param {object} props
 * @property {string} one - Message in plural (as prop)
 * @property {string} children - Message in singular (inside component)
 * @property {string} other - Message in plural
 * @property {string} context - Gettext context
 * @property {boolean} count - Pluralization count
 * @returns {jsx | string} Translated and interpolated content
 */
export function T({ one, children, other, context, count, ...scope }) {
  const { ti: _ti } = useTranslation()
  const msgid = one || children || ''
  const payload = {
    context,
    one: msgid,
    other,
    count,
  }
  const scopeWithCount = { ...scope, count }
  const translatedContent = _ti(payload, scopeWithCount)
  return jsx(Fragment, { children: translatedContent })
}
