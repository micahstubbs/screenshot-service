const resize = require(`${__dirname}/../resize/`)

const test = async () => {
  const dir = `${__dirname}/../screenshots`
  const path = `${dir}/https-bl-ocks-org-micahstubbs-raw-3e931f7b5876254d7156a85cdd286f7b.png`
  const outPath = `${dir}/https-bl-ocks-org-micahstubbs-raw-3e931f7b5876254d7156a85cdd286f7b-thumbnail.png`
  const result = await resize({
    input: path,
    width: 230,
    height: 120,
    outPath
  })
  console.log(JSON.stringify(result, null, 2))
  // if (result.err) console.log(result.err)
  // else console.log(JSON.stringify(result.info, null, 2))
}

test()
