// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  'plugins': {
    // to edit target browsers: use "browserslist" field in package.json
    'autoprefixer': {},
    "postcss-px2rem-exclude": {
      remUnit: 128,
      exclude: /src[\/\\]views[\/\\]login|src[\/\\]components|src[\/\\]layout||src[\/\\]styles|node_modules/
    }
  }
}
