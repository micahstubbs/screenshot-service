const puppetteer = require('puppeteer')
const filenamify = require('filenamify')
;(async () => {
  // crossfilter
  // const url =
  //   'https://bl.ocks.org/micahstubbs/raw/66db7c01723983ff028584b6f304a54a/'

  // crossfilter filtered view
  const url =
    'https://bl.ocks.org/micahstubbs/raw/67d7aa147948d701e336f1f0589bf1e1/?date=Fri%2520Feb%252009%25202001%252000%253A00%253A00%2520GMT-0800%2520%28Pacific%2520Standard%2520Time%29--Tue%2520Feb%252020%25202001%252000%253A00%253A00%2520GMT-0800%2520%28Pacific%2520Standard%2520Time%29&distance%2520%28mi.%29=255--440&arrival%2520delay%2520%28min.%29=29--69&time%2520of%2520day=19.799999999999997--22.200000000000003'

  // svg line plot
  // const url =
  //   'https://bl.ocks.org/micahstubbs/raw/3e931f7b5876254d7156a85cdd286f7b/'

  const path = `./screenshots/${filenamify(url, { replacement: '-' }).replace(
    /\./g,
    '-'
  )}.png`
  const browser = await puppetteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  const oneMinute = 60000
  await page.goto(url, { waitUntil: 'networkidle0', timeout: oneMinute })
  await page.screenshot({ path, fullPage: true })
  await browser.close()
})()
