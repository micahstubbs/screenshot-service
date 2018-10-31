const util = require('util')
const fs = require('fs')
const puppeteer = require('puppeteer')
const sharp = require('sharp')

module.exports = async ({
  url,
  filename,
  ext,
  pageRanges,
  viewport,
  resize
}) => {
  console.log('url from screenshot.js', url)

  // if url does not have http?s://, prepend it
  if (!/http?s:\/\//.test(url)) url = `http://${url}`
  // console.log('url after checking protocol', url)

  let fullPage = true

  // const pathDir = `${__dirname}/screenshots`
  // const path = `${pathDir}/${filename}`

  // if the path does not exist, create it
  // const access = util.promisify(fs.access)
  // const mkdir = util.promisify(fs.mkdir)
  // try {
  //   let pathExists = await access(pathDir)
  // } catch (err) {
  //   console.log(`${pathDir} does not exist yet`)
  //   try {
  //     await mkdir(pathDir)
  //     console.log(`created ${pathDir}`)
  //   } catch (err) {
  //     console.log(`error creating ${pathDir}`)
  //     console.log(err)
  //   }
  // }

  // launch the headless browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  // load the page
  const page = await browser.newPage()

  // if specified, set the viewport
  if (viewport && viewport.width && viewport.height) {
    await page.setViewport(viewport)
    fullPage = false
  }

  // screenshot the page
  let buffer
  const oneMinute = 60000
  await page.goto(url, { waitUntil: 'networkidle0', timeout: oneMinute })
  if (ext === 'png') {
    buffer = await page.screenshot({ fullPage })
    if (resize && resize.width && resize.height) {
      buffer = sharp(buffer)
        .resize(resize.width, resize.height)
        .toBuffer()
    }
  }
  if (ext === 'pdf') {
    buffer = await page.pdf({ format: 'letter', landscape: true, pageRanges })
  }

  await page.close()
  await browser.close()

  return buffer
}
