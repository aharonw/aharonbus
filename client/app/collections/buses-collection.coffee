{BaseCollection} = require 'collections/base-collection'
{Bus}            = require 'models/bus-model'

class exports.Buses extends BaseCollection
  
  model: Bus
  
  
  url: =>
    apiKey = config.wmataKey
    stopID = 1001888
    url = path + 'NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + apiKey
    
    console.log url
    
    return url