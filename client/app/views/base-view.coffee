class exports.BaseView extends Backbone.View

  template: (data) ->
    require("views/templates/#{ @templateName }") data


  render: (data) ->
    @$el.html @template data
    @