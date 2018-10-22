const fs = require('fs')
const puppetteer = require('puppeteer')
const filenamify = require('filenamify')

module.exports = async url => {
  console.log('url from screenshot.js', url)

  // if url does not have http?s://, prepend it
  if (!/http?s:\/\//.test(url)) url = `http://${url}`
  console.log('url after checking protocol', url)

  const pathDir = './screenshots'
  const path = `${pathDir}/${filenamify(url, { replacement: '-' }).replace(
    /[\.%=]/g,
    '-'
  )}.png`
  if (!fs.existsSync(pathDir)) fs.mkdirSync(pathDir)

  const browser = await puppetteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  const oneMinute = 60000
  await page.goto(url, { waitUntil: 'networkidle0', timeout: oneMinute })
  await page.screenshot({ path, fullPage: true })
  await browser.close()
  return path
}
