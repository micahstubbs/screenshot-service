const util = require('util')
const fs = require('fs')
const express = require('express')
const screenshot = require('./screenshot.js')
const cache = require('./cache.js')
const checkCache = require('./util/check-cache.js')
const getFilename = require('./util/get-filename.js')
const { Storage } = require('@google-cloud/storage')
const keys = require('./keys.js')

const app = express()
const port = 8890

app.listen(port, () => {
  console.log(`screenshot-bot listening on port ${port}`)
})

app.get('/', async (req, res) => {
  console.log(JSON.stringify(req.query, null, 2))
  console.log('keys from keystore', keys)
  let url = ''
  let key = ''
  let ext = 'png' // default to png
  if (req && req.query) {
    url = req.query.url
    key = req.query.id
    if (req.query.ext) ext = req.query.ext
    // check if request uses a known API key
    if (keys[key]) {
      console.log('req.query from /', req.query)

      const filename = getFilename({ url, ext })

      const contentTypeHash = {
        png: 'image/png',
        pdf: 'application/pdf'
      }
      const contentType = contentTypeHash[ext]

      res.setHeader('Content-Type', contentType)
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
    } else {
      res.status(401).send('uh oh, this request is missing an api key')
      res.end()
    }
  } else {
    res.status(400).send('oh no , this request is missing an query string')
    res.end()
  }
})
