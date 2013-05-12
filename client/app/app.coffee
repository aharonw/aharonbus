{Stop}        = require 'models/stop-model'
{Stops}       = require 'collections/stops-collection'

{GlobalView}  = require 'views/global-view'
{StopView}    = require 'views/stop-view'

class Commuter
  
  constructor: ->
    
    domDef = $.Deferred()
    @domReady = domDef.promise()
        
    @stops = new Stops
    
    _.defer =>
      
      @views = 
        global: new GlobalView @
        stop:   new StopView
        
      $ =>
        domDef.resolve()
        @$body = $ document.body


module.exports = -> window.app = new Commuter