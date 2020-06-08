const merge = require('webpack-merge');

const baseConfig = require('./webpack.electron.config');

module.exports = merge.smart(baseConfig, {
    mode: 'production'
});
