{Router}          = require 'lib/router'

{Stop}            = require 'models/stop-model'
{Predictions}     = require 'collections/predictions-collection'

{GlobalView}      = require 'views/global-view'
{PredictionsView} = require 'views/predictions-view'

class Commuter

  constructor: ->
    domDef    = $.Deferred()
    @domReady = domDef.promise()
    @router   = new Router

    _.defer =>

      @views =
        global:      new GlobalView @
        predictions: new PredictionsView collection: @stops

      $ =>
        domDef.resolve()
        @$body = $ document.body
        Backbone.history.start pushState: true
        @views.global.addPredictionsView()


  getPredictions: (stops) ->
    @predictions = new Predictions stops

module.exports = -> window.app = new Commuter