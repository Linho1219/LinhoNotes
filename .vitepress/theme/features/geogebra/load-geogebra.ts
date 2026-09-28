const GEOGEBRA_SCRIPT_URL = 'https://www.geogebra.org/apps/deployggb.js'
const GEOGEBRA_SCRIPT_SELECTOR = `script[src="${GEOGEBRA_SCRIPT_URL}"]`

let loader: Promise<void> | undefined

export function loadGeoGebra(): Promise<void> {
  if (typeof GGBApplet !== 'undefined') return Promise.resolve()

  if (typeof document === 'undefined') {
    return Promise.reject(new Error('GeoGebra can only be loaded in a browser'))
  }

  if (loader) return loader

  loader = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(GEOGEBRA_SCRIPT_SELECTOR)
    const shouldAppend = !script

    if (!script) {
      script = document.createElement('script')
      script.src = GEOGEBRA_SCRIPT_URL
      script.async = true
    }

    const cleanup = () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }

    const handleLoad = () => {
      cleanup()
      if (typeof GGBApplet === 'undefined') {
        reject(new Error('GeoGebra script loaded without exposing GGBApplet'))
        return
      }
      resolve()
    }

    const handleError = () => {
      cleanup()
      script.remove()
      reject(new Error('Failed to load the GeoGebra script'))
    }

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })

    // An existing script may have finished between the initial global check
    // and listener registration.
    if (typeof GGBApplet !== 'undefined') handleLoad()
    else if (shouldAppend) document.head.append(script)
  }).catch((error) => {
    loader = undefined
    throw error
  })

  return loader
}
