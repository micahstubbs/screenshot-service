const uploadFileToBucket = require('./index.js')

const filename = `https-bl-ocks-org-micahstubbs-raw-fa129089b7989975e96b166077f74de4-thumbnail.png`
const path = `${__dirname}/${filename}`
uploadFileToBucket({ path, filename })
