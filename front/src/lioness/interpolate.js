import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import React, { Children, cloneElement, isValidElement, } from 'react';
// Note that [^] is used rather than . to match any character. This
// is because . doesn't span over multiple lines, whereas [^] does.
const variableRegex = /(\{\{\s[^]+?(?=\s\}\})\s\}\})/g;
/**
 * Returns whether a string is a template variable.
 *
 * @param  {String}    str  A string
 * @return {Boolean}        True if the string is a template variable,
 *                          false if not
 */
export function isTemplateVariable(str) {
    return new RegExp(variableRegex).test(str);
}
/**
 * Returns a "key:value" as a [key, value] tuple.
 *
 * @param  {String} keyValue  A "key:value" string
 * @return {Array}            A [key, value] tuple
 */
function getScopeKeyValuePair(keyValue) {
    const parts = keyValue.split(/:([^]+)/);
    return parts.length > 1
        ? [parts[0], parts[1]]
        : [parts[0], null];
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
        return str;
    }
    // Split string into array with regular text and variables split
    // into separate segments, like ['This is a ', '{{ thing }}', '!']
    const parts = str.split(new RegExp(variableRegex)).filter((x) => x);
    // If the only thing we have is a single regular string, just return it as is
    if (parts.length === 1 &&
        parts[0] !== undefined &&
        isTemplateVariable(parts[0]) === false) {
        return str;
    }
    const interpolatedParts = parts.map((part, i) => {
        // Not a template variable, return as is
        if (isTemplateVariable(part) === false) {
            return part;
        }
        const partContents = part
            .replace(/^\{\{\s/, '')
            .replace(/\s\}\}$/, '');
        const [key, value] = getScopeKeyValuePair(partContents);
        const replacement = scope[key];
        // No matching scope replacement, return raw string
        if (replacement === undefined) {
            return part;
        }
        // Let the caller create the result
        if (typeof replacement === 'function') {
            return replacement(value);
        }
        // If the interpolated scope variable is not a React element, render
        // it as a string
        if (isValidElement(replacement) === false) {
            return String(replacement);
        }
        // Returns a clone of the to-be injected element, passing child content
        // from the scope if it exists
        const reactKey = `${part}_${i}`;
        return value === null
            ? cloneElement(replacement, { key: reactKey })
            : cloneElement(replacement, { key: reactKey }, value);
    });
    if (interpolatedParts.every((part) => isValidElement(part) === false)) {
        return interpolatedParts.join('');
    }
    if (interpolatedParts.length === 1) {
        return interpolatedParts[0];
    }
    return _jsx(_Fragment, { children: Children.toArray(interpolatedParts) });
}
//# sourceMappingURL=interpolate.js.map