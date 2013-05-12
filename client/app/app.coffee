{GlobalView} = require 'views/global-view'

class Commuter
  
  domDef = $.Deferred()
  @domReady = domDef.promise()
  
  _.defer =>
    
    @views = 
      global: new GlobalView @
      
    $ =>
      domDef.resolve()
      @$body = $ document.body
      #@views.global.showLogo()

module.exports = -> window.app = new Commuter