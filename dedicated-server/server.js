const express = require('express')

const app = express()
const port = 8890

app.listen(port, () => {
  console.log(`screenshot-bot listening on port ${port}`)
})
