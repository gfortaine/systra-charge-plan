import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import React, {} from 'react';
import { useTranslation } from '../useTranslation.js';
import { withTranslation } from '../withTranslation.js';
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
    const { ti } = useTranslation();
    const msgid = one || children || '';
    const payload = {
        context,
        one: msgid,
        other,
        count,
    };
    const scopeWithCount = { ...scope, count };
    const translatedContent = ti(payload, scopeWithCount);
    return _jsx(_Fragment, { children: translatedContent });
}
//# sourceMappingURL=T.js.map