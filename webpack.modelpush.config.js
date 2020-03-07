const path = require('path')

console.log(path.resolve(__dirname, 'node_modules'))

module.exports = function(env, args) {
  const config = {
    entry: { modelpush: './modelpush/index.ts' },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'build'),
    },
    target: 'async-node',
    mode: 'development',
  }

  return config
}
