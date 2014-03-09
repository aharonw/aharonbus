class exports.Router extends Backbone.Router

  routes:
    '': 'noStops'
    ':stops': 'predictions'

  navigate: (route) -> super route, trigger: true

  noStops: ->
    console.log 'No Stops Selected'

  predictions: (stops) -> 
    app.getPredictions stops