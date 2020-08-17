$(function() {

  $(".chapter").show();
  $(".morechapters").show();

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

  $.getJSON('https://api.minettyx.com/ccm/latestChapters', function(dataa) {
    app.latest = dataa;
    app.ready = true;
  });

  $('.ui.icon.input').popup();

});


function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    if(Math.floor(interval) == 1) {
      return Math.floor(interval) + " anno";
    } else {
      return Math.floor(interval) + " anni";
    }
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    if(Math.floor(interval) == 1) {
      return Math.floor(interval) + " mese";
    } else {
      return Math.floor(interval) + " mesi";
    }
  }
  interval = seconds / 86400;
  if (interval > 1) {
    if(Math.floor(interval) == 1) {
      return Math.floor(interval) + " giorno";
    } else {
      return Math.floor(interval) + " giorni";
    }
  }
  interval = seconds / 3600;
  if (interval > 1) {
    if(Math.floor(interval) == 1) {
      return Math.floor(interval) + " ore";
    } else {
      return Math.floor(interval) + " ore";
    }
  }
  interval = seconds / 60;
  if (interval > 1) {
    if(Math.floor(interval) == 1) {
      return Math.floor(interval) + " minuto";
    } else {
      return Math.floor(interval) + " minuti";
    }
  }
  if(Math.floor(interval) == 1) {
    return Math.floor(interval) + " secondo";
  } else {
    return Math.floor(interval) + " secondi";
  }
}
