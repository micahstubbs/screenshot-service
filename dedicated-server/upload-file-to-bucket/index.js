const fs = require('fs')
const { Storage } = require('@google-cloud/storage')

module.exports = async ({ path, filename, bucketName, callback }) => {
  const storage = new Storage()
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(filename)

  // the public url can be used
  // to directly access the file via HTTP
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

  console.log('')
  console.log(`uploading file\n ${path}`)
  console.log('')

  fs.createReadStream(path)
    .pipe(file.createWriteStream())
    .on('error', err => {
      console.log(
        `uh-oh, there was a problem uploading ${path} to ${bucket.name}`
      )
      console.log(err)
    })
    .on('finish', () => {
      // make the image public to the web
      // (since we want people to be able to download it)
      file
        .makePublic()
        .then(() => {
          result = `success! uploaded & made public\n ${filename}\n to ${publicUrl}`
          console.log('')
          console.log(result)
          console.log('')
          if (typeof callback === 'function') callback()
        })
        .catch(err => {
          console.log(err)
        })
    })
}
