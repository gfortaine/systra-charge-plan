import { useContext } from 'react';
import Context from './Context.js';
import {} from './types.js';
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
    const context = useContext(Context);
    return context;
}
//# sourceMappingURL=useTranslation.js.map