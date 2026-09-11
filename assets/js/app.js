(function () {
  var current = null, currentBtn = null;

  function stopAll() {
    document.querySelectorAll('audio').forEach(function (a) {
      if (!a.paused) { a.pause(); a.currentTime = 0; }
    });
    if (currentBtn) currentBtn.classList.remove('playing');
    current = null; currentBtn = null;
  }

  document.querySelectorAll('button.hs[data-audio]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.dataset.audio);
      if (!el) return;
      var wasPlaying = (current === el && !el.paused);
      stopAll();
      if (wasPlaying) return;
      el.currentTime = 0;
      var pr = el.play();
      current = el; currentBtn = btn; btn.classList.add('playing');
      if (pr && pr.catch) pr.catch(function (e) {
        btn.classList.remove('playing');
        console.warn('playback blocked:', e && e.name);
      });
      el.onended = function () { btn.classList.remove('playing'); };
    });
  });

  document.querySelectorAll('button.hs[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      stopAll();
      window.location.href = btn.dataset.goto;
    });
  });

  // debug overlay: ?debug=1 or press d
  function setDebug(on) {
    document.body.classList.toggle('debug', on);
    try { sessionStorage.setItem('drip-debug', on ? '1' : '0'); } catch (e) {}
  }
  var qs = new URLSearchParams(location.search);
  var stored = '0';
  try { stored = sessionStorage.getItem('drip-debug') || '0'; } catch (e) {}
  setDebug(qs.get('debug') === '1' || stored === '1');

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input,textarea')) return;
    if (e.key === 'd' || e.key === 'D') setDebug(!document.body.classList.contains('debug'));
    if (e.key === 'Escape') stopAll();
  });

})();
