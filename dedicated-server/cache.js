const fs = require('fs')
const { Storage } = require('@google-cloud/storage')

// based on
// https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/File.html#createWriteStream
const cache = async props => {
  const { path, filename } = props

  const storage = new Storage()
  const bucket = storage.bucket('blockbuilder-screenshots')
  const file = bucket.file(filename)
  let publicUrl

  fs.createReadStream(path)
    .pipe(file.createWriteStream())
    .on('error', err => {
      console.log(err)
    })
    .on('finish', () => {
      // the public url can be used
      // to directly access the file via HTTP
      publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

      // make the image public to the web
      // (since we want people to be able to download it)
      file.makePublic().then(() => {
        console.log(`success! image uploaded to\n ${publicUrl}`)
      })
    })
}

module.exports = cache
