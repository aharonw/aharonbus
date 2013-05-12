{BaseCollection} = require 'collections/base-collection'
{Stop}           = require 'models/stop-model'
{config}         = require 'config'

class exports.Stops extends BaseCollection
  
  model: Stop
  
  url: =>
    apiKey = config.wmataKey
    stopID = 1001888
    return @path + 'NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + apiKey
  
  initialize: ->
    @fetch
    @