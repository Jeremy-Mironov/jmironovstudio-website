// The desk is the whole site: the sketchbook (home, services, pricing), the project
// folder, the blog magazine, the résumé and the contact envelope. Every address is one
// of these objects or a page inside one, so moving the camera or turning a page moves
// the address bar too, and an address opens the desk right there.
import { createNotebook } from "./notebook.js";
import { createBook } from "./book.js";
import { el, reduce } from "./util.js";

var root = document.getElementById("nb"),
  stage = document.getElementById("stage"),
  world = document.getElementById("world"),
  desk = document.getElementById("desk");
var ROUTES = JSON.parse(document.getElementById("routes").textContent),
  SITE = root.getAttribute("data-site") || location.origin;
var qmode = new URLSearchParams(location.search).get("mode") || "auto";
var SECS = ["/", "/services", "/pricing"];
var OBJS = ["notebook", "folder", "magazine", "resume", "envelope"];
// The objects lie still and choosing one moves the camera to it: up a little, across
// and down, turning to square the object up. Offsets and tilts match the --x/--y/--r of
// each .obj in the CSS; cy is the height the camera centres on.
var DESK = {
  dk: {
    z: 0.84,
    lift: 0.64,
    at: {
      notebook: [0, 0, 0],
      folder: [1310, -60, 2],
      magazine: [1320, 800, 3],
      resume: [-1380, 250, -2],
      envelope: [-30, 890, -2],
    },
    cy: {
      notebook: 496,
      folder: 482,
      magazine: 510,
      resume: 520,
      envelope: 525,
    },
  },
  mb: {
    z: 1,
    lift: 0.8,
    at: {
      notebook: [0, 0, 0],
      folder: [430, 0, 1.5],
      magazine: [860, 0, -1.5],
      resume: [1290, 0, 1],
      envelope: [1720, 0, -1],
    },
    cy: {},
  },
};
var mob = null,
  SW = 0,
  SH = 0,
  cur = null,
  cam = null,
  camAnim = null,
  ready = false,
  wheelT = 0,
  touch = null;
// where each object was left open: the dock and the objects on the desk link back there
var last = {
  notebook: "/",
  folder: "/projects",
  magazine: "/blog",
  resume: "/about",
  envelope: "/contact",
};

function objEl(n) {
  return root.querySelector(".o-" + n);
}
var nb = createNotebook(root, world, function (k) {
  turned("notebook", SECS[k]);
});
var books = {};
["folder", "magazine", "resume"].forEach(function (n) {
  books[n] = createBook(objEl(n).querySelector(".book"), root, function (path) {
    turned(n, path);
  });
});

// ---- addresses ----
function clean(path) {
  return path.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
}
function here() {
  return clean(location.pathname);
}
function parse(path) {
  path = clean(path);
  if (!ROUTES[path]) return null;
  var k = SECS.indexOf(path),
    m = /^\/(projects|blog)(\/|$)/.exec(path);
  return {
    path: path,
    sec: k,
    obj:
      k >= 0
        ? "notebook"
        : m
          ? m[1] === "blog"
            ? "magazine"
            : "folder"
          : path === "/about"
            ? "resume"
            : "envelope",
  };
}
function query() {
  return qmode !== "auto" ? "?mode=" + qmode : "";
}
// Title, description and canonical of an address, as the server rendered them for it.
function meta(path) {
  // canonical addresses end in a slash, as in the sitemap
  var m = ROUTES[path],
    url = SITE + path.replace(/\/?$/, "/");
  if (!m) return;
  document.title = m.title;
  [
    ['meta[name="description"]', "content", m.description],
    ['meta[name="title"]', "content", m.title],
    ['link[rel="canonical"]', "href", url],
    ['meta[property="og:url"]', "content", url],
    ['meta[property="og:title"]', "content", m.title],
    ['meta[property="og:description"]', "content", m.description],
    ['meta[property="twitter:url"]', "content", url],
    ['meta[property="twitter:title"]', "content", m.title],
    ['meta[property="twitter:description"]', "content", m.description],
  ].forEach(function (a) {
    var e = document.head.querySelector(a[0]);
    if (e) e.setAttribute(a[1], a[2]);
  });
}
function links(name) {
  root
    .querySelectorAll('a[data-keep][data-obj="' + name + '"]')
    .forEach(function (a) {
      a.setAttribute("href", last[name]);
    });
  // tabs and lists inside the object mark the page that is open
  objEl(name)
    .querySelectorAll("a[data-mark]")
    .forEach(function (a) {
      var on = a.getAttribute("href") === last[name];
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
}
// A page turned by hand inside the open object: the address follows it.
function turned(name, path) {
  last[name] = path;
  links(name);
  if (!ready || name !== cur || path === here()) return;
  history.pushState(null, "", path + query());
  meta(path);
}
// Open an address on the desk. o.init: as the page loads, nothing animates; o.jump:
// go to its first page even when a later page of it is open.
function apply(r, o) {
  o = o || {};
  var travel = !o.init && cur !== r.obj,
    t = {
      instant: !!o.init,
      jump: !!o.jump,
      delay: travel && !reduce ? (mob ? 560 : 820) : 0,
    };
  show(r.obj, o.init);
  if (r.obj === "notebook") nb.toSec(r.sec, t);
  else if (books[r.obj]) books[r.obj].open(r.path, t);
  last[r.obj] = r.path;
  links(r.obj);
  if (!o.init) {
    meta(r.path);
    root.classList.remove("lost");
  }
}
function navigate(path, o) {
  var r = parse(path);
  if (!r) {
    location.assign(path);
    return;
  }
  if (r.path !== here()) history.pushState(null, "", r.path + query());
  apply(r, o);
}

// ---- camera ----
function camFor(name) {
  var D = DESK[mob ? "mb" : "dk"],
    a = D.at[name],
    r = (a[2] * Math.PI) / 180,
    dy = (D.cy[name] || SH / 2) - SH / 2;
  return {
    x: a[0] + SW / 2 - dy * Math.sin(r),
    y: a[1] + SH / 2 + dy * Math.cos(r),
    z: D.z,
    r: a[2],
  };
}
function camTf(c) {
  return (
    "translate(" +
    SW / 2 +
    "px," +
    SH / 2 +
    "px) rotate(" +
    (-c.r).toFixed(2) +
    "deg) scale(" +
    c.z.toFixed(4) +
    ") translate(" +
    (-c.x).toFixed(1) +
    "px," +
    (-c.y).toFixed(1) +
    "px)"
  );
}
function moveCam(to, animate) {
  var from = cam,
    busy = camAnim && camAnim.playState === "running",
    now = busy ? getComputedStyle(desk).transform : null;
  if (camAnim) camAnim.cancel();
  camAnim = null;
  cam = to;
  desk.style.transform = camTf(to);
  if (!animate || !from || reduce || !desk.animate) return;
  var opt = {
    duration: mob ? 750 : 1150,
    easing: "cubic-bezier(.45,.05,.35,1)",
  };
  if (busy) {
    camAnim = desk.animate([{ transform: now }, { transform: camTf(to) }], opt);
    return;
  }
  var mid = {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2,
    z: Math.min(from.z, to.z) * DESK[mob ? "mb" : "dk"].lift,
    r: (from.r + to.r) / 2,
  };
  camAnim = desk.animate(
    [
      { transform: camTf(from) },
      { transform: camTf(mid), offset: 0.5 },
      { transform: camTf(to) },
    ],
    opt,
  );
}
function show(name, init) {
  if (name === cur) return;
  OBJS.forEach(function (n) {
    var o = objEl(n),
      on = n === name;
    o.classList.toggle("on", on);
    o.querySelector(".ob-body").inert = !on;
  });
  root.querySelectorAll(".dock a").forEach(function (a) {
    var on = a.getAttribute("data-obj") === name;
    a.classList.toggle("on", on);
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  cur = name;
  root.setAttribute("data-open", name);
  moveCam(camFor(name), !init);
}
// wheel, arrow keys and swipes turn the pages of whatever is open
function step(d) {
  if (cur === "notebook") nb.step(d);
  else if (books[cur]) books[cur].step(d);
}

function layout() {
  var vw = window.innerWidth,
    vh = window.innerHeight;
  var m =
    qmode === "mobile" || (qmode !== "desktop" && (vw < 760 || vw / vh < 0.78));
  if (m !== mob) {
    mob = m;
    root.classList.toggle("mb", mob);
    root.classList.toggle("dk", !mob);
    nb.setMode(mob);
    var s = nb.size();
    SW = s.w;
    SH = s.h;
    stage.style.width = SW + "px";
    stage.style.height = SH + "px";
    pages();
    if (cur) moveCam(camFor(cur), false);
  }
  stage.style.transform =
    "translate(-50%,-50%) scale(" + Math.min(vw / SW, vh / SH).toFixed(4) + ")";
}
function pages() {
  for (var n in books) books[n].build(mob);
}

// ---- lightbox: the taped photo or note is lifted off the page, frame and tape included ----
var lb = null;
function openLB(item) {
  if (lb) return;
  var r = item.getBoundingClientRect(),
    img = item.querySelector("img"),
    w0 = item.offsetWidth || 1;
  var ov = el("div", "lbx", document.body),
    card = el("div", "lb-card", ov);
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-modal", "true");
  if (img) {
    card.classList.add("lb-photo");
    var im = el("img", "", card),
      capEl = item.querySelector(":scope > div:not(.tape),:scope > figcaption");
    im.src = img.currentSrc || img.src;
    im.alt = img.alt;
    var cap = capEl ? capEl.textContent.trim() : img.alt.split(" — ")[0];
    if (cap) el("div", "lb-cap", card).textContent = cap;
    ov.setAttribute("aria-label", cap || "Photo");
  } else {
    card.className =
      "lb-card lb-note " + item.className.replace(/\b(lbable|hov)\b/g, "");
    Array.prototype.forEach.call(item.children, function (c) {
      if (!c.classList.contains("tape")) card.appendChild(c.cloneNode(true));
    });
    ov.setAttribute("aria-label", "Note");
  }
  item.querySelectorAll(".tape").forEach(function (t) {
    var n = el("div", "tape", card);
    n.style.cssText =
      "left:" +
      ((100 * t.offsetLeft) / w0).toFixed(1) +
      "%;width:" +
      ((100 * t.offsetWidth) / w0).toFixed(1) +
      "%;max-width:220px;min-width:80px;top:-17px;rotate:" +
      (t.style.rotate || "0deg");
  });
  var x = el("button", "lb-x", card);
  x.type = "button";
  x.setAttribute("aria-label", "Close");
  x.textContent = "×";
  card.style.rotate =
    ((parseFloat(item.style.rotate) || 0) * 0.6).toFixed(2) + "deg";
  // start exactly over the original, then settle in the middle
  var f = card.getBoundingClientRect();
  card.style.transition = "none";
  card.style.transform =
    "translate(" +
    (r.left - f.left) +
    "px," +
    (r.top - f.top) +
    "px) scale(" +
    (r.width / f.width).toFixed(4) +
    ")";
  void card.offsetWidth;
  card.style.transition = "";
  requestAnimationFrame(function () {
    ov.classList.add("on");
    card.style.transform = "";
  });
  lb = { ov: ov, card: card, item: item, back: document.activeElement };
  ov.addEventListener("click", function (e) {
    if (e.target === ov || e.target === x) {
      closeLB();
      return;
    }
    var a = e.target.closest("a[href]");
    if (a && parse(new URL(a.href, location.href).pathname)) {
      e.preventDefault();
      closeLB();
      navigate(new URL(a.href).pathname, { jump: true });
    }
  });
  x.focus({ preventScroll: true });
}
function closeLB() {
  var o = lb;
  if (!o) return;
  lb = null;
  var f = o.card.getBoundingClientRect(),
    r = o.item.getBoundingClientRect();
  o.ov.classList.remove("on");
  o.card.style.transform =
    "translate(" +
    (r.left - f.left) +
    "px," +
    (r.top - f.top) +
    "px) scale(" +
    (r.width / f.width).toFixed(4) +
    ")";
  o.card.style.opacity = "0";
  setTimeout(function () {
    o.ov.remove();
  }, 450);
  if (o.back && o.back.isConnected) o.back.focus({ preventScroll: true });
}
document.addEventListener("keydown", function (e) {
  if (!lb) return;
  if (e.key === "Escape") {
    e.preventDefault();
    closeLB();
  } else if (e.key === "Tab") {
    e.preventDefault();
    lb.ov.querySelector(".lb-x").focus();
  }
});

// ---- the letter: sent to the Web3Forms inbox; without a key it falls back to email ----
function val(f, n) {
  var e = f.elements[n];
  return e && e.value ? e.value.trim() : "";
}
function mailto(d) {
  var body =
    d.message +
    "\n\n— " +
    d.name +
    (d.business ? ", " + d.business : "") +
    "\n" +
    d.email +
    (d.phone ? "\n" + d.phone : "") +
    "\nHelp with: " +
    d.service;
  return (
    "mailto:Jeremymironov@gmail.com?subject=" +
    encodeURIComponent("Consultation request — " + d.name) +
    "&body=" +
    encodeURIComponent(body)
  );
}
function sendNote(f) {
  var err = f.querySelector(".err"),
    btn = f.querySelector("[type=submit]"),
    key = f.getAttribute("data-key") || "";
  var d = {
    name: val(f, "name"),
    business: val(f, "business"),
    email: val(f, "email"),
    phone: val(f, "phone"),
    message: val(f, "message"),
    service:
      Array.prototype.filter
        .call(f.querySelectorAll("[name=service]"), function (c) {
          return c.checked;
        })
        .map(function (c) {
          return c.value;
        })
        .join(", ") || "Not specified",
  };
  var miss = !d.name
    ? ["name", "Add your name so I know who to write back to."]
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)
      ? ["email", "That email doesn't look right — I need it to reply."]
      : d.message.length < 10
        ? [
            "message",
            "Tell me a little about the project — a sentence or two is plenty.",
          ]
        : null;
  err.textContent = "";
  if (miss) {
    err.textContent = miss[1];
    f.elements[miss[0]].focus({ preventScroll: true });
    return;
  }
  if (f.elements.botcheck.checked) return;
  btn.disabled = true;
  btn.textContent = "Sending…";
  (key
    ? fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          Object.assign(
            {
              access_key: key,
              subject: "New letter from jmironovstudio.com",
              from_name: "JMironov Studio website",
              botcheck: false,
            },
            d,
          ),
        ),
      }).then(function (r) {
        return r
          .json()
          .catch(function () {
            return {};
          })
          .then(function (j) {
            if (!r.ok || !j.success) throw new Error("fail");
          });
      })
    : Promise.reject(new Error("nokey"))
  )
    .then(
      function () {
        objEl("envelope").classList.add("sealed");
        (window.dataLayer = window.dataLayer || []).push({
          event: "generate_lead",
          form_name: "contact_letter",
          service: d.service,
        });
      },
      function (x) {
        err.textContent =
          x.message === "nokey"
            ? "This copy of the site can't send letters. "
            : "Couldn't send it just now. ";
        var a = el("a", "sk-link", err);
        a.href = mailto(d);
        a.textContent = "Send it by email instead ✉";
      },
    )
    .then(function () {
      btn.disabled = false;
      btn.textContent = "Send message ✈";
    });
}
function typing(e) {
  var t = e.target;
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
}

root.addEventListener("submit", function (e) {
  if (!e.target.classList.contains("letter")) return;
  e.preventDefault();
  sendNote(e.target);
});
// Inside these tilted 3D pages Chrome can aim the pointer at the wrong element: a
// rotated sticker or tab loses to its own parent at random spots. elementsFromPoint
// still lists the right one first, so clicks and hover are resolved through it.
var HOT = "a[href],button,label,input,textarea,.lbable",
  hov = null,
  hovAt = null,
  hovRaf = 0;
function under(x, y) {
  var l = document.elementsFromPoint(x, y);
  return l.length ? l[0] : null;
}
function setHov(h) {
  if (h === hov) return;
  if (hov) hov.classList.remove("hov");
  hov = h;
  if (h) h.classList.add("hov");
  root.style.cursor = !h
    ? ""
    : h.classList.contains("lbable")
      ? "zoom-in"
      : h.matches("input,textarea")
        ? "text"
        : "pointer";
}
root.addEventListener("pointermove", function (e) {
  if (e.pointerType !== "mouse") return;
  hovAt = [e.clientX, e.clientY];
  if (!hovRaf)
    hovRaf = requestAnimationFrame(function () {
      hovRaf = 0;
      var t = under(hovAt[0], hovAt[1]),
        h = t && t.closest(HOT);
      setHov(h && root.contains(h) && !h.closest(".fly") ? h : null);
    });
});
root.addEventListener("pointerleave", function () {
  setHov(null);
});
root.addEventListener("click", function (e) {
  // a mouse click goes to what is really under the pointer; keys keep their target
  var t =
    (e.isTrusted && e.detail > 0 && under(e.clientX, e.clientY)) || e.target;
  if (!root.contains(t)) t = e.target;
  var hot = t.closest("a[href],label,input,textarea,button"),
    l = t.closest(".lbable");
  if (l && !(hot && l.contains(hot))) {
    e.preventDefault();
    openLB(l);
    return;
  }
  var st = t.closest("[data-step]");
  if (st) {
    e.preventDefault();
    step(+st.getAttribute("data-step"));
    return;
  }
  if (t.closest('[data-env="again"]')) {
    e.preventDefault();
    var lt = objEl("envelope").querySelector("form.letter");
    lt.reset();
    lt.querySelector(".err").textContent = "";
    objEl("envelope").classList.remove("sealed");
    return;
  }
  var g = t.closest("[data-go]");
  if (g) {
    e.preventDefault();
    navigate(SECS[+g.getAttribute("data-go")], { jump: true });
    return;
  }
  var n = t.closest("[data-nav]");
  if (n) {
    e.preventDefault();
    nb.turn(n.getAttribute("data-nav"));
    return;
  }
  // links to the site stay on the desk; data-keep goes back to where that object was left
  var a = t.closest("a[href]");
  if (
    a &&
    !a.target &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.shiftKey &&
    !e.altKey &&
    !e.button
  ) {
    var u = new URL(a.href, location.href),
      r = u.origin === location.origin && parse(u.pathname);
    if (r) {
      e.preventDefault();
      navigate(r.path, { jump: !a.hasAttribute("data-keep") });
      return;
    }
  }
  // the browser picked a parent: pass the click on to the link, field or button really under it
  if (hot && !hot.contains(e.target)) {
    e.preventDefault();
    if (hot.matches("input:not([type=checkbox]),textarea"))
      hot.focus({ preventScroll: true });
    else hot.click();
  }
});
root.addEventListener(
  "wheel",
  function (e) {
    var now = Date.now();
    if (
      lb ||
      Math.abs(e.deltaY) < 4 ||
      now - wheelT < 420 ||
      e.target.closest("textarea")
    )
      return;
    wheelT = now;
    step(e.deltaY > 0 ? 1 : -1);
  },
  { passive: true },
);
root.addEventListener("keydown", function (e) {
  var k = e.key;
  if (lb || typing(e)) return;
  if ((k === "Enter" || k === " ") && e.target.classList.contains("lbable")) {
    e.preventDefault();
    openLB(e.target);
  } else if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown") {
    e.preventDefault();
    step(1);
  } else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp") {
    e.preventDefault();
    step(-1);
  }
});
root.addEventListener(
  "touchstart",
  function (e) {
    var t = e.touches[0];
    touch = t && !typing(e) ? { x: t.clientX, y: t.clientY } : null;
  },
  { passive: true },
);
root.addEventListener("touchend", function (e) {
  var t = e.changedTouches[0];
  if (!touch || !t) return;
  var dx = t.clientX - touch.x,
    dy = t.clientY - touch.y;
  touch = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
  step((Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0) ? 1 : -1);
});
window.addEventListener("resize", layout);
window.addEventListener("popstate", function () {
  var r = parse(location.pathname);
  if (r) apply(r);
});

layout();
// an address the desk doesn't know (the 404 page) opens the sketchbook with a note on it
var start = parse(location.pathname);
apply(start || parse("/"), { init: true });
if (!start) root.classList.add("lost");
ready = true;
root.classList.add("ready");
// pages were cut with whatever fonts had arrived: cut them again once all are in
if (document.fonts && document.fonts.status !== "loaded")
  document.fonts.ready.then(pages);
root.focus({ preventScroll: true });
window.desk = {
  go: navigate,
  state: function () {
    var b = {};
    for (var n in books) b[n] = books[n].state();
    return {
      open: cur,
      path: here(),
      mode: mob ? "mobile" : "desktop",
      notebook: nb.state(),
      books: b,
    };
  },
};
