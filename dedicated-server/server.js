const util = require('util')
const fs = require('fs')
const express = require('express')
const screenshot = require('./screenshot.js')
const cache = require('./cache.js')
const checkCache = require('./util/check-cache.js')
const getFilename = require('./util/get-filename.js')
const { Storage } = require('@google-cloud/storage')

const app = express()
const port = 8890

app.listen(port, () => {
  console.log(`screenshot-bot listening on port ${port}`)
})

app.get('/png', async (req, res) => {
  console.log(JSON.stringify(req.query, null, 2))
  let url = ''
  if (req && req.query) url = req.query.url
  console.log('req.query from /', req.query)

  const ext = 'png'
  const filename = getFilename({ url, ext })

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)

  // check if url is already in cache
  const screenshotInCache = await checkCache(filename)
  if (screenshotInCache) {
    // serve screenshot from the gcp bucket cache
    const bucketName = 'blockbuilder-screenshots'
    const storage = new Storage()
    const bucket = storage.bucket(bucketName)
    const remoteFile = bucket.file(filename)
    console.log(`now fetching ${filename} from gcp bucket ${bucketName}`)

    let size = 0
    remoteFile
      .createReadStream()
      .on('error', err => console.log(err))
      .on('response', response => {
        // Server connected and responded
        // with the specified status and headers
      })
      .on('data', chunk => {
        size += chunk.length
        // console.log(size)
      })
      .on('end', () => {
        // the file is fully downloaded
      })
      .pipe(res)
  } else {
    // render screenshot
    const { path } = await screenshot({ url, filename })
    console.log(JSON.stringify(screenshot, null, 2))

    const readFile = util.promisify(fs.readFile)
    const file = await readFile(path)

    // cache the screenshot file
    cache({ path, filename })

    const stat = util.promisify(fs.stat)
    const { size } = await stat(path)

    // serve the response from the local filesystem
    res.setHeader('Content-Length', size)
    res.write(file, 'binary')
    res.end()
  }
})
