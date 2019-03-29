var ora = require('ora')
var rm = require('rimraf')
var chalk = require('chalk')
var webpack = require('webpack')
var CONFIG = require('./config')
var webpackConfig = require('./webpack.config')
var utils = require('./utils')
var ENV = process.env.NODE_ENV
const spinner = ora(`building for ${chalk.green(ENV)} ...`)

function packResult(err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  Build complete.\n'))

}

/* 任务开始 */
spinner.start()
/* 删除旧的编译文件 */
rm(utils.resolve(CONFIG.outputDir), err => {
  if (err) throw err;
  /* 打包新的文件 */
  webpack(webpackConfig, packResult)
})
