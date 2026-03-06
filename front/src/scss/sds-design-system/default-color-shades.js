/* color shades for Systra Digital Solutions */

export const transversal = {
  d50: '#E6ECED', // rgb(230, 236, 237)
  d100: '#B3C5C9', // rgb(179, 197, 201)
  d200: '#809EA5',
  d300: '#4D7781',
  d400: '#1A505D',
  d500: '#003C4B', // rgb(0, 60, 75)
  d600: '#00303C',
  d700: '#00242D',
  d800: '#001216',
  d900: '#000C0F',
  d950: '#000607',
}
transversal.main = transversal.d500

export const transport = {
  d50: '#F9E8F0',
  d100: '#EDB9D3',
  d200: '#E28AB6',
  d300: '#D65B98',
  d400: '#CA2C7B',
  d500: '#C4146C',
  d600: '#A50F61',
  d700: '#840D54',
  d800: '#620A36',
  d900: '#3B0620',
  d950: '#14020B',
}
transport.main = transport.d500

export const sustainable = {
  d50: '#E8F5F8',
  d100: '#B9E2EA',
  d200: '#8BCFDD',
  d300: '#5CBBCF',
  d400: '#2DA8C1',
  d500: '#169EBA',
  d600: '#148EA7',
  d700: '#0F6F82',
  d800: '#0B4F5D',
  d900: '#072F38',
  d950: '#021013',
}
sustainable.main = sustainable.d500

export const engineering = {
  d50: '#FEEAB3',
  d100: '#FEEAB3',
  d200: '#FDDD80',
  d300: '#FCCF4D',
  d400: '#FBC11A',
  d500: '#FABA00',
  d600: '#E1A700',
  d700: '#B57E0F',
  d800: '#7C5600',
  d900: '#4B3800',
  d950: '#191300',
}
engineering.main = engineering.d500

export const operations = {
  d50: '#F1ECFB',
  d100: '#D6C7F3',
  d200: '#BAA1EB',
  d300: '#9169DE',
  d400: '#8356DA',
  d500: '#7543D6',
  d600: '#693CC1',
  d700: '#522F96',
  d800: '#3B226B',
  d900: '#231440',
  d950: '#0C0715',
}
operations.main = operations.d500

export const sds = { // SDS
  primary: '#5B5FC7',
  primary_light: '#A7A9E1',
  primary_dark: '#3D3E78',
  secondary: '#2C3E4E',
  secondary_light: '#C0C5CA',
  secondary_dark: '#0F1C27',
}

export const neutrals = { // neutral colors
  white: '#FFFFFF',
  grey_ultralight: '#F6F6F6', // rgb(246, 246, 246)
  grey_light: '#E3E3E3', // rgb(277, 277, 277)
  grey_medium: '#9E9E9E', // rgb(158, 158, 158)
  grey_dark: '#5B5B5B', // rgb(91, 91, 91)
  black: '#000000',
}

export const data = { // data visualization
  blue: '#2196F3', // rgb(33, 150, 243)
  light_blue: '#00BCD4', // rgb(0, 188, 212)
  green: '#4CAF50', // rgb(76, 155, 80)
  light_green: '#CDDC39', // rgb(205, 220, 51)
  yellow: '#FFC107', // rgb(255, 193, 7)
  orange: '#FF7B30', // rgb(255, 123, 48)
  pink: '#E91E63', // rgb(233, 30, 99)
  purple: '#673AB7', // rgb(103, 58, 183)
  red: '#E42626', // rgb(228, 38, 38)
}

export const alerts = { // alert colors
  success_green: data.green,
  warning_orange: data.orange,
  warning_yellow: data.yellow,
  error_red: data.red,
}

export const defaultApp = {
  main: transversal.main,
  primary: sds.primary,
  primary_light: sds.primary_light,
  primary_dark: sds.primary_dark,
  secondary: sds.secondary,
  secondary_light: sds.secondary_light,
  secondary_dark: sds.secondary_dark,
  success: alerts.success_green,
  warning: alerts.warning_orange,
  error: alerts.error_red,
}
export function verifyApp(app) {
  for (const key of Object.keys(defaultApp)) {
    if (!app[key]) {
      const msg = `${key} is required in app ${app}`
      console.error(msg)
      throw msg
    }
  }
}
export default function getDefaultExport(app) {
  if (!app) {
    app = { ...defaultApp }
  } else {
    verifyApp(app)
  }
  return {
    neutrals,
    ...neutrals,
    data,
    ...data,
    ...Object.fromEntries(Object.entries(data).map(([key, value]) => [`data_${key}`, value])),
    alerts,
    ...alerts,
    sds,
    ...Object.fromEntries(Object.entries(sds).map(([key, value]) => [`sds_${key}`, value])),
    ...app,
  }
}
