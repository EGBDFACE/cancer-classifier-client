const merge = require('webpack-merge');
const commonConfig = require('./webpack.base.config.js');

module.exports = merge (commonConfig, {
    mode: 'production'
})