{Stop}           = require 'models/stop-model'
{BaseView}       = require 'views/base-view'
{PredictionView} = require 'views/prediction-view'

class exports.StopView extends BaseView

  id: 'stop'
  Model: Stop
  SubView: PredictionView
  templateName: 'predictions'

  render: (data) ->
    super
    @stopName        = data.get 'StopName'
    @predictions     = data.get 'Predictions'
    console.log @predictions
    @subViews        = []
    @$predictionList = @$ '#predictionList'
    fragment         = document.createDocumentFragment()

    for prediction in @predictions
      fragment.appendChild @makeSubView prediction

    @$predictionList.append fragment

    @


  makeSubView: (prediction) ->
    @subViews.push subView = new @SubView prediction
    subView.render().el