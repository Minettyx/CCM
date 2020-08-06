$(function() {

  var app = new Vue({
    el: '#app',
    data: {
      "ready": false,
      "loadingSize": [{}, {}, {}, {}, {}],
      "latest": {
        "channel": {
          "item": [
          ]
        }
      }
    }
  })

  $.getJSON('https://ccm.0kb.eu/api/latest', function(dataa) {
    app.latest = dataa;
    app.ready = true;
  });

  $('.ui.icon.input').popup();

});
