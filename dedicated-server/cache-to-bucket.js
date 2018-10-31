const fs = require('fs')
const stream = require('stream')
const { Storage } = require('@google-cloud/storage')

// based on
// https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/File.html#createWriteStream
const cacheToBucket = async props => {
  const { path, buffer, filename } = props

  const storage = new Storage()
  const bucket = storage.bucket('blockbuilder-screenshots')
  const file = bucket.file(filename)

  // the public url can be used
  // to directly access the file via HTTP
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

  let readStream
  if (buffer) {
    console.log('')
    console.log(`caching ${buffer.length} bytes from buffer\n ${filename}`)
    console.log('')

    // use gcloud's file.save API
    // to directly upload a buffer
    // https://github.com/googleapis/google-cloud-node/pull/1233
    file.save(buffer, function(err) {
      if (err) console.log(err)
      else {
        file.makePublic().then(() => {
          console.log('')
          console.log(
            `success! uploaded & made public\n ${filename}\n to ${publicUrl}`
          )
          console.log('')
        })
      }
    })
  } else if (path) {
    console.log('')
    console.log(`caching ${buffer.length} bytes from file\n ${path}`)
    console.log('')
    fs.createReadStream(readStreamSource)
      .pipe(file.createWriteStream())
      .on('error', err => {
        console.log(err)
      })
      .on('finish', () => {
        // make the image public to the web
        // (since we want people to be able to download it)
        file.makePublic().then(() => {
          console.log('')
          console.log(
            `success! uploaded & made public\n ${filename}\n to ${publicUrl}`
          )
          console.log('')
        })
      })
  } else console.log(`error: no file path or buffer provided`)
}

module.exports = cacheToBucket
