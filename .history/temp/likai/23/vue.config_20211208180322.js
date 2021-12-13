const path = require('path')
const webpack = require('webpack')
const buildDate = JSON.stringify(new Date().toLocaleString())
const { name } = require('./package.json')
const WebpackAliossPlugin = require('webpack-alioss-plugin')
const ossConfig = {
  auth: {
    region: 'oss-cn-hangzhou',
    accessKeyId: 'LTAI4GKVBvc2Z5Mi4kqS7TMu',
    accessKeySecret: 'PGlEIYyQdfVtuis9ia7eF1Fzxba95v',
    bucket: '91xft-static'
  },
  ossBaseDir: '/'
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: ['//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js', '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js', '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js', '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js']
}

// vue.config.js
const vueConfig = {
  publicPath: isProd ? `//91xft-static.oss-cn-hangzhou.aliyuncs.com/${name}/` : '',
  configureWebpack: {
    // webpack plugins

    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },




  devServer: {
    // development server port 8000
    port: 8000,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/api': {
        target: 'https://test-xiangya.91xft.cn',
        pathRewrite: { '^/api': '' }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}



module.exports = vueConfig