/**
 * POSTCSS.CONFIG.JS File
 * 
 * Defines plugins for PostCSS globally.
 * An alternative is to define plugins in webpack.config.js
 * for each loader instance that make use of postcss. This has
 * the advantage of custom behaviour for each loader. But in
 * our case, its ok setting it up globally.
 */

const reactToolboxVariables = require("./src/theme/rtb.override.variables");

module.exports = {
  plugins: {
    "postcss-cssnext": {
      features: {
        customProperties: {
          variables: reactToolboxVariables
        }
      }
    },
    "postcss-modules-values": {}
  }
};

/**
 * POSTCSS-CSSNEXT Plugin
 * This plugin provides an extended and powerful syntax for
 * plain CSS in postcss files. It adds future CSS specifications
 * still not implemented by browsers.
 * One of its features is 'customProperties', which allows defining
 * shared variables and cascading its value into rule properties.
 * It is a way of store common/general values, same as SASS already 
 * does with its variables. Just be aware that these shared variables
 * will be available in the resulting single CSS file, it does not
 * spread them across CSS modules.
 * Also, it allows us to inject variables from external Javascript
 * object (variables: ...).
 * 
 * POSTCSS-MODULES-VALUES Plugin
 * This is actually the plugin that make possible to pass arbitrary
 * values between CSS modules, and thus, shared variables will be 
 * global across CSS modules.
 * 
 * NOTE: CSS Modules are actually implemented by css-loader in webpack.
 * 
 * So what we are doing here is to inject global or shared variables
 * in every CSS module so their rules can be based on these values.
 */