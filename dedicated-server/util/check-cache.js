const { Storage } = require('@google-cloud/storage')

module.exports = filename => {
  const storage = new Storage()
  const bucketName = 'blockbuilder-screenshots'

  // Lists files in the bucket
  storage
    .bucket(bucketName)
    .getFiles()
    .then(results => {
      console.log('results', results)
      const files = results[0]

      console.log('files:')
      files.forEach(file => {
        console.log(file.name)
      })
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
}
