/**
 * POSTCSS.CONFIG.JS File
 * 
 * Defines plugins for PostCSS globally.
 * An alternative is to define plugins in webpack.config.js
 * for each loader instance that make use of postcss. This has
 * the advantage of custom behaviour for each loader. But in
 * our case, its ok setting it up globally.
 */

module.exports = {
  plugins: {
    "postcss-cssnext": {}
  }
};
