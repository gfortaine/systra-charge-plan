export function selectBestLanguage (browserLangs, supportedLangs, defaultLang) {
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
}
