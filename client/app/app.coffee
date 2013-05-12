{Bus}        = require 'models/bus-model'
{Buses}      = require 'collections/buses-collection'
{GlobalView} = require 'views/global-view'

class Commuter
  
  constructor: ->
    
    domDef = $.Deferred()
    @domReady = domDef.promise()
        
    @buses = new Buses
    
    _.defer =>
      
      @views = 
        global: new GlobalView @
        
      $ =>
        domDef.resolve()
        @$body = $ document.body


module.exports = -> window.app = new Commuter