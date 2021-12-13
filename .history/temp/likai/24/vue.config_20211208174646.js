const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
// var JavaScriptObfuscator = require('webpack-obfuscator')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
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

function resolve (dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash () {
  try {
    return GitRevision.version()
  } catch (e) {}
  return 'unknown'
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
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  publicPath: isProd ? `//91xft-static.oss-cn-hangzhou.aliyuncs.com/${name}/` : '',
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

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
      config.plugin('html').tap(args => {
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
        target: 'https://demo.91xft.cn/zoomapi',
        pathRewrite: { '^/api': '' }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: ['@antv/x6']
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
//   console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

if (isProd) {
  // vueConfig.configureWebpack.plugins.push(new JavaScriptObfuscator({
  //   // 压缩代码
  // compact: true,
  // // 是否启用控制流扁平化(降低1.5倍的运行速度)
  // controlFlowFlattening: false,
  // // 随机的死代码块(增加了混淆代码的大小)
  // deadCodeInjection: false,
  // // 此选项几乎不可能使用开发者工具的控制台选项卡
  // debugProtection: false,
  // // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
  // debugProtectionInterval: false,
  // // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
  // disableConsoleOutput: true,
  // // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
  // identifierNamesGenerator: 'hexadecimal',
  // log: false,
  // // 是否启用全局变量和函数名称的混淆
  // renameGlobals: false,
  // // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
  // rotateStringArray: true,
  // // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
  // selfDefending: true,
  // // 删除字符串文字并将它们放在一个特殊的数组中
  // stringArray: true,
  // stringArrayEncoding: false,
  // stringArrayThreshold: 0.75,
  // // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
  // unicodeEscapeSequence: false
  // }, []))
  vueConfig.configureWebpack.plugins.push(new WebpackAliossPlugin(ossConfig))
}

module.exports = vueConfig
