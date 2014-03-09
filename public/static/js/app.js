(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("app", function(exports, require, module) {
var Commuter, GlobalView, Predictions, PredictionsView, Router, Stop;

Router = require('lib/router').Router;

Stop = require('models/stop-model').Stop;

Predictions = require('collections/predictions-collection').Predictions;

GlobalView = require('views/global-view').GlobalView;

PredictionsView = require('views/predictions-view').PredictionsView;

Commuter = (function() {
  function Commuter() {
    var domDef;
    domDef = $.Deferred();
    this.domReady = domDef.promise();
    this.router = new Router;
    _.defer((function(_this) {
      return function() {
        _this.views = {
          global: new GlobalView(_this),
          predictions: new PredictionsView({
            collection: _this.stops
          })
        };
        return $(function() {
          domDef.resolve();
          _this.$body = $(document.body);
          Backbone.history.start({
            pushState: true
          });
          return _this.views.global.addPredictionsView();
        });
      };
    })(this));
  }

  Commuter.prototype.getPredictions = function(stops) {
    return this.predictions = new Predictions(stops);
  };

  return Commuter;

})();

module.exports = function() {
  return window.app = new Commuter;
};
});

;require.register("collections/base-collection", function(exports, require, module) {
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.BaseCollection = (function(_super) {
  __extends(BaseCollection, _super);

  function BaseCollection() {
    return BaseCollection.__super__.constructor.apply(this, arguments);
  }

  BaseCollection.prototype.path = 'http://localhost:1234/';

  return BaseCollection;

})(Backbone.Collection);
});

;require.register("collections/predictions-collection", function(exports, require, module) {
var BaseCollection, Stop, config,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseCollection = require('collections/base-collection').BaseCollection;

Stop = require('models/stop-model').Stop;

config = require('config').config;

exports.Predictions = (function(_super) {
  __extends(Predictions, _super);

  function Predictions() {
    this.url = __bind(this.url, this);
    return Predictions.__super__.constructor.apply(this, arguments);
  }

  Predictions.prototype.model = Stop;

  Predictions.prototype.delay = 20000;

  Predictions.prototype.url = function() {
    var apiKey, stopID;
    apiKey = config.wmataKey;
    stopID = this.stopID;
    console.log(this.path);
    return this.path + 'NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + apiKey;
  };

  Predictions.prototype.initialize = function(stopIDs) {
    this.stopIDs = stopIDs;
    this.fetchPredictions(this.stopIDs.split('+'));
    return this;
  };

  Predictions.prototype.fetchPredictions = function(ids) {
    return async.map(ids, this.queryStop, (function(_this) {
      return function(err, results) {
        _this.showShit(results);
        return _this.poll();
      };
    })(this));
  };

  Predictions.prototype.queryStop = function(id, cb) {
    var apiKey, stopID, url;
    apiKey = config.wmataKey;
    stopID = this.stopID;
    url = 'http://localhost:1234/' + 'NextBusService.svc/json/JPredictions?StopID=' + id + '&api_key=' + apiKey;
    return $.get(url, function(data) {
      return cb(null, data);
    });
  };

  Predictions.prototype.poll = function() {
    return setTimeout((function(_this) {
      return function() {
        _this.fetchPredictions(_this.stopIDs.split('+'));
        return console.log('fetch');
      };
    })(this), 10000);
  };

  Predictions.prototype.updatePredictions = function() {
    console.log('update');
    return this.fetch({
      success: this.showShit,
      error: this.awful
    });
  };

  Predictions.prototype.showShit = function(stops) {
    var p, prediction, stop, _i, _j, _len, _len1, _ref;
    this.predictions = [];
    for (_i = 0, _len = stops.length; _i < _len; _i++) {
      stop = stops[_i];
      _ref = stop.Predictions;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        prediction = _ref[_j];
        p = prediction;
        p.stop = stop.StopName;
        this.predictions.push(p);
      }
    }
    return app.views.predictions.render(this.predictions).el;
  };

  Predictions.prototype.awful = function(collection, response, options) {
    response = response.responseText;
    return console.log(response);
  };

  return Predictions;

})(BaseCollection);
});

;require.register("config", function(exports, require, module) {
exports.config = {
  wmataKey: 'jyauyx2uz4hur2pvbd4t5znd'
};
});

;require.register("lib/router", function(exports, require, module) {
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.routes = {
    '': 'noStops',
    ':stops': 'predictions'
  };

  Router.prototype.navigate = function(route) {
    return Router.__super__.navigate.call(this, route, {
      trigger: true
    });
  };

  Router.prototype.noStops = function() {
    return console.log('No Stops Selected');
  };

  Router.prototype.predictions = function(stops) {
    return app.getPredictions(stops);
  };

  return Router;

})(Backbone.Router);
});

;require.register("models/prediction-model", function(exports, require, module) {
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.Prediction = (function(_super) {
  __extends(Prediction, _super);

  function Prediction() {
    return Prediction.__super__.constructor.apply(this, arguments);
  }

  return Prediction;

})(Backbone.Model);
});

;require.register("models/stop-model", function(exports, require, module) {
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.Stop = (function(_super) {
  __extends(Stop, _super);

  function Stop() {
    return Stop.__super__.constructor.apply(this, arguments);
  }

  Stop.prototype.idAttribute = '_id';

  return Stop;

})(Backbone.Model);
});

;require.register("views/base-view", function(exports, require, module) {
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

exports.BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    return BaseView.__super__.constructor.apply(this, arguments);
  }

  BaseView.prototype.template = function(data) {
    return require("views/templates/" + this.templateName)(data);
  };

  BaseView.prototype.render = function(data) {
    this.$el.html(this.template(data));
    return this;
  };

  return BaseView;

})(Backbone.View);
});

;require.register("views/global-view", function(exports, require, module) {
var BaseView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('views/base-view').BaseView;

exports.GlobalView = (function(_super) {
  __extends(GlobalView, _super);

  function GlobalView() {
    this.render = __bind(this.render, this);
    return GlobalView.__super__.constructor.apply(this, arguments);
  }

  GlobalView.prototype.el = '#content';

  GlobalView.prototype.templateName = 'global';

  GlobalView.prototype.initialize = function(app) {
    return $.when(app.domReady).then(this.render);
  };

  GlobalView.prototype.render = function() {
    this.$el.html(this.template());
    this.$logo = this.$('#logo');
    this.$wrapper = this.$('.wrapper');
    return this;
  };

  GlobalView.prototype.showPredictions = function(stops) {
    return console.log(stops);
  };

  GlobalView.prototype.addPredictionsView = function() {
    return this.$wrapper.append(app.views.predictions.el);
  };

  return GlobalView;

})(BaseView);
});

;require.register("views/prediction-view", function(exports, require, module) {
var BaseView, Prediction,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseView = require('views/base-view').BaseView;

Prediction = require('models/prediction-model').Prediction;

exports.PredictionView = (function(_super) {
  __extends(PredictionView, _super);

  function PredictionView() {
    return PredictionView.__super__.constructor.apply(this, arguments);
  }

  PredictionView.prototype.tagName = 'li';

  PredictionView.prototype["class"] = 'prediction';

  PredictionView.prototype.templateName = 'prediction';

  PredictionView.prototype.model = Prediction;

  PredictionView.prototype.initialize = function(prediction) {
    this.prediction = prediction;
  };

  PredictionView.prototype.render = function() {
    PredictionView.__super__.render.call(this, {
      prediction: this.prediction
    });
    return this;
  };

  return PredictionView;

})(BaseView);
});

;require.register("views/predictions-view", function(exports, require, module) {
var BaseView, PredictionView, Stop,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Stop = require('models/stop-model').Stop;

BaseView = require('views/base-view').BaseView;

PredictionView = require('views/prediction-view').PredictionView;

exports.PredictionsView = (function(_super) {
  __extends(PredictionsView, _super);

  function PredictionsView() {
    return PredictionsView.__super__.constructor.apply(this, arguments);
  }

  PredictionsView.prototype.id = 'predictions';

  PredictionsView.prototype.templateName = 'predictions';

  PredictionsView.prototype.SubView = PredictionView;

  PredictionsView.prototype.Model = Stop;

  PredictionsView.prototype.render = function(predictions) {
    var fragment, prediction, _i, _len, _ref;
    this.predictions = predictions;
    PredictionsView.__super__.render.apply(this, arguments);
    this.subViews = [];
    this.$predictionList = this.$('#prediction-list');
    fragment = document.createDocumentFragment();
    _ref = this.predictions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      prediction = _ref[_i];
      fragment.appendChild(this.makeSubView(prediction));
    }
    this.$predictionList.append(fragment);
    return this;
  };

  PredictionsView.prototype.makeSubView = function(prediction) {
    var subView;
    this.subViews.push(subView = new this.SubView(prediction));
    return subView.render().el;
  };

  return PredictionsView;

})(BaseView);
});

;require.register("views/templates/global", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"wrapper\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/prediction", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),prediction = locals_.prediction;
buf.push("<div class=\"minutes\">" + (jade.escape((jade_interp = prediction.Minutes) == null ? '' : jade_interp)) + "</div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/predictions", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<ul id=\"prediction-list\"></ul>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map