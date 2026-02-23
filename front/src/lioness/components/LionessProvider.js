import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useEffect } from 'react';
import Context from '../Context.js';
import { interpolate } from '../interpolate.js';
const inputIdentity = (x) => x;
export function LionessProvider({ adapter, messages, locale, children, transformInput = inputIdentity, debug = false, }) {
    adapter.setup(messages, locale);
    // Pass on new locales
    useEffect(() => {
        adapter.setLocale(locale);
    }, [adapter, locale]);
    // Create a simple translation function
    const t = useCallback((message) => {
        return adapter.translate({
            one: transformInput(message),
        });
    }, [adapter, transformInput]);
    // Create translation+interpolation function
    const ti = useCallback((params, scope) => {
        const transformedParams = {
            ...params,
            one: transformInput(params.one),
        };
        if (params.other) {
            transformedParams.other = transformInput(params.other);
        }
        const translation = adapter.translate(transformedParams);
        const interpolatedTranslation = interpolate(translation, scope);
        return interpolatedTranslation;
    }, [adapter, transformInput]);
    const context = {
        locale,
        t,
        ti,
    };
    return _jsx(Context.Provider, { value: context, children: children });
}
//# sourceMappingURL=LionessProvider.js.map