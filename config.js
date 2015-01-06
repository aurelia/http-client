System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "aurelia-http-client/*": "dist/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-path": "github:aurelia/path@0.4.0",
    "core-js": "npm:core-js@0.4.1",
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "npm:core-js@0.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.0"
    }
  }
});

