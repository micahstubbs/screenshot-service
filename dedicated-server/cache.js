const fs = require('fs')
const { Storage } = require('@google-cloud/storage')

// based on
// https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/File.html#createWriteStream
const cache = async props => {
  const { path, buffer, filename } = props

  const storage = new Storage()
  const bucket = storage.bucket('blockbuilder-screenshots')
  const file = bucket.file(filename)

  // the public url can be used
  // to directly access the file via HTTP
  publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

  let readStreamSource
  if (buffer) {
    console.log('readStreamSource = buffer')
    console.log('buffer.length', buffer.length)
    readStreamSource = buffer
  } else if (path) {
    console.log('readStreamSource = path')
    console.log('path.length', path.length)
    readStreamSource = path
  } else console.log(`error: no file path or buffer provided`)

  if (readStreamSource) {
    fs.createReadStream(readStreamSource)
      .pipe(file.createWriteStream())
      .on('error', err => {
        console.log(err)
      })
      .on('finish', () => {
        // make the image public to the web
        // (since we want people to be able to download it)
        file.makePublic().then(() => {
          console.log(`success! image uploaded to\n ${publicUrl}`)
        })
      })
  }
}

module.exports = cache
