const express = require('express')
const screenshot = require('./screenshot.js')

const app = express()
const port = 8890

app.listen(port, () => {
  console.log(`screenshot-bot listening on port ${port}`)
})

app.get('/', async (req, res) => {
  console.log(JSON.stringify(req.query, null, 2))
  let url = ''
  if (req && req.query) url = req.query.url
  console.log('req.query from /', req.query)
  const screenshotPath = await screenshot(url)
  res.send(`screenshot of ${url} taken and stored at ${screenshotPath}`)
})
