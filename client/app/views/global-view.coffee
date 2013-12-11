{BaseView} = require 'views/base-view'

class exports.GlobalView extends BaseView

  el: '#content'
  templateName: 'global'

  initialize: (app) ->
    $.when(app.domReady).then @render

  render: =>
    @$el.html @template()
    @$logo = @$ '#logo'
    @

  addStopView: ->
    @$el.append app.views.stop.el