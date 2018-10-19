const puppetteer = require('puppeteer')
;(async () => {
  const url =
    'https://bl.ocks.org/micahstubbs/raw/66db7c01723983ff028584b6f304a54a/'
  const path = `crossfilter-block.png`
  const browser = await puppetteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.goto(url)
  await page.screenshot({ path })
  await browser.close()
})()
