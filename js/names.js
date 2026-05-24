(function(){
  var nameToggle = document.getElementById('nameToggle');
  var namePanel = document.getElementById('namePanel');
  var namePanelClose = document.getElementById('namePanelClose');
  var firstNameInput = document.getElementById('firstName');
  var secondNameInput = document.getElementById('secondName');
  var heartText = document.getElementById('heartText');
  var clearNames = document.getElementById('clearNames');
  var autoBurstToggle = document.getElementById('autoBurstToggle');
  var autoBurstTimer = 0;
  var autoBurstDismissed = false;
  var storageKey = 'love-neon-names';
  var resizeTimer = 0;

  function openNamePanel(){
    namePanel.classList.add('is-open');
    firstNameInput.focus();
  }

  function closeNamePanel(){
    namePanel.classList.remove('is-open');
  }

  function updateHeartText(){
    var firstName = firstNameInput.value.trim();
    var secondName = secondNameInput.value.trim();
    var hasBothNames = firstName && secondName;
    var hasAnyName = firstName.length > 0 || secondName.length > 0;

    heartText.textContent = '';
    heartText.classList.remove('is-inline');
    heartText.classList.remove('is-stacked');

    if(hasBothNames){
      renderBothNames(firstName, secondName, false);

      if(isInlineNameWrapped()){
        renderBothNames(firstName, secondName, true);
      }
    }else if(firstName || secondName){
      appendHeartTextLine((firstName || secondName).toUpperCase(), 'heart-name');
    }

    heartText.classList.toggle('is-visible', hasAnyName);
    syncAutoBurstAvailability(hasAnyName);
    saveState();
  }

  function saveState(){
    var state = {
      firstName: firstNameInput.value,
      secondName: secondNameInput.value,
      autoBurst: autoBurstToggle.checked,
      autoBurstDismissed: autoBurstDismissed
    };

    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function restoreState(){
    var rawState = localStorage.getItem(storageKey);

    if(!rawState){
      return;
    }

    try{
      var state = JSON.parse(rawState);
      firstNameInput.value = state.firstName || '';
      secondNameInput.value = state.secondName || '';
      autoBurstDismissed = !!state.autoBurstDismissed;

      if(state.autoBurst === false){
        autoBurstToggle.checked = false;
      }

      updateHeartText();

      if(state.autoBurst === false){
        autoBurstToggle.checked = false;
        autoBurstDismissed = true;
        stopAutoBurst();
      }
    }catch(error){
      localStorage.removeItem(storageKey);
    }
  }

  function syncAutoBurstAvailability(hasAnyName){
    autoBurstToggle.disabled = !hasAnyName;

    if(!hasAnyName){
      autoBurstToggle.checked = false;
      autoBurstDismissed = false;
      stopAutoBurst();
      return;
    }

    if(!autoBurstToggle.checked && !autoBurstDismissed){
      autoBurstToggle.checked = true;
      startAutoBurst();
    }
  }

  function startAutoBurst(){
    if(autoBurstTimer){
      return;
    }

    if(typeof window.triggerHeartBurst === 'function'){
      window.triggerHeartBurst();
    }

    autoBurstTimer = window.setInterval(function(){
      if(!autoBurstToggle.checked || autoBurstToggle.disabled){
        stopAutoBurst();
        return;
      }

      if(typeof window.triggerHeartBurst === 'function'){
        window.triggerHeartBurst();
      }
    }, 700);
  }

  function stopAutoBurst(){
    if(!autoBurstTimer){
      return;
    }

    window.clearInterval(autoBurstTimer);
    autoBurstTimer = 0;
  }

  function renderBothNames(firstName, secondName, stacked){
    heartText.textContent = '';
    heartText.classList.toggle('is-inline', !stacked);
    heartText.classList.toggle('is-stacked', stacked);

    if(stacked){
      appendHeartTextLine(firstName, 'heart-name');
      appendHeartTextLine('\u2665', 'heart-separator');
      appendHeartTextLine(secondName, 'heart-name');
    }else{
      appendHeartTextLine(firstName, 'heart-inline');
      appendHeartTextLine('\u2665', 'heart-separator-inline');
      appendHeartTextLine(secondName, 'heart-inline');
    }
  }

  function isInlineNameWrapped(){
    var maxWidth = window.LoveNeon.getInlineTextLimit(window.innerWidth);
    var firstName = heartText.children[0];
    var separator = heartText.children[1];
    var secondName = heartText.children[2];

    if(!firstName || !separator || !secondName){
      return false;
    }

    var firstWidth = firstName.getBoundingClientRect().width;
    var separatorWidth = separator.getBoundingClientRect().width;
    var secondWidth = secondName.getBoundingClientRect().width;
    var shortestNameWidth = Math.max(1, Math.min(firstWidth, secondWidth));
    var widthDifference = Math.abs(firstWidth - secondWidth);
    var totalTextWidth = firstWidth + separatorWidth + secondWidth;
    var isVisuallyUnbalanced = widthDifference > 80 && Math.max(firstWidth, secondWidth) / shortestNameWidth > 1.55;

    return totalTextWidth > maxWidth * 0.9 || isVisuallyUnbalanced;
  }

  function appendHeartTextLine(text, className){
    var line = document.createElement('span');
    line.textContent = text;
    line.className = className || 'heart-name';
    heartText.appendChild(line);
  }

  nameToggle.addEventListener('click', function(){
    if(namePanel.classList.contains('is-open')){
      closeNamePanel();
    }else{
      openNamePanel();
    }
  });

  namePanelClose.addEventListener('click', closeNamePanel);

  document.addEventListener('pointerdown', function(event){
    if(!namePanel.classList.contains('is-open')){
      return;
    }

    if(namePanel.contains(event.target) || nameToggle.contains(event.target)){
      return;
    }

    closeNamePanel();
  });

  namePanel.addEventListener('submit', function(event){
    event.preventDefault();
    updateHeartText();
    closeNamePanel();
  });

  firstNameInput.addEventListener('input', updateHeartText);
  secondNameInput.addEventListener('input', updateHeartText);
  window.addEventListener('resize', function(){
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateHeartText, 80);
  });

  autoBurstToggle.addEventListener('change', function(){
    if(autoBurstToggle.checked){
      autoBurstDismissed = false;
      startAutoBurst();
    }else{
      autoBurstDismissed = true;
      stopAutoBurst();
    }

    saveState();
  });

  clearNames.addEventListener('click', function(){
    firstNameInput.value = '';
    secondNameInput.value = '';
    updateHeartText();
    firstNameInput.focus();
  });

  restoreState();
})();
