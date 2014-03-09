{BaseView}   = require 'views/base-view'
{Prediction} = require 'models/prediction-model'

class exports.PredictionView extends BaseView

  tagName: 'li'
  class: 'prediction'
  templateName: 'prediction'
  model: Prediction

  initialize: (@prediction) ->

  render: ->
    super prediction: @prediction
    @