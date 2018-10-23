const { Storage } = require('@google-cloud/storage')

module.exports = async filename => {
  const storage = new Storage()
  const bucketName = 'blockbuilder-screenshots'

  // list files in the bucket
  const results = await storage.bucket(bucketName).getFiles()

  const files = results[0]
  return files.includes(filename)
}
