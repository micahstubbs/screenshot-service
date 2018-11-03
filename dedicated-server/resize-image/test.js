const resizeImage = require(`${__dirname}/../resize-image/`)

const test = async () => {
  const dir = `${__dirname}/../screenshots`
  const path = `${dir}/https-bl-ocks-org-micahstubbs-raw-3e931f7b5876254d7156a85cdd286f7b.png`
  const outPath = `${dir}/https-bl-ocks-org-micahstubbs-raw-3e931f7b5876254d7156a85cdd286f7b-thumbnail.png`
  const result = await resizeImage({
    input: path,
    width: 230,
    height: 120,
    outPath
  })
  console.log(JSON.stringify(result, null, 2))
}

test()
