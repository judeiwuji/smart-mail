const ExtReloader = require("webpack-ext-reloader");

module.exports = {
  mode: "development",
  watch: true,
  entry: { background: "./dist/smart-mail/browser/main.js" },
  plugins: [
    new ExtReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        background: "service_worker",
      },
    }),
  ],
};
