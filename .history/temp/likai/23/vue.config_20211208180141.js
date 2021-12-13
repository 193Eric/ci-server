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
    plugins: [
      // Ignore all locale files of moment.js
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        BUILD_DATE: buildDate
      })
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias.set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap((args) => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          // 'primary-color': '#AACE3B',
          // 'link-color': '#AACE3B',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
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

if (isProd) {
  vueConfig.configureWebpack.plugins.push(new WebpackAliossPlugin(ossConfig))
}

module.exports = vueConfig
