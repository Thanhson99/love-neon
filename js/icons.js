(function(){
  var engravedPattern = document.getElementById('engravedPattern');

  if(!engravedPattern){
    return;
  }

  var cuteIconSvgs = [
    '<svg viewBox="0 0 64 64"><path d="M32 51C18 39 10 31 10 21c0-6 5-11 11-11 5 0 9 3 11 7 2-4 6-7 11-7 6 0 11 5 11 11 0 10-8 18-22 30z"/></svg>',
    '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="7"/><path d="M32 7v11M32 46v11M7 32h11M46 32h11M14 14l8 8M42 42l8 8M50 14l-8 8M22 42l-8 8"/></svg>',
    '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="8"/><path d="M32 4v12M32 48v12M4 32h12M48 32h12M12 12l9 9M43 43l9 9M52 12l-9 9M21 43l-9 9"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M13 37c10-22 29-25 42-16-5 1-8 4-9 8 5 2 8 5 10 9-14 7-31 6-43-1z"/><path d="M13 37l-7-7M13 37l-7 7"/><circle cx="41" cy="28" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M9 38c11-21 31-27 47-13-7 1-12 5-15 11 5 4 9 9 12 15-16 1-31-3-44-13z"/><path d="M33 22c-1-5 3-10 8-12M19 40c-4 2-7 6-8 11"/><circle cx="43" cy="27" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><circle cx="24" cy="21" r="8"/><circle cx="40" cy="21" r="8"/><circle cx="32" cy="36" r="17"/><circle cx="25" cy="34" r="2"/><circle cx="39" cy="34" r="2"/><path d="M28 43c3 2 5 2 8 0"/><path d="M32 38v4"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M32 7l6 17 18 1-14 11 5 18-15-10-15 10 5-18L8 25l18-1 6-17z"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M22 18h20l-3 35H25L22 18z"/><path d="M20 18h24"/><path d="M27 18l-3-9h16"/><path d="M27 32c4 3 10 3 14 0"/><circle cx="29" cy="43" r="1.5"/><circle cx="35" cy="47" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M18 36c10-10 19-11 28-2"/><path d="M18 36c-2 7 3 13 12 14 11 1 18-5 16-16"/><path d="M18 36l-8-5M18 36l-8 6"/><circle cx="40" cy="34" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M32 11c8 8 16 15 16 27 0 10-7 17-16 17s-16-7-16-17c0-12 8-19 16-27z"/><path d="M32 18v28M22 36c6 1 13 0 20-7"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M18 45c9 7 23 7 32-1"/><path d="M14 34c5-13 18-20 35-16 1 14-6 25-19 31"/><path d="M43 19c4-5 8-7 13-7"/><path d="M25 34c5-1 9-4 12-9"/><circle cx="44" cy="26" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M19 45c-5-7-2-17 8-18 2-8 14-8 16 0 10 1 13 11 8 18-6 9-26 9-32 0z"/><circle cx="27" cy="39" r="1.5"/><circle cx="39" cy="39" r="1.5"/><path d="M30 46c2 1 4 1 6 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M21 25c0-8 5-13 11-13s11 5 11 13"/><path d="M17 27h30l-3 25H20l-3-25z"/><path d="M25 35c3 4 11 4 14 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M32 10l7 14 15 2-11 11 3 16-14-8-14 8 3-16-11-11 15-2 7-14z"/><path d="M25 33h14"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M19 44c-4-11 3-21 13-21s17 10 13 21c-4 10-22 10-26 0z"/><path d="M21 25c-5-6-5-12 0-17 4 4 6 9 6 15M43 25c5-6 5-12 0-17-4 4-6 9-6 15"/><circle cx="27" cy="38" r="1.5"/><circle cx="37" cy="38" r="1.5"/><path d="M30 45c2 1 3 1 5 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M16 39c3-12 12-20 26-22 8 6 10 17 4 26-7 10-24 9-30-4z"/><path d="M42 17l9-7M45 21l12-1M23 39c5 3 12 3 17-2"/><circle cx="36" cy="30" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M18 25c3-9 25-9 28 0 6 4 9 10 8 18-7 8-37 8-44 0-1-8 2-14 8-18z"/><path d="M23 24c-2-8 1-13 8-15M41 24c2-8-1-13-8-15"/><circle cx="27" cy="39" r="1.5"/><circle cx="37" cy="39" r="1.5"/><path d="M29 47c2 1 4 1 6 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M18 45c-4-10 2-22 14-22s18 12 14 22c-5 10-23 10-28 0z"/><path d="M21 26l-7-8M43 26l7-8"/><circle cx="26" cy="38" r="1.5"/><circle cx="38" cy="38" r="1.5"/><path d="M29 46c2 1 4 1 6 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M20 41c-8-9-2-24 12-24s20 15 12 24c-7 8-17 8-24 0z"/><path d="M24 18c-3-6-1-10 5-12M40 18c3-6 1-10-5-12"/><path d="M26 39h12M29 46h6"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M12 33c9-11 22-16 36-9 6 3 9 8 10 14-15 8-34 6-46-5z"/><path d="M12 33l-6-5M12 33l-6 6"/><path d="M31 24c-2-5 1-11 7-14"/><path d="M37 25c5-5 10-7 16-7"/><circle cx="43" cy="32" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M18 47c-2-12 4-22 14-22s16 10 14 22"/><path d="M19 29c4-9 22-14 30-3"/><path d="M25 25c-5-5-11-7-17-5M42 25c5-5 11-7 17-5"/><circle cx="27" cy="40" r="1.5"/><circle cx="38" cy="40" r="1.5"/><path d="M30 48c2 1 4 1 6 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M24 16h20l-4 38H28L24 16z"/><path d="M22 16h24"/><path d="M29 16l-4-8h17"/><path d="M28 31h12"/><circle cx="30" cy="42" r="1.5"/><circle cx="36" cy="47" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><circle cx="23" cy="22" r="8"/><circle cx="41" cy="22" r="8"/><circle cx="32" cy="37" r="17"/><circle cx="26" cy="35" r="1.7"/><circle cx="38" cy="35" r="1.7"/><path d="M29 44c2 2 4 2 6 0"/><path d="M32 39v4"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M18 42c-3-11 4-21 14-21s17 10 14 21c-4 11-24 11-28 0z"/><path d="M21 25l-8-7M43 25l8-7"/><path d="M25 38h2M37 38h2M29 46c2 1 4 1 6 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M11 35c9-12 23-16 37-8 5 3 8 9 9 13-14 8-34 5-46-5z"/><path d="M11 35l-6-5M11 35l-6 6"/><path d="M31 26c-2-5 1-10 7-13"/><circle cx="43" cy="34" r="1.5"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M44 9c-14 2-25 14-25 29 0 7 3 13 7 17C15 52 8 43 8 32 8 18 19 7 33 7c4 0 8 1 11 2z"/></svg>',
    '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="10"/><path d="M32 5v10M32 49v10M5 32h10M49 32h10M13 13l7 7M44 44l7 7M51 13l-7 7M20 44l-7 7"/><circle cx="28" cy="30" r="1.5"/><circle cx="36" cy="30" r="1.5"/><path d="M28 37c3 2 5 2 8 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M18 42c-7 0-12-5-12-11s5-11 12-11c3-7 10-11 18-9 8 2 13 8 14 16 5 1 9 5 9 10 0 6-5 11-12 11H18z"/><circle cx="27" cy="32" r="1.5"/><circle cx="39" cy="32" r="1.5"/><path d="M30 39c2 1 4 1 6 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M22 32l-11-8M42 32l11-8M22 32l-11 8M42 32l11 8"/><rect x="22" y="21" width="20" height="22" rx="6"/><path d="M27 28c4 3 6 3 10 0M27 36c4 3 6 3 10 0"/></svg>',
    '<svg viewBox="0 0 64 64"><path d="M9 42c14-2 27-11 39-29"/><path d="M44 9l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1 4-8z"/><path d="M15 46l-5 5M24 42l-3 7"/></svg>',
    '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="12"/><path d="M8 38c13-11 35-18 50-12"/><path d="M10 41c15 7 34 6 48-4"/><circle cx="28" cy="29" r="1.5"/><circle cx="36" cy="29" r="1.5"/></svg>'
  ];

  var iconColors = ['#ff6bb3', '#67d8ff', '#ffe36e', '#a78bff', '#77f2c7', '#ff9f7a', '#f7b7ff'];
  var resizeTimer = 0;
  var lastRenderSize = '';

  function getHeartMaskPoint(t, width, height){
    var heartScale = window.LoveNeon.getHeartScale(width, height);
    var heartYOffset = window.LoveNeon.getHeartYOffset(heartScale);
    var scale = 0.000015 * height * heartScale;
    var ratio = width / height;
    var x = 16 * Math.pow(Math.sin(t), 3);
    var y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    return {
      x: (0.5 - x * scale) * width,
      y: (0.5 + ratio * (y * scale - heartYOffset)) * height
    };
  }

  function getHeartMaskPoints(width, height){
    var points = [];

    for(var i = 0; i < 160; i++){
      points.push(getHeartMaskPoint((i / 160) * Math.PI * 2, width, height));
    }

    return points;
  }

  function isNearHeartLine(x, y, width, height, iconSize, heartPoints){
    var limit = Math.min(width, height) * 0.014 + iconSize * 0.28;
    var limitSquared = limit * limit;

    for(var i = 0; i < heartPoints.length; i++){
      var p = heartPoints[i];
      var dx = x - p.x;
      var dy = y - p.y;

      if(dx * dx + dy * dy < limitSquared){
        return true;
      }
    }

    return false;
  }

  function createEngravedPattern(){
    engravedPattern.textContent = '';

    var width = window.innerWidth;
    var height = window.innerHeight;
    var renderSize = width + 'x' + height;

    if(renderSize === lastRenderSize){
      return;
    }

    lastRenderSize = renderSize;
    var fragment = document.createDocumentFragment();
    var isMobile = width < 700;
    var cellSize = isMobile
      ? Math.max(52, Math.min(72, Math.floor(Math.min(width, height) / 7)))
      : Math.max(64, Math.min(92, Math.floor(Math.min(width, height) / 8)));
    var cols = Math.ceil(width / cellSize);
    var rows = Math.ceil(height / cellSize);
    var heartPoints = getHeartMaskPoints(width, height);

    for(var row = 0; row < rows; row++){
      var startCol = row % 2 === 0 ? 0 : cols - 1;
      var step = row % 2 === 0 ? 1 : -1;

      for(var colIndex = 0; colIndex < cols; colIndex++){
        var col = startCol + colIndex * step;

        if(Math.random() < (isMobile ? 0.08 : 0.14)){
          continue;
        }

        var size = isMobile
          ? Math.min(cellSize * 0.72, 22 + Math.random() * 24)
          : Math.min(cellSize * 0.74, 26 + Math.random() * 28);
        var xPx = ((col + 0.5 + (Math.random() - 0.5) * 0.52) / cols) * width;
        var yPx = ((row + 0.5 + (Math.random() - 0.5) * 0.52) / rows) * height;

        if(isNearHeartLine(xPx, yPx, width, height, size, heartPoints)){
          continue;
        }

        var icon = document.createElement('span');
        icon.className = 'engraved-icon';
        icon.style.setProperty('--x', ((xPx / width) * 100).toFixed(2) + '%');
        icon.style.setProperty('--y', ((yPx / height) * 100).toFixed(2) + '%');
        icon.style.setProperty('--size', size.toFixed(1) + 'px');
        icon.style.setProperty('--rotate', ((Math.random() * 44) - 22).toFixed(1) + 'deg');
        icon.style.setProperty('--opacity', (0.72 + Math.random() * 0.22).toFixed(2));
        icon.style.setProperty('--icon-color', iconColors[Math.floor(Math.random() * iconColors.length)]);
        icon.innerHTML = cuteIconSvgs[Math.floor(Math.random() * cuteIconSvgs.length)];
        fragment.appendChild(icon);
      }
    }

    engravedPattern.appendChild(fragment);
  }

  window.addEventListener('resize', function(){
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(createEngravedPattern, 220);
  });

  createEngravedPattern();
})();
