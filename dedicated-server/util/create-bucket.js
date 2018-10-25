// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')

// your Google Cloud Platform project ID
const projectId = 'blockbuilder-search'

// create a client
const storage = new Storage({
  projectId: projectId
})

// the name for the new bucket
const bucketName = `test-bucket-blooming-garden-flaming-glacier`
console.log('bucketName', bucketName)

// create the new bucket
storage
  .createBucket(bucketName)
  .then(() => {
    console.log(`Bucket ${bucketName} created.`)
  })
  .catch(err => {
    console.error('ERROR:', err)
  })
