const compiler = require('./compiler')
const {
  resolve
} = require('path')
const {
  patchRequire
} = require('fs-monkey')
const process = require('process')
const fs = require('fs')

const {
  vol
} = require('./compiler')

describe('buf-loader', function () {
  it('#simple', async function () {
    this.timeout(0)
    const xlsx = resolve(__dirname, './sample.xlsx')
    const stats = await compiler(xlsx)
    // const source = vol.readFileSync(resolve(__dirname, './bundle.js'), 'utf8')
    let output = stats.toJson({
      source: true
    }).modules[0].source;
    output = output.replace(/export\s+default/, 'module.exports = ')
    vol.writeFileSync('/bundle.js', output)
    // set true in windows
    patchRequire(vol, process.platform === "win32")
    const buffer1 = require('/bundle.js')
    // 原始数据的buffer
    const buffer2 = fs.readFileSync(xlsx)

    for (let i = 0; i < buffer1.length; i++) {
      if (buffer1[i] !== buffer2[i]) {
        return Promise.reject('not equal')
      }
    }
  })
})