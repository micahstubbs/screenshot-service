const puppetteer = require('puppeteer')
const filenamify = require('filenamify')
;(async () => {
  // crossfilter
  // const url =
  //   'https://bl.ocks.org/micahstubbs/raw/66db7c01723983ff028584b6f304a54a/'

  // svg line plot
  const url =
    'https://bl.ocks.org/micahstubbs/raw/3e931f7b5876254d7156a85cdd286f7b/'

  const path = `${filenamify(url)}.png`
  const browser = await puppetteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  const oneMinute = 60000
  await page.goto(url, { waitUntil: 'networkidle0', timeout: oneMinute })
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
    timeout: oneMinute
  })
  await page.screenshot({ path, fullPage: true })
  await browser.close()
})()
