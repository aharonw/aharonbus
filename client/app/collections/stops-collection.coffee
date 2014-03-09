{BaseCollection} = require 'collections/base-collection'
{Stop}           = require 'models/stop-model'
{config}         = require 'config'

class exports.Stops extends BaseCollection

  model: Stop
  delay: 20000

  url: =>
    apiKey = config.wmataKey
    stopID = @stopID
    return @path + 'NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + apiKey


  initialize: (@stopID) ->
    @poll()
    @


  poll: (delay) ->
    setInterval =>
      @updatePredictions()
      console.log 'fetch'
    , 10000


  updatePredictions: ->
    console.log 'update'
    @fetch
      success : @showShit
      error   : @awful

  showShit: (collection, response, options) ->
    console.log "fetched"
    stop = collection.toJSON()[0]
    app.views.stop.render(collection.first()).el


  awful: (collection, response, options) ->
    response = response.responseText
    console.log response