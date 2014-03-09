{Stop}           = require 'models/stop-model'
{BaseView}       = require 'views/base-view'
{PredictionView} = require 'views/prediction-view'

class exports.PredictionsView extends BaseView

  id: 'predictions'
  templateName: 'predictions'
  SubView: PredictionView
  Model: Stop

  render: (@predictions) ->
    super

    @subViews        = []
    @$predictionList = @$ '#prediction-list'
    fragment         = document.createDocumentFragment()

    for prediction in @predictions
      fragment.appendChild @makeSubView prediction

    @$predictionList.append fragment

    @


  makeSubView: (prediction) ->
    @subViews.push subView = new @SubView prediction
    subView.render().el