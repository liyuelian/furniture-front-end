const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true
})
module.exports = {
    devServer: {
        port: 10001,//启动端口
        proxy: {//设置代理，必须填
            '/api': {//设置拦截器  拦截器格式
                target: 'http://localhost:8080/furniture',//代理的目标地址，就是/api代替的地址
                changeOrigin: true,//是否设置同源，如果为true，就允许跨域
                pathRewrite: {//路径重写
                    '/api': ''//选择忽略拦截器里面的单词
                }
            }
        }
    }
}
