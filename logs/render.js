(() => {
  "use strict";

  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function showError(root, message, details) {
    root.innerHTML = "";
    const box = el("div", "box");
    const h = el("h3", null, message);
    box.appendChild(h);

    if (details) {
      const p = el("p", null, details);
      p.style.opacity = "0.9";
      box.appendChild(p);
    }
    root.appendChild(box);
  }

  function renderLogs(root, logs) {
    root.innerHTML = "";

    // newest first by date (string YYYY-MM-DD works lexicographically)
    logs.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    logs.forEach((log) => {
      const card = el("section", "box");
      card.style.marginBottom = "2em";

      const titleRow = el("div");
      const h3 = el("h3", null, `${log.date || "????-??-??"} — ${log.title || "Untitled"}`);
      titleRow.appendChild(h3);
      card.appendChild(titleRow);

      if (Array.isArray(log.tags) && log.tags.length) {
        const tags = el("p");
        tags.style.marginTop = "-0.5em";
        tags.style.opacity = "0.9";
        tags.textContent = log.tags.map(t => `#${t}`).join(" ");
        card.appendChild(tags);
      }

      if (Array.isArray(log.bullets) && log.bullets.length) {
        const ul = el("ul");
        ul.style.marginTop = "1em";
        log.bullets.forEach((b) => {
          const li = el("li", null, b);
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      if (Array.isArray(log.links) && log.links.length) {
        const p = el("p");
        p.style.marginTop = "1em";
        log.links.forEach((l, i) => {
          const a = document.createElement("a");
          a.href = l.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = l.label || l.url;

          if (i > 0) p.appendChild(document.createTextNode(" · "));
          p.appendChild(a);
        });
        card.appendChild(p);
      }

      root.appendChild(card);
    });
  }

  function start() {
    const root = document.getElementById("logs-root");
    if (!root) {
      // Eğer root yoksa, script çalışsa bile render edemez.
      // Bu durumda sayfayı bozmadan çık.
      return;
    }

    // logs/index.html içindeyken: /logs/logs.json
    // Her durumda "bu sayfanın bulunduğu klasöre göre" çöz.
    const jsonUrl = new URL("logs.json", window.location.href);

    fetch(jsonUrl.toString(), { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} while fetching ${jsonUrl.pathname}`);
        return r.json();
      })
      .then((data) => {
        const logs = Array.isArray(data) ? data : [data];
        if (!logs.length) {
          showError(root, "No logs yet", "logs.json is empty.");
          return;
        }
        renderLogs(root, logs);
      })
      .catch((err) => {
        showError(root, "Logs failed to load", String(err && err.message ? err.message : err));
      });
  }

  // DOM garanti olsun diye:
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
