const puppeteer = require('puppeteer')

exports.screenshot = async (req, res) => {
  const url = req.query.url

  if (!url) {
    const anchorTag = `<a href="?url=https://example.com">?url=https://example.com</a>`
    return res.send(
      `Please provide URL as GET parameter, for example: ${anchorTag}`
    )
  }

  // launch headless Chrome
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })

  // visit the page we want to screenshot
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.waitForNavigation({ waitUntil: 'networkidle0' })

  // take a screenshot of the full page
  const imageBuffer = await page.screenshot({
    fullPage: true
  })

  // close the headless browser
  await browser.close()

  // send the screenshot back to the requester
  res.set('Content-Type', 'image/png')
  res.send(imageBuffer)
}
