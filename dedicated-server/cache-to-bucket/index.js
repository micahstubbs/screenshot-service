const fs = require('fs')
const stream = require('stream')
const { Storage } = require('@google-cloud/storage')
const uploadFileToBucket = require('../upload-file-to-bucket')

// based on
// https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/File.html#createWriteStream
const cacheToBucket = async props => {
  const { path, buffer, filename, mode } = props
  // console.log('filename from cacheToBucket', filename)
  // console.log('path from cacheToBucket', path)
  let result

  const storage = new Storage()
  const bucket = storage.bucket('blockbuilder-screenshots')
  const file = bucket.file(filename)

  // the public url can be used
  // to directly access the file via HTTP
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

  if (mode === 'buffer') {
    console.log('')
    console.log(`caching ${buffer.length} bytes from buffer\n ${filename}`)
    console.log('')

    // use gcloud's file.save API
    // to directly upload a buffer
    // https://github.com/googleapis/google-cloud-node/pull/1233
    file.save(buffer, function(err) {
      if (err) console.log(err)
      else {
        file
          .makePublic()
          .then(() => {
            result = `success! uploaded & made public\n ${filename}\n to ${publicUrl}`
            console.log('')
            console.log(result)
            console.log('')
          })
          .catch(err => console.log(err))
      }
    })
  } else if (mode === 'path') {
    result = uploadFileToBucket({ path, filename })
  } else {
    result = `error: no mode specified, valid modes are 'path', 'buffer'`
    console.log('')
    console.log(result)
    console.log('')
  }
  return result
}

module.exports = cacheToBucket
