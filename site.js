(function () {
  var script = document.querySelector("script[src*=\"site.js\"]");
  var root = script && script.src ? script.src.replace(/site\.js(\?.*)?$/, "") : "";

  function sparkles() {
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
  }

  function padHits(n) {
    var s = String(Math.max(0, parseInt(n, 10) || 0));
    while (s.length < 7) s = "0" + s;
    if (s.length > 7) s = s.slice(-7);
    return s;
  }

  function renderCounter(n) {
    var box = document.getElementById("hit-counter");
    if (!box) return;
    box.innerHTML = "";
    padHits(n).split("").forEach(function (d) {
      var span = document.createElement("span");
      span.textContent = d;
      box.appendChild(span);
    });
  }

  function hitCounter() {
    fetch("https://tally.yuki.sh/hits/monkeystud/homepage.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        renderCounter(data.visit || data.visitor || 0);
      })
      .catch(function () {});
  }

  function midi() {
    var audio = document.getElementById("lab-midi");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "lab-midi";
      audio.loop = true;
      audio.preload = "auto";
      audio.setAttribute("playsinline", "");
      document.body.appendChild(audio);
    }
    audio.loop = true;
    audio.muted = false;
    audio.volume = 1;
    if (!audio.currentSrc && !audio.getAttribute("src") && !audio.querySelector("source")) {
      audio.src = root + "audio/lab-theme.wav";
    } else if (audio.tagName && !audio.querySelector("source") && !audio.src) {
      audio.src = root + "audio/lab-theme.wav";
    }

    var panel = document.querySelector(".midi");
    var toggle = document.getElementById("midi-toggle");
    var status = document.getElementById("midi-status");
    var title = document.getElementById("midi-title");
    if (title) title.textContent = "lab-theme.mid";

    if (!toggle) {
      var bar = document.createElement("div");
      bar.className = "midi-bar";
      bar.innerHTML = "<b>MIDI</b> lab-theme.mid &nbsp;<button type=\"button\" class=\"btn\" id=\"midi-toggle\">Play MIDI!!!</button>";
      document.body.appendChild(bar);
      toggle = document.getElementById("midi-toggle");
    }

    var wantOn = false;

    function setOn(on) {
      wantOn = on;
      if (panel) {
        if (on) panel.classList.add("on");
        else panel.classList.remove("on");
      }
      if (toggle) toggle.textContent = on ? "Stop MIDI" : "Play MIDI!!!";
      if (status) {
        status.textContent = on
          ? "Now blasting in glorious 22kHz mono."
          : "Click Play MIDI — Edge and Chrome block autoplay.";
      }
    }

    function fail(err) {
      if (!wantOn) return;
      setOn(false);
      if (status) {
        status.textContent = "Could not start audio" + (err && err.name ? " (" + err.name + ")" : "") + ". Click Play MIDI again.";
      }
    }

    function play() {
      wantOn = true;
      if (!audio.currentSrc) audio.src = root + "audio/lab-theme.wav";
      audio.muted = false;
      audio.volume = 1;
      var started = audio.play();
      if (started && typeof started.then === "function") {
        started.then(function () {
          if (wantOn) setOn(true);
        }).catch(fail);
      } else if (!audio.paused) {
        setOn(true);
      }
    }

    function stop() {
      wantOn = false;
      audio.pause();
      try { audio.currentTime = 0; } catch (e) {}
      setOn(false);
    }

    function onToggle() {
      if (wantOn && !audio.paused) stop();
      else play();
    }

    if (toggle) {
      toggle.addEventListener("click", onToggle);
    }
  }

  sparkles();
  hitCounter();
  midi();
})();
