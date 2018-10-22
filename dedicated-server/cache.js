const fs = require('fs')
const storage = require('@google-cloud/storage')()

const bucket = storage.bucket('blockbuilder-screenshots')

// based on
// https://cloud.google.com/nodejs/docs/reference/storage/1.5.x/File#createWriteStream
module.exports = props => {
  const { path, filename } = props
  const file = bucket.file(filename)

  fs.createReadStream(path)
    .pipe(file.createWriteStream())
    .on('error', err => {
      console.log(err)
    })
    .on('finish', () => {
      // the public url can be used
      // to directly access the file via HTTP
      const publicUrl = `https://storage.googleapis.com/${
        bucket.name
      }/${filename}`

      // make the image public to the web
      // (since we want people to be able to download it)
      file.makePublic().then(() => {
        console.log(`success! image uploaded to\n ${publicUrl}`)
        return publicUrl
      })
    })
}
