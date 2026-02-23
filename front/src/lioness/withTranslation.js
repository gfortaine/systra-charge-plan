import { jsx as _jsx } from "react/jsx-runtime";
/* eslint react/jsx-props-no-spreading: 0 */
import React, {} from 'react';
import {} from './types.js';
import { useTranslation } from './useTranslation.js';
// function getDisplayName(Component: ElementType | ComponentType): string {
//   if (Component.hasOwnProperty('displayName')) {
//     return Component.displayName
//   }
//   return String(Component)
// }
/**
 * Provides the given component with Lioness context as props.
 */
export function withTranslation(WrappedComponent) {
    const ComponentWithTranslators = (props) => {
        const context = useTranslation();
        return _jsx(WrappedComponent, { ...context, ...props });
    };
    // ComponentWithTranslators.displayName = `withTranslation(${getDisplayName(
    //   WrappedComponent
    // )})`
    return ComponentWithTranslators;
}
//# sourceMappingURL=withTranslation.js.map