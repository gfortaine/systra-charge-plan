// styles
import '@scss/main.scss'
// Main app component
import App from './App.jsx'

// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { router } from '@src/router'

// Plugins
// import { createPinia } from 'pinia'
// import { createGettext } from 'vue3-gettext'
// import VueApexCharts from 'vue3-apexcharts'
// import VueDatePicker from '@vuepic/vue-datepicker'
// import '@vuepic/vue-datepicker/dist/main.css'
// import { createApolloProvider } from '@vue/apollo-option'
// import MomentAdapter from '@date-io/moment'

// Vuetify
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as localeMessages from 'vuetify/locale'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'
// import { vuetifyColors } from '@scss/sds-design-system/color-shades'
// import { aliases, fa } from 'vuetify/iconsets/fa'

// Font Awesome
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fas } from '@fortawesome/free-solid-svg-icons'

// Mapbox styles
import 'mapbox-gl/dist/mapbox-gl.css'

// i18n
import { LANGUAGES, DEFAULT_LANGUAGE } from '@src/constants'
// import translations from './translations.json'

// GraphQL
// import { graphqlMixin, apolloClient } from '@src/utils/graphql'

// config
import { mapboxPublicKey } from '@src/config'
console.assert(mapboxPublicKey)

const languageMixin = {
  methods: {
    $selectBestLanguage (browserLangs, supportedLangs, defaultLang) {
      if (browserLangs.length) {
        for (const lang of browserLangs) {
          const parts = lang.toLowerCase().split('-')
          if (parts.length > 1) {
            parts[1] = parts[1].toUpperCase()
          }
          const normLang = parts.join('-')
          if (supportedLangs.includes(normLang)) {
            return normLang
          } else if (parts.length > 1 && supportedLangs.includes(parts[0])) {
            return parts[0]
          }
        }
        return defaultLang
      } else {
        return defaultLang
      }
    },
  },
}

// const app = createApp(App)
// app.mixin(graphqlMixin)
// app.mixin(languageMixin)
// app.use(createPinia())
// app.use(router)
// app.component('Apexchart', VueApexCharts)
// app.component('VueDatePicker', VueDatePicker)
// app.component('FontAwesomeIcon', FontAwesomeIcon)
// library.add(fas)

const bestLanguage = languageMixin.methods.$selectBestLanguage(
  navigator.languages,
  Object.keys(LANGUAGES),
  DEFAULT_LANGUAGE,
)
console.log(bestLanguage)

// const vuetify = createVuetify({
//  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
//  components,
//  directives,
//  date: {
//    adapter: MomentAdapter,
//  },
//  theme: {
//    defaultTheme: 'light',
//    options: {
//      customProperties: true,
//    },
//    themes: {
//      light: {
//        dark: false,
//        colors: vuetifyColors,
//      },
//    },
//  },
//  icons: {
//    defaultSet: 'fa',
//    aliases,
//    sets: {
//      fa,
//    },
//  },
//  locale: {
//    messages: Object.assign(
//      { translations },
//      ...Object.keys(LANGUAGES).map(lang => ({ [lang]: localeMessages[lang] })),
//    ),
//    fallback: DEFAULT_LANGUAGE,
//    locale: bestLanguage,
//  },
// })
// app.use(vuetify)

// app.use(createGettext({
//  availableLanguages: LANGUAGES,
//  defaultLanguage: bestLanguage,
//  translations,
//  silent: true,
// }))
// app.use(createApolloProvider({
//  defaultClient: apolloClient,
// }))
// app.mount('#app')

createRoot(document.getElementById('app')).render((
  <StrictMode>
    <App />
  </StrictMode>
))
