# Implemented strategy

Decentralized and separated stylesheet system, so components can be shipped without styles. Folder `stylesheets`contains the whole system, with a barrel file for easy import. This barrel file severs as an importation interface as it holds every import statement already translated into a Javascript object. Instead of spreading the import of the barrel everywhere, we just inject it through a HOC wrapping our application. 

This is called `context theming`. Styles are just injected into the React tree root context, so that every child component could refer to its CSS using a single name identifier. 

The magic happens thanks to an extension called `react-css-themr`, which basically adds a HOC wrapper for every decorated component that is responsible of spreading the context theme downwards.


# Alternative strategy

I evaluated and tested the following strategy and it works. However, I ended up deprecating it. Although it has a clear advantage due to a very easy way of theming multiple components just by overwriting global CSS variables that can be applied on runtime and thus, changing the appearance of the theme, this method lacks of fine control over certain rules. Also, it force us to work with PostCSS with is not as mature as I would like. I found some limitations and had to struggle too much. I bet that once it is more robust in the future, PostCSS would be the way to go.

In short, this alternative method consists in spread global PostCSS variables accross modules (thanks to a postcss plugin) and then overwrite those variables on demand by injecting them from javascript objects.


## POSTCSS.CONFIG.JS File
 
Defines plugins for PostCSS globally.
An alternative is to define plugins in webpack.config.js
for each loader instance that make use of postcss. This has
the advantage of custom behaviour for each loader. But in
our case, its ok setting it up globally.

```javascript
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
```


### POSTCSS-CSSNEXT Plugin
This plugin provides an extended and powerful syntax for
plain CSS in postcss files. It adds future CSS specifications
still not implemented by browsers.
One of its features is 'customProperties', which allows defining
shared variables and cascading its value into rule properties.
It is a way of store common/general values, same as SASS already 
does with its variables. Just be aware that these shared variables
will be available in the resulting single CSS file, it does not
spread them across CSS modules.
Also, it allows us to inject variables from external Javascript
object (variables: ...).

### POSTCSS-MODULES-VALUES Plugin
This is actually the plugin that make possible to pass arbitrary
values between CSS modules, and thus, shared variables will be 
global across CSS modules.

NOTE: CSS Modules are actually implemented by css-loader in webpack.

So what we are doing here is to inject global or shared variables
in every CSS module so their rules can be based on these values.


## OVERRIDE.VARIABLES.JS File

Global variables defined by React-toolbox in order to customize
theme are redeclared here to be overriden.
This data will flow towards Webpack postcss plugins that will
inject these variables across CSS modules, overwritting the
existing one.

```javascript
module.exports = {
  //"color-text": "red",
  "list-horizontal-padding": "10px"
};
```