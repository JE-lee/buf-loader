const { resolve } = require('path')
const path = require('path')
const webpack = require('webpack')
const { createFsFromVolume, Volume } = require('memfs')

const vol = createFsFromVolume(new Volume())

module.exports = function compiler(entry) {
  const config = {
    context: __dirname,
    entry: entry,
    output: {
      path: resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /.xlsx$/,
          use: resolve(__dirname, '../src/main.js'),
        },
      ],
    },
  }
  const compiler = webpack(config)
  compiler.outputFileSystem = vol;
  compiler.outputFileSystem.join = path.join.bind(path);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(stats.toJson().errors);
      else resolve(stats)
    })
  })
}

module.exports.vol = vol
