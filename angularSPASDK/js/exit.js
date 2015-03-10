var internal = 0;

  function bunload() {

    if (internal != 1 && downSell) {
      window.onbeforeunload = null;
      internal = 1;
      $('.CS_black_overlay, .CS_div1').show();
      $('.CS_div1 img').attr('src','/img/offers/'+ downSellImg);
      $('.CS_div1 a').on('click', function(e) {
          e.preventDefault();
          $('.CS_black_overlay, .CS_div1').hide();
          window.location.href = downSell;
      });
      return "We have an awesome offer for you, please check it before you leave!";

    } else {
      internal = 0;
    }

  }

  if (internal != 1) {
    //window.onmouseout = bunload;
    setTimeout(function(){window.onbeforeunload = bunload;},1000);
  } else {
    internal = 0;
  }