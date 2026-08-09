// Must match the ALLOWED_AVATARS set in UserController.java exactly.
export const AVATARS = {
  panda: '🐼', tiger: '🐯', fox: '🦊', rabbit: '🐰',
  frog: '🐸', lion: '🦁', koala: '🐨', monkey: '🐵',
  owl: '🦉', dragon: '🐲', blossom: '🌸', star: '⭐',
  fire: '🔥', wave: '🌊', clover: '🍀', target: '🎯'
}

export function avatarEmoji(id) {
  return AVATARS[id] || AVATARS.panda
}
