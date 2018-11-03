const fs = require('fs')
const uploadFileToBucket = require('../upload-file-to-bucket/')

module.exports = async ({ path, bucketName }) => {
  // list all files in dir at path
  const files = fs.readdirSync(path)
  let filepath
  let i = 0
  // iterate through files and upload each to the bucket
  next()

  function next() {
    filename = files[i]
    filepath = `${path}/${filename}`
    i += 1
    if (i < files.length) {
      uploadFileToBucket({
        path: filepath,
        filename,
        bucketName,
        callback: next
      })
    }
  }
}
