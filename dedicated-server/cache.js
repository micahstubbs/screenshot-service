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
  if (path) readStreamSource = path
  else if (buffer) readStreamSource = buffer
  else console.log(`error: no file path or buffer provided`)

  if (readStreamSouce) {
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
