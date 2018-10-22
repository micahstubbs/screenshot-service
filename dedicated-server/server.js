const util = require('util')
const fs = require('fs')
const express = require('express')
const screenshot = require('./screenshot.js')
const cache = require('./cache.js')

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

  // an object with path, filename properties
  const { path, filename } = await screenshot(url)
  console.log(JSON.stringify(screenshot, null, 2))

  const readFile = util.promisify(fs.readFile)
  const file = await readFile(path)

  // cache the file
  cache({ path, filename })

  const stat = util.promisify(fs.stat)
  const { size } = await stat(path)

  res.setHeader('Content-Length', size)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  res.write(file, 'binary')
  res.end()
})
