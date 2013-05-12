express = require 'express'
routes  = require './routes'
http    = require 'http'
path    = require 'path'

app = express()

app.configure ->
  app.set 'port', process.env.PORT || 3000
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.logger 'dev'
  app.use express.bodyParser()
  app.use express.methodOverride()
  #app.use express.favicon './public/favicon.ico?v=2'
  app.use app.router
  app.use express.static __dirname + '/../public'
  
  
app.configure 'development', ->
  app.use express.errorHandler()
  
app.get '/', routes.index

http.createServer(app).listen app.get('port'), ->
  console.log '\x1b[32mCOMMUTER-ONLINE\x1b[0m'
