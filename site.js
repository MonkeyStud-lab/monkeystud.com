(function () {
  var layer = document.getElementById("sparkles");
  if (!layer) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  var last = 0;
  document.addEventListener("mousemove", function (e) {
    var now = Date.now();
    if (now - last < 40) return;
    last = now;
    var star = document.createElement("span");
    star.className = "sparkle";
    star.textContent = "*";
    star.style.left = e.clientX + "px";
    star.style.top = e.clientY + "px";
    layer.appendChild(star);
    setTimeout(function () { star.remove(); }, 700);
  });
})();
