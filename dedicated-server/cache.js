const util = require('util')
const fs = require('fs')
const { Storage } = require('@google-cloud/storage')
const path = require('path')

module.exports = async props => {
  const { path, filename } = props

  //
  // write to bucket
  //

  // Instantiate a storage client
  //
  // note: we don't need to specify a key file
  // since we're running this on a gcp vm
  // that can use default application credentials
  const googleCloudStorage = new Storage()

  const readFile = util.promisify(fs.readFile)
  const file = await readFile(path)

  // A bucket is a container for objects (files)
  console.log(
    'process.env.GCLOUD_STORAGE_BUCKET',
    process.env.GCLOUD_STORAGE_BUCKET
  )
  const bucket = googleCloudStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET)

  // Create a new blob in the bucket and upload the file data
  const blob = bucket.file(file)
  const blobStream = blob.createWriteStream()

  blobStream.on('error', err => {
    next(err)
    return
  })

  blobStream.on('finish', () => {
    // the public url can be used
    // to directly access the file via HTTP
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${
      blob.name
    }`

    // make the image public to the web
    // (since we want people to be able to download it)
    blob.makePublic().then(() => {
      console.log(`success! image uploaded to\n ${publicUrl}`)
    })
  })

  blobStream.end()

  // store { filename: publicUrl } key, value pair in redis
}
