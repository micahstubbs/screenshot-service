const util = require('util')
const fs = require('fs')
const puppetteer = require('puppeteer')

module.exports = async ({ url, filename, ext, pageRanges }) => {
  console.log('url from screenshot.js', url)

  // if url does not have http?s://, prepend it
  if (!/http?s:\/\//.test(url)) url = `http://${url}`
  console.log('url after checking protocol', url)

  const pathDir = `${__dirname}/screenshots`
  const path = `${pathDir}/${filename}`

  // if the path does not exist, create it
  const access = util.promisify(fs.access)
  const mkdir = util.promisify(fs.mkdir)
  try {
    let pathExists = await access(pathDir)
  } catch (err) {
    console.log(`${pathDir} does not exist yet`)
    try {
      await mkdir(pathDir)
      console.log(`created ${pathDir}`)
    } catch (err) {
      console.log(`error creating ${pathDir}`)
      console.log(err)
    }
  }

  // launch the headless browser
  const browser = await puppetteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  // load the page
  const page = await browser.newPage()

  // screenshot the page
  const oneMinute = 60000
  await page.goto(url, { waitUntil: 'networkidle0', timeout: oneMinute })
  if (ext === 'png') await page.screenshot({ path, fullPage: true })
  if (ext === 'pdf') {
    console.log('pageRanges', pageRanges)
    await page.pdf({ path, format: 'letter', landscape: true, pageRanges })
  }

  console.log(`screenshot stored at ${path}`)
  await browser.close()

  // return the location of the screenshot
  // on the local filesystem
  return { path }
}
