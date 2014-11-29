animationDelay = 100;
minSearchTime  = 100;
 
 // Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  
  // new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  // "jhack".... I basically made the variable 'manager' global, that way I can do things from the html
  
  // Saved game state... (uncaught error?)
  var manager = new GameManager(jSize, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  
  // New game state...
  // var manager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  // TODO: This code is in need of a refactor (along with the rest)
  var storage     = new LocalStorageManager;
  var noticeClose = document.querySelector(".notice-close-button");
  var notice      = document.querySelector(".app-notice");
  if (storage.getNoticeClosed()) {
    notice.parentNode.removeChild(notice);
  } else {
    noticeClose.addEventListener("click", function () {
      notice.parentNode.removeChild(notice);
      storage.setNoticeClosed(true);
      ga("send", "event", "notice", "closed");
    });
  }
});