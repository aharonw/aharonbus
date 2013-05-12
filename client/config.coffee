exports.config =
  paths:
    public: '../public/static'

  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
      order:
        before: [
          'vendor/jquery.js'
          'vendor/underscore.js'
          'vendor/backbone.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo: 'css/app.css'
      order:
        before: [
          'app/styles/main.styl'
          'app/styles/frame.styl'
        ]

    templates:
      defaultExtension: 'jade'
      joinTo: 'js/app.js'
