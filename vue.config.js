module.exports = {
    lintOnSave: false,
    devServer: {
        port: 8081,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://host.tanhuiri.cn:19527',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}
