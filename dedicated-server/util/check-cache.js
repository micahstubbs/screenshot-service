const { Storage } = require('@google-cloud/storage')

module.exports = async filename => {
  const bucketName = 'blockbuilder-screenshots'
  const storage = new Storage()
  const options = {
    prefix: filename
  }

  try {
    // Lists files in the bucket
    const results = await storage.bucket(bucketName).getFiles(options)
    const files = results[0]
    if (files.length > 0) return true
  } catch (err) {
    console.error('ERROR:', err)
  }
  return false
}
