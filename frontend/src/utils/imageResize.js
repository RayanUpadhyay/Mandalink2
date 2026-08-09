// Resizes/compresses an image file down to a small square JPEG before
// upload, so we rarely hit the server's size cap and uploads stay fast.
export function resizeImageFile(file, maxDim = 240, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not read image'))
      img.onload = () => {
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2

        const canvas = document.createElement('canvas')
        canvas.width = maxDim
        canvas.height = maxDim
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, sx, sy, side, side, 0, 0, maxDim, maxDim)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
