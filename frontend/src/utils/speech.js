// Text-to-speech for Mandarin characters using the browser's built-in
// Web Speech API. No backend, no API key, no cost — works wherever the
// browser ships a zh-CN voice (Chrome, Edge, Safari all do by default).

let cachedVoice = null
let voicesReady = false

function pickChineseVoice() {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices()
  const voice =
    voices.find(v => v.lang === 'zh-CN') ||
    voices.find(v => v.lang && v.lang.startsWith('zh')) ||
    null
  if (voice) cachedVoice = voice
  return voice
}

// Voice lists load asynchronously in some browsers — prime it once.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesReady = true
    pickChineseVoice()
  }
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speakChinese(text) {
  if (!isSpeechSupported() || !text) return false
  try {
    window.speechSynthesis.cancel() // stop anything already playing
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85 // a little slower than default, easier to follow
    const voice = pickChineseVoice()
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
    return true
  } catch (e) {
    return false
  }
}
