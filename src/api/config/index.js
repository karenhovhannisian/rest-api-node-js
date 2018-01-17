"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var config = {
  development: {
    dbConnectUrl: "mongodb://root:root@ds247407.mlab.com:47407/new_api",
    jwt:{
      secret: "jwt_secret",
    },
    app:{
        baseUrl: "http://localhost:3000/",
        port: 3000,
    },
  },
  production: {
    dbConnectUrl: "mongodb://root:root@ds247407.mlab.com:47407/new_api",
    jwt:{
      secret: "6db8dccd1917a2e3a5b2",
    },
    app:{
        baseUrl: "",
        port: process.env.PORT || 5000,
    },
  }
};

exports.default = function (config) {
  var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env.NODE_ENV.trim();

  var returnConfig = config.development;
  if (env === "production") {
    returnConfig = config.production;
  }
  return returnConfig;
}(config, process.env.NODE_ENV.trim());