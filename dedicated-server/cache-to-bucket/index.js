const fs = require('fs')
const stream = require('stream')
const { Storage } = require('@google-cloud/storage')

// based on
// https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/File.html#createWriteStream
const cacheToBucket = async props => {
  const { path, buffer, filename } = props
  let result

  const storage = new Storage()
  const bucket = storage.bucket('blockbuilder-screenshots')
  const file = bucket.file(filename)

  // the public url can be used
  // to directly access the file via HTTP
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

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
          result = `success! uploaded & made public\n ${filename}\n to ${publicUrl}`
          console.log('')
          console.log(result)
          console.log('')
        })
      }
    })
  } else if (path) {
    console.log('')
    console.log(`caching file\n ${path}`)
    console.log('')
    fs.createReadStream(path)
      .pipe(file.createWriteStream())
      .on('error', err => {
        console.log(err)
      })
      .on('finish', () => {
        // make the image public to the web
        // (since we want people to be able to download it)
        file.makePublic().then(() => {
          result = `success! uploaded & made public\n ${filename}\n to ${publicUrl}`
          console.log('')
          console.log(result)
          console.log('')
        })
      })
  } else {
    result = 'error: no file path or buffer provided'
    console.log('')
    console.log(result)
    console.log('')
  }
  return result
}

module.exports = cacheToBucket
