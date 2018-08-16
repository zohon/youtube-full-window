var loopCall = function loopCall() {

    if ($('.expando-button.collapsed.video').length) { //reddit video
        $('.expando-button.collapsed.video').each(function(index, data) {
            $(data).mousedown(function(event) {
                event.preventDefault();
                event.stopPropagation();

                if(window.actualVideo == $(this)) {
                  return true;
                }

                var result = generatEmbed($(this).closest(".thing").attr('data-url'), $(this).closest(".thing").find('.title a').html());
                if(result) {
                  $(this).closest(".thing").find('.expando').remove();
                }
                window.actualVideo = $(this);
            });
        });
        return false;
    }

    if (!window.isSetFullScreen) {
        theUrl = window.location.href;

        if (!$('.ytp-size-button svg').length) {
            $('.ytp-right-controls').prepend('<button class="ytp-size-button perso-size ytp-button" aria-pressed="false" title="Zoom"><span>[&nbsp;&nbsp;&nbsp;]</span></button>');
            $('.ytp-size-button').mousedown(function(event) {
                event.preventDefault();
                event.stopPropagation();

                $('.ytp-play-button').click();
                window.open($('.ytp-youtube-button').attr('href') + '&full=true', '_blank');

                if (!$('video').attr('size')) {
                    $('.ytp-size-button.perso-size').attr('aria-pressed', true);
                    $('video').attr('size', true);
                } else {
                    $('.ytp-size-button.perso-size').attr('aria-pressed', false);
                    $('video').attr('size', false);
                }
            });
        }

        if (!$('.ytp-loop-button').length) {
            $('.ytp-right-controls').prepend('<button class="ytp-loop-button ytp-button" aria-pressed="false" title="Loop"><span>Loop</span></button>');
            $('.ytp-loop-button').mousedown(function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (!$('video').attr('loop')) {
                    $('.ytp-loop-button').attr('aria-pressed', true);
                    $('video').attr('loop', true);
                } else {
                    $('.ytp-loop-button').attr('aria-pressed', false);
                    $('video').attr('loop', false);
                }
            });
        }

        if (!$('.ytp-popup-button').length) {
            $('.ytp-right-controls').prepend('<button class="ytp-popup-button ytp-button" aria-pressed="false" title="Popup"><span>Popup</span></button>');
            $('.ytp-popup-button').mousedown(function(event) {
                event.preventDefault();
                event.stopPropagation();
                popup();
            });
        }

        $('.ytp-size-button').mouseup(function(event) {
            setType();
        });
        window.isSetFullScreen = true;
    }


    myElem = document.getElementById('player-theater-container');
    if (myElem && !myElem.childNodes.length) {
        $('.ytp-size-button').trigger('click');
    }
    setType();
    $(window).trigger('resize');
}

function setType() {
    setTimeout(() => {
        let myElem = document.getElementById('player-theater-container');
        console.log('myElem', myElem);
        elementHTML = document.getElementsByTagName('html')[0];

        if (myElem && myElem.childNodes.length) {
            elementHTML.classList.add("isFullScreen");
        } else {
            elementHTML.classList.remove("isFullScreen");
        }
        $(window).trigger('resize');
    }, 300);
}

function generatEmbed(url, title) {

  if(url.indexOf('youtu') < 0) {
    return false;
  }

  var idVid = gup('v', url);

  if(!idVid) {
    idVid = url.substr(url.lastIndexOf('/') + 1);
    if(idVid.indexOf('?') >= 0) {
      idVid = idVid.substr(0, idVid.lastIndexOf('?'));
    }
  }

  if(!idVid) {
    console.log(url);
    return false;
  }

  if($('#playerExtra')) {
    $('#playerExtra').remove();
  }

  $('body').removeClass('scrolled');

  var playerExtra = document.createElement('div');
  $(playerExtra).attr('id', "playerExtra");

    var element = document.createElement('iframe');
    $(element).attr({
      width: "100%",
      height: "100%",
      id: "playerFull",
      type : "text/html",
      src: 'https://www.youtube.com/embed/'+idVid+"?autoplay=1",
      frameborder : 0
    });

    var infosplayer = document.createElement('div');
    $(infosplayer).attr({
      width: "100%",
      id: "playerFullInfos"
    });

    $(infosplayer).mousedown(function(event) {
      $('#playerExtra').remove();
    });


    $(infosplayer).html(title);

    $(playerExtra).prepend(infosplayer);
    $(playerExtra).prepend(element);

  $('body').prepend(playerExtra);

  if(!window.listenScroll) {

    console.log("listenScroll");

    $(window).scroll(function() {
      console.log("scrolled");

      if($(window).scrollTop() <= 20) {
        $('body').removeClass('scrolled');
      } else {
        $('body').addClass('scrolled');
      }


    });
     window.listenScroll = true;
  }

  return true;
}

function embedUrl() {
    var idYoutube = GetURLParameter('v');

    if (!idYoutube) {
        var idYoutube = GetURLParameter('v');
    }

    var url = "https://www.youtube.com/embed/" + idYoutube + "?autoplay=1";

    var time = $('.ytp-time-current').html();
    if (time) {

        time = time.split(":");
        var totalTime = 0;

        if (time[2]) {
            var timevideo = "?t=" + time[0] + "h" + time[1] + "m" + time[2] + "s";
            totalTime = parseFloat(time[0] * 60 * 60) + parseFloat(time[1] * 60) + parseFloat(time[2]);
            //url += timevideo;
        } else if (time[1]) {
            timevideo = "?t=" + time[0] + "m" + time[1] + "s";
            totalTime = parseFloat(time[0] * 60) + parseFloat(time[1]);
            //url += timevideo;
        } else if (time[0]) {
            timevideo = "?t=" + time[0] + "s";
            totalTime = parseFloat(time[0]);
            //url += timevideo;
        }

        if (totalTime) {
            url += "&start=" + totalTime;
        }

    }

    return url;
}

var GetURLParameter = function GetURLParameter(sParam) {

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {

        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }

    }
}

function popup() {
    var url = embedUrl();
    $('.ytp-play-button').click();
    var myWindow = window.open(url, "MsgWindow", "width=854, height=480");
    $(myWindow.document).find('html').addClass('expand');
}

function gup( name, url ) {
      if (!url) url = location.href;
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( url );
      return results == null ? null : results[1];
    }

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

loopCall();

