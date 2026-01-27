import {
  defaultApp,
  getDefaultExport,
  getVuetifyExport,
} from './default-color-shades.js'

const app = defaultApp

export default getDefaultExport(app)
export const vuetifyColors = getVuetifyExport(app)
