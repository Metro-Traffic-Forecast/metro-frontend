module.exports = {
    lintOnSave: false,
    devServer: {
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
