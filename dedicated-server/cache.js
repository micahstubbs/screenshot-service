const fs = require('fs')
const stream = require('stream')
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

  let readStream
  if (buffer) {
    console.log('buffer.length', buffer.length)
    const readStreamSource = new stream.PassThrough()
    readStream = readStreamSource.end(buffer)
  } else if (path) {
    console.log('path.length', path.length)
    readStream = fs.createReadStream(readStreamSource)
  } else console.log(`error: no file path or buffer provided`)

  // if (readStream) {
  readStream
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
  // }
}

module.exports = cache
