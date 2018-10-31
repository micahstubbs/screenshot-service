const sharp = require('sharp')

// input (Buffer|String)
// if present, can be
// a Buffer containing
// JPEG, PNG, WebP, GIF, SVG, TIFF or raw pixel image data,
// or
// a String containing the path to an
// JPEG, PNG, WebP, GIF, SVG or TIFF image file.
// http://sharp.dimens.io/en/stable/api-constructor/

module.exports = async ({ input, width, height, outPath }) => {
  // returns a Promise
  return await sharp(input)
    .resize(width, height)
    .toFile(outPath)
}
