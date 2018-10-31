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
  resize,
  mode
}) => {
  console.log('url from screenshot.js', url)

  // if url does not have http?s://, prepend it
  if (!/http?s:\/\//.test(url)) url = `http://${url}`
  // console.log('url after checking protocol', url)

  let fullPage = true

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

  // navigate to the page we want to screenshot
  // wait until the network is idle or one minute, whichever is shorter
  const oneMinute = 60000
  await page.goto(url, { waitUntil: 'networkidle0', timeout: oneMinute })

  if (mode === 'buffer') {
    //
    // return a raw pixel buffer
    //

    // screenshot the page
    let buffer
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
  } else if (mode === 'path') {
    //
    // write the screenshot file to the local filesystem
    // return a string path to that file
    //

    pathDir = `${__dirname}/screenshots`
    path = `${pathDir}/${filename}`

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

    // screenshot the page
    let path
    if (ext === 'png') {
      path = await page.screenshot({ path, fullPage })
      if (resize && resize.width && resize.height) {
        buffer = sharp(buffer)
          .resize(resize.width, resize.height)
          .toBuffer()
      }
    }
    if (ext === 'pdf') {
      const format = 'letter'
      const landscape = true
      buffer = await page.pdf({ path, format, landscape, pageRanges })
    }

    await page.close()
    await browser.close()

    return path
  }
}
