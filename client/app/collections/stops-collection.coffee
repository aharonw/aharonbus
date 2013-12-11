{BaseCollection} = require 'collections/base-collection'
{Stop}           = require 'models/stop-model'
{config}         = require 'config'

class exports.Stops extends BaseCollection

  model: Stop

  url: =>
    apiKey = config.wmataKey
    stopID = 1001861
    return @path + 'NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + apiKey

  initialize: ->
    @fetch
      success : @showShit
      error   : @awful
    @

  showShit: (collection, response, options) ->
    stop = collection.toJSON()[0]
    app.views.stop.render(collection.first()).el

  awful: (collection, response, options) ->
    response = response.responseText
    console.log response