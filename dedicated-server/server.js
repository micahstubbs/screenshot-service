const util = require('util')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const async = require('async')

const screenshot = require('./screenshot.js')
const cacheToBucket = require('./cache-to-bucket')
const checkBucketCache = require('./check-bucket-cache')
const getFilename = require('./util/get-filename.js')
const { Storage } = require('@google-cloud/storage')
const keys = require('./keys.js')

const app = express()
const port = 8890

app.use(bodyParser.urlencoded({ extended: false, limit: '12mb' }))
app.use(bodyParser.json({ limit: '12mb' }))

app.listen(port, () => {
  console.log(`screenshot-bot listening on port ${port}`)
})

app.get('/', async (req, res) => {
  console.log(JSON.stringify(req.query, null, 2))
  // console.log('keys from keystore', keys)
  let url = ''
  let key = ''
  let ext = 'png' // default to png
  let filename
  let pageRanges = ''
  let viewport
  let resize
  let reply

  if (req && req.query) {
    url = req.query.url
    key = req.query.id
    viewport = {
      height: Number(req.query.vheight),
      width: Number(req.query.vwidth)
    }
    resize = {
      height: Number(req.query.rheight),
      width: Number(req.query.rwidth)
    }
    reply = req.query.reply
    if (req.query.ext) ext = req.query.ext
    if (req.query.filename) filename = `${req.query.filename}.${ext}`
    if (req.query.ext === 'pdf' && req.query.pageRanges)
      pageRanges = req.query.pageRanges
    // check if request uses a known API key
    if (keys[key]) {
      console.log('req.query from /', req.query)

      // if the caller does not specify a filename
      // generate one from the provided url and file extension
      if (!filename) filename = getFilename({ url, ext })

      const contentTypeHash = {
        png: 'image/png',
        pdf: 'application/pdf'
      }
      const contentType = contentTypeHash[ext]

      res.setHeader('Content-Type', contentType)
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`)

      // check if url is already in cache
      const screenshotInBucketCache = await checkBucketCache(filename)
      if (screenshotInBucketCache) {
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
        let buffer = await screenshot({
          url,
          filename,
          ext,
          pageRanges,
          viewport,
          resize
        })

        // cache the screenshot file
        cache({ buffer, filename })

        const size = buffer.length
        res.setHeader('Content-Length', size)

        // this is a hack, should really handle POST requests
        // for when I want to screenshot and cache
        // without replying to the client
        // TODO: properly handle POST requests
        if (reply !== 'no') res.write(buffer, 'binary')
        res.end()
      }
    } else {
      res.sendStatus(401).send('uh oh, this request is missing an api key')
      res.end()
    }
  } else {
    res.sendStatus(400).send('oh no , this request is missing an query string')
    res.end()
  }
})

app.post('/', async (req, res) => {
  const data = req.body.data
  console.log(`received POST with ${data.length} pages to screenshot`)

  // 8 simultaneous screenshotAndCache operations
  const queue = async.queue(screenshotAndCache, 8)

  // define what happens when the queue is drained, or empty
  queue.drain = () => {
    console.log(`${data.length} pages screen-shotted and cached`)
  }

  // queue pages for processing
  queue.push(data)
})

async function screenshotAndCache(props) {
  const filename = `${props.filename}.${props.ext}`
  const { url, ext, pageRanges, viewport, resize } = props
  // localMode: do not call out to cloud services
  const localMode = true

  let result

  // hard code this for now
  const mode = 'path'

  if (!localMode && (await checkBucketCache(filename))) {
    result = `found in cache ${filename}`
    // console.log(result)
  } else if (await checkLocalCache(filename)) {
    // file is not in gcp bucket
    // but _is_ on our server's local filesystem

    // we don't need to screenshot it again
    // let's just...
    // upload the file from the local filesystem to the bucket
    if (!localMode) {
      const dir = `${__dirname}/screenshots`
      const path = `${dir}/${filename}`
      result = await uploadFileToBucket({ path, filename })
    }
  } else {
    // file is not in the bucket or on the local filesystem
    //
    // render screenshot
    if (mode === 'buffer') {
      const buffer = await screenshot({
        url,
        filename,
        ext,
        pageRanges,
        viewport,
        resize,
        mode
      })

      // cache the screenshot file
      if (!localMode) {
        result = await cacheToBucket({ buffer, filename, mode })
      }
    } else if (mode === 'path') {
      const path = await screenshot({
        url,
        filename,
        ext,
        pageRanges,
        viewport,
        resize,
        mode
      })

      // weirdly, this is necessary to make the caching happen
      // something to do with waiting for `path` to be defined
      // I imagine 🤔
      console.log('path from screenshot in server.js', path)

      if (!localMode) {
        result = await cacheToBucket({ path, filename, mode })
      }
    }
  }
  return result
}
