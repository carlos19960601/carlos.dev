/* assets/app.js · 子页共享行为：复制邮箱 + toast（文章页 <script defer> 引入） */
(function () {
  var toast = document.getElementById('toast');
  var timer = null;
  function show(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('show'); }, 1900);
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var email = b.dataset.copy;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { show('邮箱已复制：' + email); },
          function () { show('复制失败，请手动复制 ' + email); }
        );
      } else {
        show('请手动复制：' + email);
      }
    });
  });
})();
