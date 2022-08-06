 import path from 'path';
function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, '../node_modules/');

  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName; // handle tree shaking

  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }

  return packageName;
}

const webpackPlugin = config => {
  const timestamp = (new Date()).getTime();
  //css的修改   有问题了  有空再研究怎么配置 --wangcl
  // config.plugin('extract-css').use(require('mini-css-extract-plugin'), [
  //   {
  //     ignoreOrder: true,
  //     filename: `[name].css`,
  //     chunkFilename: `[name].${timestamp}.chunk.css`,
  //   },
  // ]);
  //  js的修改
  config.output.filename(`[name].[hash].js`).chunkFilename(`[name].async.js?v=${timestamp}`);
  // optimize chunks
  config.optimization // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: module => {
            const packageName = getModulePackageName(module) || '';

            if (packageName) {
              return [
                'bizcharts',
                'gg-editor',
                'g6',
                '@antv',
                'l7',
                'gg-editor-core',
                'bizcharts-plugin-slider',
              ].includes(packageName);
            }

            return false;
          },

          name(module) {
            const packageName = getModulePackageName(module);

            if (packageName) {
              if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                return 'viz'; // visualization package
              }
            }

            return 'misc';
          },
        },
      },
    });
};

export default webpackPlugin;
