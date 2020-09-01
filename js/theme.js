/* https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript */
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function theme(name) {
  setCookie("theme", name, 60);
  location.reload();
}
var loadc = 0;
function loadPage(val) {
  loadc += val;
  if(loadc >= 2) {
    $("#app").show();
    $("#pageloader").removeClass("active");
  }
}
function tottleTheme() {
  if(getCookie("theme") == "dark") {
    theme("default");
  } else {
    theme("dark");
  }
}
function loadTheme() {
  if(getCookie("theme") == "dark") {
    $('head').append('<link rel="stylesheet" href="https://cdn.statically.io/gh/semantic-ui-forest/forest-themes/353af4ae/dist/bootswatch/v4/semantic.darkly.min.css" type="text/css" onload="loadPage(1)" />');
    $(".ui").addClass("inverted");
    $('head').append('<link rel="stylesheet" href="/css/inverted.css" onload="loadPage(1)"/>');
  } else {
    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" type="text/css" onload="loadPage(2)"/>');
  }
}

$(function() {
  if(getCookie("theme") == "dark") {
    $("body").css("background", "#222");
  }
});
