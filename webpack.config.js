 var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: {
        main: './js/main1.js',
        boardsetup: './js/boardsetup.js',
        movement: './js/movement.js',
        matrixmath: './js/matrixmath.js'
     },
     output: {
         filename: '[name].js',
         path: path.resolve(__dirname, 'build')
     },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };