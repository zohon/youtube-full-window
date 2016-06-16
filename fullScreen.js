

var timeFunction = function timeFunction() {

  loopCall();

	if($('html').hasClass('expand')) {

		$('html').removeClass('expand');
    $('.html5-video-player').addClass('ytp-fullscreen');
    window.dispatchEvent(new Event('resize'));

	} else {
		$('html').addClass('expand');
    $('.html5-video-player').removeClass('ytp-fullscreen');
    window.dispatchEvent(new Event('resize'));

	}

}

var resizecontrols = function resizecontrols() {

	if($('html').hasClass('expand')) {

      sizeItem = $('.ytp-chrome-bottom').get(0).getBoundingClientRect().width;
      parentwidth = $('.html5-video-player').get(0).getBoundingClientRect().width;
      parentheight = $('.html5-video-player').get(0).getBoundingClientRect().height;

      var translateX = "translateX("+(parentwidth-sizeItem)/2+"px) !important";

      if($('#stylePreview')) {
        $('#stylePreview').remove();
      }

      var style = document.createElement('style');
      style.id = 'stylePreview';
      style.type = 'text/css';
      style.innerHTML = '.expand .ytp-preview { transform: '+translateX+'; top: '+(parentheight-110)+'px !important; }';
      document.getElementsByTagName('head')[0].appendChild(style);

      $('.ytp-chrome-bottom').css({
        left : (parentwidth-sizeItem)/2,
        width : sizeItem
      });

  } else {

      $('.ytp-chrome-bottom').css({
        left : "10px"
      });
  }




}

var GetURLParameter = function GetURLParameter(sParam) {

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for(var i = 0; i < sURLVariables.length; i++){

        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam) {
          return sParameterName[1];
        }

    }

}

var loopCall = function loopCall() {

    if(!window.isSetFullScreen) {
        theUrl = window.location.href;
        if(theUrl.indexOf("youtube.com/embed") < 0) {
            //$('.html5-video-player video').remove();
            //$('.html5-video-player').html('<iframe src="'+embedUrl()+'" allowfullscreen frameborder="0" style="width:100%; height:100%;"></iframe>');
        }

        if(!$('.ytp-loop-button').length) {

            $('.ytp-right-controls').prepend('<button class="ytp-loop-button ytp-button" aria-pressed="false" title="Loop"><span>Loop</span></button>');
            $('.ytp-loop-button').mousedown(function(event) {
              event.preventDefault();
              event.stopPropagation();
              if ( !$('video').attr('loop') ) {
                $('.ytp-loop-button').attr('aria-pressed', true);
                $('video').attr('loop', true);
              } else {
                $('.ytp-loop-button').attr('aria-pressed', false);
                $('video').attr('loop', false);
              }
            });
        }

       if(!$('.ytp-popup-button').length) {

            $('.ytp-right-controls').prepend('<button class="ytp-popup-button ytp-button" aria-pressed="false" title="Popup"><span>Popup</span></button>');

            $('.ytp-popup-button').mousedown(function(event) {
              event.preventDefault();
              event.stopPropagation();
                $('.ytp-popup-button').attr('aria-pressed', true);
                popup();
            });
        }

        window.isSetFullScreen = true;
    }

}

function embedUrl() {
    var idYoutube = GetURLParameter('v');

    if(!idYoutube) {
        var idYoutube = GetURLParameter('v');
    }

    var url = "https://www.youtube.com/embed/"+idYoutube+"?autoplay=1";

    var time = $('.ytp-time-current').html();
    if(time) {

        time = time.split(":");
        var totalTime = 0;

        if(time[2]) {
            var timevideo = "?t="+time[0]+"h"+time[1]+"m"+time[2]+"s";
            totalTime = parseFloat(time[0]*60*60)+parseFloat(time[1]*60)+parseFloat(time[2]);
            //url += timevideo;
        } else if(time[1]) {
            timevideo = "?t="+time[0]+"m"+time[1]+"s";
            totalTime = parseFloat(time[0]*60)+parseFloat(time[1]);
            //url += timevideo;
        } else if(time[0]) {
            timevideo = "?t="+time[0]+"s";
            totalTime = parseFloat(time[0]);
            //url += timevideo;
        }

        if(totalTime) {
            url += "&start="+totalTime;
        }

    }

    return url;
}

function popup() {
    var url = embedUrl();
    $('.ytp-play-button').click();
    var myWindow = window.open(url, "MsgWindow", "width=854, height=480");
    $(myWindow.document).find('html').addClass('expand');
}

if(!window.setFullScrren) {

if($('.ytp-size-button')) {
    $('.ytp-size-button').mousedown(function(event) {

      event.preventDefault();
      event.stopPropagation();

        switch (event.which) {
            case 1:
               // $('.ytp-play-button').click();
                timeFunction()
                break;
            case 2:
                break;
            case 3:

                break;
            default:
                alert('You have a strange Mouse!');
        }
    });
}

/*
	$('.ytp-size-button').click(function( event ) {
	  event.preventDefault();
	  event.stopPropagation();
	  timeFunction()
	});
*/
	window.setFullScrren =true;
}

if(!firstTime) {
    var firstTime = 1;

    loopCall();

} else {
    timeFunction();
}
