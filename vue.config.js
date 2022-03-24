module.exports = {
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:9000'
      }
    }
  }
}