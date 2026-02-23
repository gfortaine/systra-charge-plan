// eslint-disable-next-line
import Gettext from 'node-gettext';
/**
 * Creates an adapter for node-gettext.
 *
 * @param  {GettextOptions} options  node-gettext options
 * @return {Adapter}                 An adapter
 */
export function createNodeGettextAdapter(options) {
    const gt = new Gettext(options);
    return {
        /**
         * Add translations for each locale
         */
        setup: (messages, locale) => {
            Object.keys(messages).forEach((lang) => {
                gt.addTranslations(lang, 'messages', messages[lang]);
            });
            gt.setLocale(locale);
        },
        /**
         * Set current locale
         */
        setLocale: (locale) => gt.setLocale(locale),
        /**
         * Get a translation
         */
        translate: ({ one, other = '', context = '', count = 1 }) => gt.npgettext(context, one, other, count),
    };
}
//# sourceMappingURL=createNodeGettextAdapter.js.map