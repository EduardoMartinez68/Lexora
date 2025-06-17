/**----------------------------------TABS----------------------**/
function openTab(evt, tabName) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-buttons button');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
  evt.currentTarget.classList.add('active');
}

/**----------------------------------MESSAGE POP----------------------**/
function showPop(idOverlay) {
  const overlay = document.getElementById(idOverlay);
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

// Función para ocultar popup
function hidePop(idOverlay) {
  const overlay = document.getElementById(idOverlay);
  if (overlay) {
    overlay.style.display = 'none';
  }
}


/**----------------------------------alert POP----------------------**/
function showAlert(type, title, description, readmoreText='') {
  const overlay = document.getElementById('alert-overlay');
  const pop = document.getElementById('alert-pop');
  const titleEl = document.getElementById('alert-title');
  const descEl = document.getElementById('alert-description');
  const readmoreEl = document.getElementById('alert-readmore');
  const buttonsEl = document.getElementById('alert-buttons');
  const iconEl = document.getElementById('alert-icon');

  pop.classList.remove('sub-menu-app-pop-info', 'sub-menu-app-pop-alert', 'sub-menu-app-pop-question', 'sub-menu-app-pop-normal');
  pop.classList.add('sub-menu-app-pop-' + type);

  //icon for type
  if (type === 'info') iconEl.innerHTML = '<i class="fi fi-sr-info"></i>';
  else if (type === 'alert') iconEl.innerHTML = '<i class="fi fi-sr-exclamation"></i>';
  else if (type === 'question') iconEl.innerHTML = '<i class="fi fi-sr-interrogation"></i>';
  else iconEl.innerHTML = '';

  //update the text that show the alert pop
  titleEl.textContent = title;
  descEl.textContent = description;
  buttonsEl.innerHTML = '';

  //get the text of the buttons with the language that have the web. This is for update the text of all the button
  const btnTextSuccess = buttonsEl.getAttribute('btnTextSuccess');
  const btnTextCancel = buttonsEl.getAttribute('btnTextCancel');
  const btnTextReadMost = buttonsEl.getAttribute('btnTextReadMost');

  //her we will see if exist most text for show like message of error in code
  readmoreEl.textContent = readmoreText;
  readmoreEl.style.display = 'none';
  

  //we will see if the message is a question alert-readmore
  if (type === 'question') {
    const btnYes = document.createElement('button');
    btnYes.className = 'sub-menu-app-btn sub-menu-app-btn-primary';
    btnYes.textContent = btnTextSuccess;
    btnYes.onclick = function () {
      hideAlert();
      return true;
    };

    const btnNo = document.createElement('button');
    btnNo.className = 'sub-menu-app-btn sub-menu-app-btn-secondary';
    btnNo.textContent = btnTextCancel;
    btnNo.onclick = function () {
      hideAlert();
      return true;
    };

    buttonsEl.appendChild(btnYes);
    buttonsEl.appendChild(btnNo);
  } else {
    //when the alert not is a question, only exist a button
    const btnClose = document.createElement('button');
    btnClose.className = 'sub-menu-app-btn sub-menu-app-btn-primary';
    btnClose.textContent = btnTextSuccess;

    //when the user do a click in the button, only hidden the alert
    btnClose.onclick = function () {
      hideAlert();
    };
    buttonsEl.appendChild(btnClose);
  }


  
  overlay.style.display = 'flex';
}

function hideAlert() {
  const overlay = document.getElementById('alert-overlay');
  overlay.style.display = 'none';
}

function toggleReadMore() {
  const content = document.getElementById('alert-readmore');
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
  } else {
    content.style.display = 'none';
  }
}
