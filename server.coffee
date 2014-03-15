express  = require 'express'
http     = require 'http'
async    = require 'async'
_        = require 'underscore'
{config} = require __dirname + '/config'

app = express()

app.configure ->
  app.set 'port', process.env.PORT || 3000
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.logger 'dev'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.favicon './public/favicon.ico'
  app.use app.router
  app.use express.static __dirname + '/../public'


app.get '/', (req, res) ->
  console.log '*** ENTER A STOP NUMBER ***'


app.get '/:stops', (req, res) ->

  stopIds = req.params.stops
  stopIds = stopIds.split '+'

  queryStop = (id, cb) ->
    apiKey  = config.wmataKey
    baseUrl = config.baseUrl
    url     = baseUrl + 'NextBusService.svc/json/JPredictions?StopID=' + id + '&api_key=' + apiKey

    http.get url, (res) ->
      data = ''
      res.on 'data', (chunk) ->
        data += chunk
      .on 'end', ->
        try
          data = JSON.parse data
        catch e
          return cb new Error
        cb null, data

  async.map stopIds, queryStop, (err, results) ->
    predictions = []
    for stop in results
      for prediction in stop.Predictions
        p = prediction
        p.stop = stop.StopName
        predictions.push p

    predictions = _.sortBy predictions, (p) -> return p.Minutes
    predictions = predictions.slice 0, 9

    res.json predictions


http.createServer(app).listen app.get('port'), ->
  console.log '\x1b[32mCOMMUTER-ONLINE\x1b[0m'

