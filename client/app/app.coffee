{Stop}        = require 'models/stop-model'
{Stops}       = require 'collections/stops-collection'

{GlobalView}  = require 'views/global-view'
{StopView}    = require 'views/stop-view'

class Commuter

  constructor: ->

    domDef = $.Deferred()
    @domReady = domDef.promise()

    @stops = new Stops 1001861

    _.defer =>

      @views =
        global: new GlobalView @
        stop:   new StopView collection: @stops

      $ =>
        domDef.resolve()
        @$body = $ document.body
        @views.global.addStopView()


module.exports = -> window.app = new Commuter