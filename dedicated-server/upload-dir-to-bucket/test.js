const uploadDirToBucket = require('./index.js')

uploadDirToBucket({
  path: '../screenshots',
  bucketName: 'blockbuilder-screenshots'
})
