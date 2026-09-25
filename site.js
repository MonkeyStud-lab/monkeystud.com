(function () {
  var script = document.querySelector('script[src*="site.js"]');
  var root = script && script.src ? script.src.replace(/site\.js(\?.*)?$/, "") : "";
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function sparkles() {
    var layer = document.getElementById("sparkles");
    if (!layer) return;
    var last = 0;
    document.addEventListener("mousemove", function (e) {
      if (motion.matches || Date.now() - last < 40) return;
      last = Date.now();
      var star = document.createElement("span");
      star.className = "sparkle";
      star.textContent = "*";
      star.style.left = e.clientX + "px";
      star.style.top = e.clientY + "px";
      layer.appendChild(star);
      setTimeout(function () { star.remove(); }, 700);
    });
  }

  function hitCounter() {
    var box = document.getElementById("hit-counter");
    var live = location.hostname === "monkeystud.com" || location.hostname === "www.monkeystud.com";
    // All pages share one counter. Local previews only read it.
    var url = "https://tally.yuki.sh/hits/monkeystud/homepage.json" + (live ? "" : "?mode=read");
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 8000);
    fetch(url, { signal: controller.signal, cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("Counter unavailable");
        return r.json();
      })
      .then(function (data) {
        // Never fall back to page hits, even when the visitor total is zero.
        if (!Number.isSafeInteger(data.visitor) || data.visitor < 0) throw new Error("Invalid visitor total");
        if (!box) return;
        box.textContent = "";
        String(data.visitor).padStart(7, "0").split("").forEach(function (digit) {
          var span = document.createElement("span");
          span.textContent = digit;
          box.appendChild(span);
        });
        box.setAttribute("aria-label", data.visitor + " unique visitors, estimated by distinct IP address");
      })
      .catch(function () {
        if (!box) return;
        box.textContent = "Unavailable";
        box.setAttribute("aria-label", "Visitor counter unavailable");
      })
      .finally(function () { clearTimeout(timeout); });
  }

  function midi() {
    var audio = document.getElementById("lab-midi");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "lab-midi";
      audio.src = root + "audio/lab-theme.wav";
      document.body.appendChild(audio);
    }
    audio.loop = true;
    audio.preload = "none";
    audio.setAttribute("playsinline", "");
    audio.volume = 0.3;

    var toggle = document.getElementById("midi-toggle");
    if (!toggle) {
      var bar = document.createElement("div");
      bar.className = "midi-bar midi";
      bar.innerHTML = '<b>Lab theme</b> <button type="button" class="btn" id="midi-toggle">Play MIDI!!!</button> <label class="music-volume" for="midi-volume">Volume <input id="midi-volume" type="range" min="0" max="100" value="30" /></label> <span class="tiny" id="midi-status" role="status">Click Play to start the chiptune loop.</span>';
      var nav = document.querySelector(".jump");
      if (nav) nav.insertAdjacentElement("afterend", bar);
      else document.body.prepend(bar);
      toggle = document.getElementById("midi-toggle");
    }

    var panel = document.querySelector(".midi");
    var status = document.getElementById("midi-status");
    var volume = document.getElementById("midi-volume");
    var wantOn = false;
    var attempt = 0;

    function show(on, message) {
      if (panel) panel.classList.toggle("on", on);
      toggle.textContent = on ? "Stop MIDI" : "Play MIDI!!!";
      toggle.setAttribute("aria-pressed", String(on));
      if (status) status.textContent = message;
    }
    function stop() {
      wantOn = false;
      attempt++;
      audio.pause();
      try { audio.currentTime = 0; } catch (e) {}
      show(false, "Stopped. Click Play to start again.");
    }
    function fail(err, token) {
      if (!wantOn || token !== attempt) return;
      wantOn = false;
      show(false, "Audio could not start" + (err && err.name ? " (" + err.name + ")" : "") + ". Try Play again.");
    }
    toggle.addEventListener("click", function () {
      if (wantOn) { stop(); return; }
      wantOn = true;
      var token = ++attempt;
      show(true, "Starting the chiptune loop...");
      try {
        // Keep play() directly in the user click; no AudioContext or autoplay.
        var started = audio.play();
        if (started && started.then) {
          started.then(function () {
            if (wantOn && token === attempt) show(true, "Playing the lab chiptune loop.");
          }).catch(function (err) { fail(err, token); });
        }
      } catch (err) { fail(err, token); }
    });
    audio.addEventListener("error", function () { fail(audio.error, attempt); });
    if (volume) {
      volume.addEventListener("input", function () { audio.volume = Number(volume.value) / 100; });
    }
    show(false, "Click Play to start the chiptune loop.");
  }

  sparkles();
  hitCounter();
  midi();
})();
