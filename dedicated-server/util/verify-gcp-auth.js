// verify local gcp auth setttings
// by listing all buckets in the current active gcp project
// you may need to go configure IAM permissions for your service account
// to get this to work
//
// https://console.cloud.google.com/iam-admin/iam

// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage')

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage()

// Makes an authenticated API request.
storage
  .getBuckets()
  .then(results => {
    const buckets = results[0]

    console.log('Buckets:')
    buckets.forEach(bucket => {
      console.log(bucket.name)
    })
  })
  .catch(err => {
    console.error('ERROR:', err)
  })
