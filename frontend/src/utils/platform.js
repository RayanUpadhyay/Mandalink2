// Where the app runs, for the install prompts. Kept in one place so Home and the install hint agree.
export const APK_URL = 'https://rayanupadhyay.com/downloads/mandalink-1.0.apk'

export function isAndroid() {
  return /Android/i.test(navigator.userAgent || '')
}

// iPhone and iPad Safari only: other iOS browsers (Chrome, Firefox, Edge, the Google app…) can't add a web app this way
export function isIosSafari() {
  const ua = navigator.userAgent || ''
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const safari = /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|YaBrowser|DuckDuckGo/.test(ua)
  return ios && safari
}

// Already installed: added to the home screen, or opened from the Android app (a Trusted Web Activity
// launches with an android-app:// referrer; remember it for the rest of the visit, because the referrer
// is gone after the first page)
export function isInstalled() {
  try {
    if (document.referrer.startsWith('android-app://')) sessionStorage.setItem('mandalink_in_app', '1')
    if (sessionStorage.getItem('mandalink_in_app') === '1') return true
  } catch (e) {}
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches
}
