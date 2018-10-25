const filenamify = require('filenamify')

module.exports = ({ url, ext }) => {
  return `${filenamify(url, { replacement: '-' }).replace(
    /[\.%=]/g,
    '-'
  )}.${ext}`
}
