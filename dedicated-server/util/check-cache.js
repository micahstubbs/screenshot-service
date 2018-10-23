const { Storage } = require('@google-cloud/storage')

module.exports = filename => {
  const storage = new Storage()
  const bucketName = 'blockbuilder-screenshots'

  // list files in the bucket
  storage
    .bucket(bucketName)
    .getFiles()
    .then(results => {
      const files = results[0]
      return files.includes(filename)
    })
    .catch(err => {
      console.error('ERROR', err)
    })
}
