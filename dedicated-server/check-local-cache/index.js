const fs = require('fs')
const util = require('util')

module.exports = async ({ path }) => {
  const access = util.promisify(fs.access)
  try {
    await access(path)
    return true
  } catch (err) {
    // console.log(err)
    return false
  }
}
