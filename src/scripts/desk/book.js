// Paper books on the desk: the blog magazine, the project folder and the résumé.
// Pages come from <template>s inside the book: whole pages as they are, and long pieces
// (an article, a case study) poured into page-sized columns and cut into as many pages
// as they fill. The desk shows a spread, a phone one page. Every turn is the same sheet
// going over the spine; a jump riffles a few of them, one after the other.
//
//   template[data-page]   a whole page
//   template[data-flow]   a piece to paginate (data-flow names the flow class)
//   template[data-shell]  the page a flow is poured into: %flow% marks the spot
//   template[data-filler] a page that keeps every piece starting on a left-hand page
// data-owner is the address a page belongs to; data-mode="dk"/"mb" keeps a page to the
// desk or the phone. %n% is the page number, %kick% and %title% come from the flow, and
// any [data-pn="/address"] is filled with the page that address starts on.
import { el, esc, ease, markLB, reduce } from "./util.js";

var SHEETS = 3,
  GAP = 40;

// onOwner(address) hears where the book was turned to.
export function createBook(box, host, onOwner) {
  var tpls = Array.prototype.slice.call(
    box.querySelectorAll(":scope > template"),
  );
  var shell = box.querySelector(":scope > template[data-shell]"),
    filler = box.querySelector(":scope > template[data-filler]");
  var pageL = box.querySelector(".bk-l"),
    pageR = box.querySelector(".bk-r"),
    num = box.querySelector(".bk-num");
  var mob = false,
    pages = [],
    starts = {},
    at = 0,
    goal = 0,
    busy = false,
    raf = 0,
    fw = 0,
    fh = 0,
    sheets = [];
  for (var i = 0; i < SHEETS; i++) sheets.push(makeSheet());

  function makeSheet() {
    var s = el("div", "bk-sheet", box);
    s.inert = true;
    s.setAttribute("aria-hidden", "true");
    s.innerHTML =
      '<div class="bk-face bk-front"><div class="bk-in"></div><i class="bk-shade"></i></div><div class="bk-face bk-back"><div class="bk-in"></div><i class="bk-shade"></i></div>';
    return { el: s, f: s.firstChild, b: s.lastChild };
  }
  function fillIn(h, map) {
    return h.replace(/%(\w+)%/g, function (m, k) {
      return k in map ? map[k] : m;
    });
  }
  function flowCSS(k) {
    return (
      "width:" +
      fw +
      "px;height:" +
      fh +
      "px;column-width:" +
      fw +
      "px;column-gap:" +
      GAP +
      "px;transform:translateX(" +
      -k * (fw + GAP) +
      "px)"
    );
  }

  // A copy of the book off screen, untransformed, with one empty flow page in it: the
  // flow box gives the column size, and where a piece ends gives its page count.
  function measurer() {
    var m = box.cloneNode(false);
    m.removeAttribute("id");
    m.style.cssText =
      "position:absolute;left:-12000px;top:0;visibility:hidden;pointer-events:none;transform:none;rotate:none";
    var pg = el("div", "bk-page bk-r", m);
    host.appendChild(m);
    pg.innerHTML = fillIn(shell.innerHTML, {
      n: "",
      kick: "",
      title: "",
      owner: "",
      flow: "",
    });
    var fb = pg.querySelector(".flowbox"),
      f = el("div", "flow", fb);
    fw = fb.clientWidth;
    fh = fb.clientHeight;
    function measure(t) {
      f.className = "flow " + (t.getAttribute("data-flow") || "");
      f.style.cssText = flowCSS(0);
      f.innerHTML = t.innerHTML + '<div class="fend"></div>';
      var a = f.getBoundingClientRect().left,
        b = f.lastChild.getBoundingClientRect().left;
      return Math.max(1, Math.floor((b - a) / (fw + GAP) + 0.02) + 1);
    }
    measure.done = function () {
      m.remove();
    };
    return measure;
  }

  function count() {
    return mob ? pages.length : pages.length / 2;
  }
  function li(s) {
    return mob ? -1 : 2 * s;
  }
  function ri(s) {
    return mob ? s : 2 * s + 1;
  }
  function ownerOf(s) {
    var P = pages[mob ? s : 2 * s];
    return P ? P.owner : "";
  }
  function spreadOf(owner) {
    var i = starts[owner] || 0;
    return mob ? i : i >> 1;
  }
  function lastOf(owner) {
    for (var i = pages.length - 1; i >= 0; i--)
      if (pages[i].owner === owner) return mob ? i : i >> 1;
    return 0;
  }

  // Lay the pages out for the desk or the phone; the open piece stays open, on the
  // same page of it as far as it still has one.
  function build(m) {
    stop();
    var keep = pages.length ? ownerOf(goal) : "",
      off = keep ? goal - spreadOf(keep) : 0,
      meas = null;
    mob = m;
    pages = [];
    starts = {};
    function pad(next) {
      pages.push({
        owner: pages.length ? pages[pages.length - 1].owner : "",
        fill: true,
        next: next,
      });
    }
    tpls.forEach(function (t) {
      var mode = t.getAttribute("data-mode"),
        flow = t.hasAttribute("data-flow"),
        owner = t.getAttribute("data-owner");
      if (!flow && !t.hasAttribute("data-page")) return;
      if (mode && mode !== (mob ? "mb" : "dk")) return;
      if (flow && !mob && pages.length % 2) pad(t);
      if (!(owner in starts)) starts[owner] = pages.length;
      if (!flow) {
        pages.push({ owner: owner, t: t });
        return;
      }
      if (!meas) meas = measurer();
      for (var k = 0, n = meas(t); k < n; k++)
        pages.push({ owner: owner, t: t, k: k });
    });
    if (!mob && pages.length % 2) pad(null);
    if (meas) meas.done();
    at = goal =
      keep in starts ? Math.min(spreadOf(keep) + off, lastOf(keep)) : 0;
    pageL._i = pageR._i = null;
    render();
  }

  function pageHTML(i) {
    var P = pages[i];
    if (!P) return "";
    var map = { n: i + 1, owner: P.owner };
    if (P.fill) {
      var d = el("div");
      d.innerHTML = fillIn(filler.innerHTML, map);
      var nx = d.querySelector(".fl-next");
      if (nx && P.next) {
        nx.querySelector("a").href = P.next.getAttribute("data-owner");
        nx.querySelector(".fl-title").textContent =
          P.next.getAttribute("data-title") || "";
      } else if (nx) nx.remove();
      return d.innerHTML;
    }
    if (P.k == null) return fillIn(P.t.innerHTML, map);
    map.kick = esc(P.t.getAttribute("data-kick") || "");
    map.title = esc(P.t.getAttribute("data-title") || "");
    map.flow =
      '<div class="flow ' +
      (P.t.getAttribute("data-flow") || "") +
      '" style="' +
      flowCSS(P.k) +
      '">' +
      P.t.innerHTML +
      "</div>";
    return fillIn(shell.innerHTML, map);
  }
  function numbers(c) {
    c.querySelectorAll("[data-pn]").forEach(function (e) {
      var s = starts[e.getAttribute("data-pn")];
      e.textContent = s == null ? "" : s + 1;
    });
  }
  // the columns either side of a page are only clipped: keep focus out of them
  function clipFocus(c) {
    var fb = c.querySelector(".flowbox");
    if (!fb) return;
    var r = fb.getBoundingClientRect();
    fb.querySelectorAll("a[href],button,.lbable").forEach(function (e) {
      var q = e.getBoundingClientRect(),
        x = (q.left + q.right) / 2,
        y = (q.top + q.bottom) / 2;
      if (x > r.left && x < r.right && y > r.top && y < r.bottom) return;
      e.tabIndex = -1;
      e.setAttribute("aria-hidden", "true");
    });
  }
  function put(c, i) {
    if (c._i === i) return;
    c._i = i;
    c.innerHTML = pageHTML(i);
    c.classList.toggle("blank", !pages[i]);
    numbers(c);
    markLB(c, true);
    clipFocus(c);
  }
  function face(f, i) {
    f.firstChild.innerHTML = pageHTML(i);
    f.classList.toggle("blank", !pages[i]);
    numbers(f);
  }
  function status() {
    var n = count();
    box.classList.toggle("bk-first", goal === 0);
    box.classList.toggle("bk-last", goal >= n - 1);
    box.classList.toggle("bk-one", n <= 1);
    if (num)
      num.textContent = mob
        ? goal + 1 + " / " + n
        : 2 * goal + 1 + "–" + (2 * goal + 2) + " / " + pages.length;
  }
  function render() {
    if (!mob) put(pageL, li(at));
    else put(pageL, -1);
    put(pageR, ri(at));
    status();
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    busy = false;
    at = goal;
    sheets.forEach(function (S) {
      S.el.classList.remove("go");
    });
  }
  // Turn to spread `to`. o.instant skips the animation; o.delay holds it back.
  function turn(to, o) {
    o = o || {};
    to = Math.max(0, Math.min(count() - 1, to));
    var moved = to !== goal;
    goal = to;
    status();
    if (moved && onOwner) onOwner(ownerOf(to));
    // a turn under way carries on to the new goal once it lands
    if (busy) return;
    if (to === at) return;
    if (o.instant) {
      at = to;
      render();
      return;
    }
    flip(at, to, o.delay || 0);
  }
  function flip(from, to, delay) {
    busy = true;
    var fwd = to > from,
      d = Math.abs(to - from),
      k = Math.min(SHEETS, d),
      dur = reduce ? 260 : 900,
      stag = reduce ? 0 : 150,
      run = [];
    for (var i = 0; i < k; i++) {
      var j = k > 1 ? Math.round((i * (d - 1)) / (k - 1)) : 0,
        s = fwd ? from + j : from - 1 - j,
        S = sheets[i];
      face(S.f, ri(s));
      face(S.b, li(s + 1));
      run.push({ S: S, a: fwd ? 0 : 180, b: fwd ? 180 : 0, t: i * stag });
    }
    // what each lifted sheet uncovers is already lying underneath
    if (fwd) put(pageR, ri(to));
    else put(pageL, li(to));
    var t0 = performance.now() + delay;
    function pose(now) {
      var done = true;
      run.forEach(function (r, i) {
        var u = Math.min(1, Math.max(0, (now - t0 - r.t) / dur)),
          th = r.a + (r.b - r.a) * ease(u),
          sh = (0.36 * Math.sin((th * Math.PI) / 180)).toFixed(3);
        if (u < 1) done = false;
        r.S.el.style.transform = "rotateY(" + (-th).toFixed(2) + "deg)";
        // the sheet standing up most is nearest the eye; flat ones keep their stacking
        r.S.el.style.zIndex =
          10 +
          Math.round((90 - Math.abs(th - 90)) * 10) +
          (th > 90 ? i : k - i);
        r.S.f.lastChild.style.opacity = sh;
        r.S.b.lastChild.style.opacity = sh;
      });
      return done;
    }
    pose(t0);
    run.forEach(function (r) {
      r.S.el.classList.add("go");
    });
    function frame(now) {
      raf = 0;
      if (!pose(now)) {
        raf = requestAnimationFrame(frame);
        return;
      }
      run.forEach(function (r) {
        r.S.el.classList.remove("go");
      });
      busy = false;
      at = to;
      render();
      if (goal !== at) flip(at, goal, 0);
    }
    raf = requestAnimationFrame(frame);
  }

  return {
    build: build,
    // Open the pages of an address; unless o.jump, any page of it already open will do.
    open: function (owner, o) {
      o = o || {};
      if (!(owner in starts)) return;
      if (!o.jump && ownerOf(goal) === owner) return;
      turn(spreadOf(owner), o);
    },
    step: function (d) {
      turn(goal + d);
    },
    owner: function () {
      return ownerOf(goal);
    },
    state: function () {
      return {
        at: at,
        goal: goal,
        spreads: count(),
        pages: pages.length,
        busy: busy,
        owner: ownerOf(goal),
      };
    },
  };
}
