(function(){
  var heartBurstLayer = document.getElementById('heartBurstLayer');
  var spaceHint = document.getElementById('spaceHint');

  if(!heartBurstLayer){
    return;
  }

  var lastBurstAt = 0;
  var burstHoldTimer = 0;
  var maxLiveHearts = 320;
  var colors = ['#ff3d9a', '#ff8cc8', '#35cfff', '#8deaff', '#b56bff', '#ffffff'];
  var heartTemplate = document.createElement('template');
  heartTemplate.innerHTML = '<svg viewBox="0 0 64 64"><path d="M32 57C17 44 7 34 7 21 7 13 13 7 22 7c5 0 9 3 10 8 1-5 5-8 10-8 9 0 15 6 15 14 0 13-10 23-25 36z"/></svg>';

  function updateHintText(){
    if(!spaceHint){
      return;
    }

    spaceHint.textContent = window.innerWidth < 700 ? 'Tap or hold for hearts' : 'Click or hold Space';
  }

  function triggerHeartBurst(){
    if(document.hidden){
      return;
    }

    var now = performance.now();

    if(now - lastBurstAt < 260){
      return;
    }

    lastBurstAt = now;

    var count = 48;
    var fragment = document.createDocumentFragment();
    var maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight) * 0.66;

    for(var i = 0; i < count; i++){
      var heart = document.createElement('span');
      var angle = Math.random() * Math.PI * 2;
      var spread = Math.pow(Math.random(), 0.58);
      var distance = 18 + spread * maxDistance;
      var size = Math.random() < 0.18 ? 52 + Math.random() * 38 : 16 + Math.random() * 32;
      var dx = Math.cos(angle) * distance;
      var dy = Math.sin(angle) * distance;

      heart.className = 'burst-heart';
      heart.style.setProperty('--dx', dx.toFixed(1) + 'px');
      heart.style.setProperty('--dy', dy.toFixed(1) + 'px');
      heart.style.setProperty('--size', size.toFixed(1) + 'px');
      heart.style.setProperty('--end-scale', (0.9 + Math.random() * 0.55).toFixed(2));
      heart.style.setProperty('--rotate', ((Math.random() * 90) - 45).toFixed(1) + 'deg');
      heart.style.setProperty('--spin', ((Math.random() * 260) - 130).toFixed(1) + 'deg');
      heart.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
      heart.style.animationDelay = (Math.random() * 220).toFixed(0) + 'ms';
      heart.appendChild(heartTemplate.content.firstElementChild.cloneNode(true));
      fragment.appendChild(heart);
    }

    heartBurstLayer.appendChild(fragment);

    while(heartBurstLayer.childElementCount > maxLiveHearts){
      heartBurstLayer.firstElementChild.remove();
    }
  }

  window.triggerHeartBurst = triggerHeartBurst;

  function startBurstHold(){
    if(burstHoldTimer){
      return;
    }

    triggerHeartBurst();
    burstHoldTimer = window.setInterval(triggerHeartBurst, 320);
  }

  function stopBurstHold(){
    if(!burstHoldTimer){
      return;
    }

    window.clearInterval(burstHoldTimer);
    burstHoldTimer = 0;
  }

  window.addEventListener('keydown', function(event){
    if(event.code !== 'Space'){
      return;
    }

    if(document.activeElement && document.activeElement.tagName === 'INPUT'){
      return;
    }

    event.preventDefault();
    startBurstHold();
  });

  window.addEventListener('keyup', function(event){
    if(event.code === 'Space'){
      stopBurstHold();
    }
  });

  window.addEventListener('blur', stopBurstHold);

  if(spaceHint){
    spaceHint.addEventListener('pointerdown', function(event){
      event.preventDefault();
      spaceHint.setPointerCapture(event.pointerId);
      startBurstHold();
    });

    spaceHint.addEventListener('pointerup', stopBurstHold);
    spaceHint.addEventListener('pointercancel', stopBurstHold);
    spaceHint.addEventListener('lostpointercapture', stopBurstHold);
  }

  heartBurstLayer.addEventListener('animationend', function(event){
    if(event.target.classList.contains('burst-heart')){
      event.target.remove();
    }
  });

  document.addEventListener('pointerdown', function(event){
    if(event.button && event.button !== 0){
      return;
    }

    if(event.target.closest('button, input, form, .name-panel, .name-toggle, .space-hint')){
      return;
    }

    startBurstHold();
  });

  document.addEventListener('pointerup', function(event){
    stopBurstHold();
  });

  document.addEventListener('pointercancel', function(event){
    stopBurstHold();
  });

  window.addEventListener('resize', updateHintText);
  updateHintText();
})();
