(function(){
  window.LoveNeon = window.LoveNeon || {};

  window.LoveNeon.getHeartScale = function(width, height){
    var isPortrait = height >= width;

    if(width > 700){
      if(width >= 1000 && width <= 1050){
        return 1.42;
      }

      if(width >= 1200 && width <= 1300){
        return 1.28;
      }

      if(width > 1600){
        return 1.04;
      }

      return 1.12;
    }

    if(!isPortrait){
      return 1.16;
    }

    if(width <= 360){
      return 1.56;
    }

    if(width <= 430){
      return 1.52;
    }

    if(width <= 520){
      return 1.42;
    }

    return 1.28;
  };

  window.LoveNeon.getHeartYOffset = function(scale){
    return 0.02 + Math.max(0, scale - 1) * 0.06;
  };

  window.LoveNeon.getInlineTextLimit = function(width){
    if(width <= 360){
      return width * 0.48;
    }

    if(width <= 430){
      return width * 0.5;
    }

    if(width <= 520){
      return width * 0.48;
    }

    if(width <= 600){
      return width * 0.42;
    }

    if(width <= 700){
      return width * 0.48;
    }

    if(width <= 900){
      return width * 0.46;
    }

    return Math.min(width * 0.72, 620);
  };
})();
