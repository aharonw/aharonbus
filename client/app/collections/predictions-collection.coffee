{BaseCollection} = require 'collections/base-collection'
{Stop}           = require 'models/stop-model'
{config}         = require 'config'

class exports.Predictions extends BaseCollection

  model: Stop
  delay: 20000

  url: =>
    apiKey = config.wmataKey
    stopID = @stopID
    console.log @path
    return @path + 'NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + apiKey


  initialize: (@stopIDs) ->
    @fetchPredictions @stopIDs.split '+'
    @


  fetchPredictions: (ids) ->
    async.map ids, @queryStop, (err, results) =>
      @showShit results
      @poll()


  queryStop: (id, cb) ->
    apiKey = config.wmataKey
    stopID = @stopID
    url    = 'http://localhost:1234/' + 'NextBusService.svc/json/JPredictions?StopID=' + id + '&api_key=' + apiKey
    $.get url, (data) ->
      cb null, data


  poll: ->
    setTimeout =>
      @fetchPredictions @stopIDs.split '+'
      console.log 'fetch'
    , 10000


  updatePredictions: ->
    console.log 'update'
    @fetch
      success : @showShit
      error   : @awful

  showShit: (stops) ->
    @predictions = []
    for stop in stops
      for prediction in stop.Predictions
        p = prediction
        p.stop = stop.StopName
        @predictions.push p

    app.views.predictions.render(@predictions).el


  awful: (collection, response, options) ->
    response = response.responseText
    console.log response