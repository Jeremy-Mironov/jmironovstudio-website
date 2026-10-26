// The spiral sketchbook on the desk: the home page, services and pricing.
import { el, svg, n1, markLB, reduce, ease } from "./util.js";

var PI = Math.PI,
  DEG = 180 / PI,
  TABH = 60;

// Book space: origin on the binding axis (mid-spine of the spread, middle of the top
// edge of the pad), x right, y down, z up out of the paper. Pages lie in the plane of
// the axis, so every leaf turns about the wire and its holes stay on it.
var CFG = {
  // r: loop radius, e: paper between the page edge and the hole, hole: hole radius.
  // The wire rests against the spine side of each hole, so the opening shows beyond it.
  dk: {
    SW: 1600,
    SH: 1000,
    P: 2400,
    ox: 800,
    oy: 430,
    BX: 800,
    BY: 510,
    tilt: 22,
    W: 600,
    H: 720,
    r: 19,
    e: 6,
    pitch: 22,
    edge: 20,
    sig: 0,
    wire: 4.2,
    hole: 4.8,
    T: 10,
    LEAF: 0.5,
    ov: 6,
    strips: [270, 180, 150],
    bend: [15, 21],
    SEC: [0, 1, 2],
    light: [-0.4, 1],
    shadow: [0.34, 0.5],
  },
  mb: {
    SW: 390,
    SH: 844,
    P: 1900,
    ox: 195,
    oy: 400,
    BX: 195,
    BY: 56,
    tilt: 10,
    W: 352,
    H: 650,
    r: 12,
    e: 4,
    pitch: 16,
    edge: 12,
    sig: 8,
    wire: 2.8,
    hole: 3.3,
    T: 6,
    LEAF: 0.4,
    ov: 5,
    strips: [280, 200, 170],
    bend: [13, 18],
    SEC: [0, 2, 3],
    light: [-0.45, 1],
    shadow: [0.28, 0.5],
  },
};
// Leaves of the spread (front, back) and pages of the pad. Projects, the blog, the
// résumé and contact are the other objects on the desk.
var DK_FACES = [
  ["d0f", "d0b"],
  ["d1f", "d1b"],
  ["d2f", "d2b"],
  ["d3b", "d4b"],
  ["dnext", ""],
];
var MB_FACES = ["m0", "m1", "m2", "m3", "m4", "m5", "m9", "m8", "m13", "mnext"];
export var TABS = ["Home", "Services", "Pricing"];

// onSection(k) is told whenever the pages turned put another tab on top.
export function createNotebook(root, world, onSection) {
  var src = document.getElementById("src"),
    mtpl = document.getElementById("mfaces");
  var G = null,
    leaves = [],
    layers = [],
    p = 0,
    raf = 0,
    sec = -1;

  function geo(mob) {
    var g = Object.assign({}, CFG[mob ? "mb" : "dk"]);
    g.mob = mob;
    g.a = g.r - g.e - g.wire / 2;
    g.Z0 = g.T + 3;
    g.N = mob ? MB_FACES.length : DK_FACES.length;
    g.hd = g.hole - g.wire / 2; // hole centre sits this much further out than the wire
    g.hu = g.r + g.hd - g.a; // page edge to hole centre
    g.off = [0, g.strips[0], g.strips[0] + g.strips[1]];
    g.n = Math.floor(((mob ? g.W : g.H) - 2 * g.edge) / g.pitch + 1e-6) + 1;
    g.s0 = (-(g.n - 1) * g.pitch) / 2;
    var t = g.tilt / DEG;
    g.ct = Math.cos(t);
    g.st = Math.sin(t);
    // the eye, taken back into book space, decides which side of a turning leaf faces it
    var Y = g.oy - g.BY,
      Z = g.P,
      ey = Y * g.ct + Z * g.st,
      ez = -Y * g.st + Z * g.ct - g.Z0;
    g.psi = Math.atan2(ez, mob ? ey : g.ox - g.BX);
    g.tf =
      "translate3d(" +
      g.BX +
      "px," +
      g.BY +
      "px,0) rotateX(" +
      g.tilt +
      "deg) translateZ(" +
      g.Z0 +
      "px)";
    return g;
  }
  // Same projection the CSS applies to every .ctx: translateZ(Z0), rotateX(tilt), perspective.
  function proj(x, y, z) {
    var z1 = z + G.Z0,
      Y = y * G.ct - z1 * G.st,
      Z = y * G.st + z1 * G.ct,
      q = G.P / (G.P - Z);
    return [G.ox + (x + G.BX - G.ox) * q, G.oy + (Y + G.BY - G.oy) * q];
  }
  // Loop k of the wire at angle f around the axis: 0 is the hole in the unturned stack,
  // PI the hole in the turned one. The visible half advances by sig (0 keeps the spread
  // level), the hidden half takes the rest of the pitch.
  function ringPt(k, f) {
    var s = G.s0 + G.pitch * k;
    if (f < 0) s += ((G.pitch - G.sig) * f) / PI;
    else if (f <= PI) s += (G.sig * f) / PI;
    else s += G.sig + ((G.pitch - G.sig) * (f - PI)) / PI;
    var c = G.r * Math.cos(f),
      z = G.r * Math.sin(f);
    return G.mob ? [s, c, z] : [c, s, z];
  }
  function arcs(fa, fb) {
    if (fb - fa < 1e-4) return "";
    var steps = Math.max(2, Math.ceil((22 * (fb - fa)) / PI)),
      d = "";
    for (var k = 0; k < G.n; k++)
      for (var j = 0; j <= steps; j++) {
        var q = ringPt(k, fa + ((fb - fa) * j) / steps),
          a = proj(q[0], q[1], q[2]);
        d += (j ? "L" : "M") + n1(a[0]) + " " + n1(a[1]);
      }
    return d;
  }

  function ctx(z) {
    var c = el("div", "ctx", world);
    c.style.transform = G.tf;
    c.style.zIndex = z;
    return c;
  }
  function pl(parent, cls, x, y, w, h, tf, html) {
    var e = el("div", "pl " + cls, parent);
    e.style.cssText =
      "left:" +
      x +
      "px;top:" +
      y +
      "px;width:" +
      w +
      "px;height:" +
      h +
      "px;transform:" +
      (tf || "none");
    if (html) e.innerHTML = html;
    return e;
  }
  function tz(z, more) {
    return "translateZ(" + z + "px)" + (more ? " " + more : "");
  }

  // A punched hole as seen from the camera side: dark shaft, lit far wall, bright rim.
  function holeTile() {
    var R = G.hole,
      w = G.mob ? G.pitch : 2 * G.hu,
      h = G.mob ? 2 * G.hu : G.pitch,
      cx = w / 2,
      cy = h / 2;
    var s =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      w +
      '" height="' +
      h +
      '" viewBox="0 0 ' +
      w +
      " " +
      h +
      '">' +
      '<defs><radialGradient id="g" cx="50%" cy="64%" r="60%"><stop offset="0" stop-color="#050403"/><stop offset=".6" stop-color="#140f0a"/><stop offset="1" stop-color="#3b2f22"/></radialGradient>' +
      '<clipPath id="c"><circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      R +
      '"/></clipPath></defs>' +
      '<circle cx="' +
      cx +
      '" cy="' +
      n1(cy + R * 0.22) +
      '" r="' +
      n1(R * 1.3) +
      '" fill="rgba(105,80,45,.15)"/>' +
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      R +
      '" fill="url(#g)"/>' +
      '<ellipse cx="' +
      cx +
      '" cy="' +
      n1(cy - R * 0.76) +
      '" rx="' +
      n1(R * 0.92) +
      '" ry="' +
      n1(R * 0.46) +
      '" fill="rgba(226,212,184,.5)" clip-path="url(#c)"/>' +
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      n1(R + 0.3) +
      '" fill="none" stroke="rgba(255,255,255,.75)" stroke-width=".7"/></svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")';
  }

  function baseDesk(b) {
    var a = G.a,
      W = G.W,
      H = G.H,
      T = G.T,
      ov = G.ov,
      hh = H / 2,
      zc = -T - 0.6;
    pl(
      b,
      "bsh",
      -a - W - ov,
      -hh - ov,
      2 * (a + W + ov),
      H + 2 * ov,
      tz(zc - 2.4),
    );
    pl(b, "gapf", -a - 3, -hh - ov, 2 * a + 6, H + 2 * ov, tz(zc - 1));
    pl(b, "cov kraft", -a - W - ov, -hh - ov, W + ov + 1, H + 2 * ov, tz(zc));
    pl(b, "cov dark", a - 1, -hh - ov, W + ov + 1, H + 2 * ov, tz(zc));
    pl(
      b,
      "bedge",
      -a - W - ov,
      hh + ov,
      W + ov + 1,
      2.4,
      tz(zc, "rotateX(-90deg)"),
    );
    pl(b, "bedge", a - 1, hh + ov, W + ov + 1, 2.4, tz(zc, "rotateX(-90deg)"));
    [a, -a - W].forEach(function (x0) {
      pl(b, "pedge-x", x0, hh, W, T, "rotateX(-90deg)");
      pl(b, "pedge-y", x0, -hh, T, H, "rotateY(90deg)");
      pl(b, "pedge-y", x0 + W, -hh, T, H, "rotateY(90deg)");
    });
    var cv = src.querySelector('[data-face="cover"]');
    markLB(
      pl(
        b,
        "sheet kraft back",
        -a - W,
        -hh,
        W,
        H,
        tz(-0.3),
        '<div class="holes"></div>' + (cv ? cv.innerHTML : ""),
      ),
      true,
    );
  }
  function baseMob(b) {
    var a = G.a,
      W = G.W,
      H = G.H,
      T = G.T,
      ov = G.ov,
      hw = W / 2,
      zc = -T - 0.6,
      sg = G.sig;
    pl(b, "bsh", -hw - ov, a - 2, W + 2 * ov, H + ov + 2, tz(zc - 2.4));
    pl(b, "gapf", -hw - ov, -a - 3, W + 2 * ov + sg, 2 * a + 6, tz(zc - 1));
    pl(
      b,
      "cov kraft",
      -hw - ov + sg,
      -a - H - ov,
      W + 2 * ov,
      H + ov + 1,
      tz(zc),
    );
    pl(b, "cov dark", -hw - ov, a - 1, W + 2 * ov, H + ov + 1, tz(zc));
    pl(
      b,
      "bedge",
      -hw - ov,
      a + H + ov,
      W + 2 * ov,
      2.4,
      tz(zc, "rotateX(-90deg)"),
    );
    pl(b, "pedge-x", -hw, a + H, W, T, "rotateX(-90deg)");
    pl(b, "pedge-y", -hw, a, T, H, "rotateY(90deg)");
    pl(b, "pedge-y", hw, a, T, H, "rotateY(90deg)");
    pl(
      b,
      "sheet kraft back",
      -hw + sg,
      -a - H,
      W,
      H,
      tz(-0.3),
      '<div class="holes"></div>',
    );
    TABS.forEach(function (t, k) {
      var e = pl(b, "", -hw + 6 + k * 70, a + H - 14, 62, 50, tz(-T * 0.45));
      e.innerHTML =
        '<button class="mtab t' +
        k +
        '" data-go="' +
        k +
        '" style="position:static"><span>' +
        t +
        "</span></button>";
      e.firstChild.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%";
    });
  }

  function srcFace(id) {
    var f =
      id &&
      (G.mob ? mtpl.content : src).querySelector('[data-face="' + id + '"]');
    return f ? f.innerHTML.trim() : "";
  }
  // Page furniture comes from the leaf's place in the book, not from the face: section
  // tabs, page numbers, back/next, the dog-ear and the title showing through the back.
  function faceHTML(i, back) {
    var h,
      last = i === G.N - 1,
      sec = G.SEC.indexOf(i);
    if (G.mob) {
      h =
        srcFace(MB_FACES[i]) +
        '<div class="pnum">' +
        (i + 1) +
        " / " +
        G.N +
        "</div>";
      if (i > 0)
        h += '<button class="sk-btn nav-l" data-nav="prev">← back</button>';
      return (
        h +
        (last
          ? '<button class="sk-btn nav-r" data-nav="home">↺ start over</button>'
          : '<button class="sk-btn nav-r" data-nav="next">next ↑</button>')
      );
    }
    h = srcFace(DK_FACES[i][back ? 1 : 0]);
    if (!h) return "";
    if (sec >= 0) {
      var left = 34 + 156 * sec,
        rot = [-1.5, 1, -0.8][sec];
      h =
        '<button class="tab t' +
        sec +
        '" data-go="' +
        sec +
        '" style="left: ' +
        (back ? G.W - 98 - left : left) +
        "px; rotate: " +
        (back ? -rot : rot) +
        'deg"><span>' +
        TABS[sec] +
        "</span></button>" +
        h;
    }
    if (back) {
      var t = /<h[12][^>]*>([\s\S]*?)<\/h[12]>/.exec(srcFace(DK_FACES[i][0]));
      if (t)
        h = '<div class="ghost">' + t[1].replace(/<[^>]+>/g, "") + "</div>" + h;
      return (
        h +
        '<div class="pnum">— ' +
        (2 * i + 2) +
        ' —</div><button class="sk-btn nav-l" data-nav="prev">← back</button>'
      );
    }
    return (
      h +
      '<div class="pnum">— ' +
      (2 * i + 1) +
      " —</div>" +
      (last
        ? '<button class="sk-btn nav-r" data-nav="home">↺ start over</button>'
        : '<button class="sk-btn nav-r" data-nav="next">next →</button>') +
      '<div class="dog"></div>'
    );
  }
  // While a leaf turns it is three hinged strips, each showing its slice of both faces
  // through a clipping window, so it can curl. At rest it is one whole page instead:
  // a single copy to hover, click and type into.
  function makeLeaf(i) {
    var L = {
      i: i,
      th: i < p ? PI : 0,
      c: 0,
      dir: 1,
      anim: null,
      key: "",
      cls: "",
      cast: -1,
    };
    var fr = faceHTML(i, false),
      bk = G.mob ? "" : faceHTML(i, true);
    L.tabbed = /class="tab /.test(fr + bk);
    L.ctx = ctx(10);
    L.el = el("div", "leaf", L.ctx);
    L.st = [];
    L.shd = [];
    var chrome = '<div class="gut"></div><div class="holes"></div>';
    for (var k = 0; k < 4; k++) {
      var whole = k === 3,
        w = whole ? (G.mob ? G.H : G.W) : G.strips[k],
        off = whole ? 0 : G.off[k];
      var s = el("div", "strip " + (whole ? "whole" : "part"), L.el);
      var wf = el("div", "win fr", s),
        wb = el("div", "win bk", s),
        pf,
        pb;
      if (G.mob) {
        wf.style.cssText = wb.style.cssText =
          "left:0;top:-1px;width:" + G.W + "px;height:" + (w + 2) + "px";
        pf = "left:0;top:" + (1 - off) + "px";
        pb = "left:0;top:" + (off + w - G.H + 1) + "px";
      } else {
        wf.style.cssText = wb.style.cssText =
          "left:-1px;top:" +
          -TABH +
          "px;width:" +
          (w + 2) +
          "px;height:" +
          (G.H + TABH) +
          "px";
        pf = "top:" + TABH + "px;left:" + (1 - off) + "px";
        pb = "top:" + TABH + "px;left:" + (off + w - G.W + 1) + "px";
      }
      wf.innerHTML =
        '<div class="pc front" style="' +
        pf +
        '">' +
        chrome +
        fr +
        '<div class="cast"></div></div><div class="shd"></div>';
      wb.innerHTML =
        '<div class="pc back" style="' +
        pb +
        '">' +
        chrome +
        bk +
        '<div class="cast"></div></div><div class="shd"></div>';
      if (whole) {
        s.style.transform =
          (G.mob ? "translateY(" : "translateX(") + G.a + "px)";
        L.whole = s;
        markLB(s, true);
      } else {
        [wf, wb].forEach(function (w) {
          w.setAttribute("aria-hidden", "true");
          w.querySelectorAll("a,button,input,textarea").forEach(function (e) {
            e.tabIndex = -1;
          });
        });
        L.st.push(s);
        L.shd.push([wf.lastChild, wb.lastChild]);
      }
    }
    return L;
  }

  function wireLayer() {
    var s = svg(
        "svg",
        {
          class: "coil",
          width: G.SW,
          height: G.SH,
          viewBox: "0 0 " + G.SW + " " + G.SH,
          "aria-hidden": "true",
        },
        world,
      ),
      w = G.wire;
    var st = { fill: "none", "stroke-linejoin": "round" },
      o = { svg: s, key: "" };
    function path(extra) {
      return svg("path", Object.assign({}, st, extra), s);
    }
    o.o = path({ stroke: "#1b1f23", "stroke-width": w });
    o.b = path({ stroke: "#7c838b", "stroke-width": n1(w * 0.68) });
    o.l = path({
      stroke: "#c9ced4",
      "stroke-width": n1(w * 0.36),
      transform: "translate(" + n1(-0.13 * w) + " " + n1(-0.2 * w) + ")",
    });
    o.s = path({
      stroke: "#fbfdff",
      "stroke-width": n1(w * 0.15),
      opacity: 0.9,
      transform: "translate(" + n1(-0.18 * w) + " " + n1(-0.27 * w) + ")",
    });
    o.dm = [0.12, 0.22, 0.36].map(function () {
      return path({
        stroke: "#0a0806",
        "stroke-width": n1(w * 1.04),
        opacity: 0.2,
      });
    });
    return o;
  }
  // Shadow of the loops on the paper and the bit of wire seen going down into each hole.
  function coilBase() {
    var s = svg(
      "svg",
      {
        class: "coil",
        width: G.SW,
        height: G.SH,
        viewBox: "0 0 " + G.SW + " " + G.SH,
        "aria-hidden": "true",
      },
      world,
    );
    s.style.zIndex = 150;
    var sh = "",
      stub = "",
      clip = "",
      A = G.shadow,
      R = G.hole,
      w = G.wire,
      k,
      j;
    function add(d, pts) {
      pts.forEach(function (a, j) {
        d.v += (j ? "L" : "M") + n1(a[0]) + " " + n1(a[1]);
      });
    }
    for (k = 0; k < G.n; k++) {
      var run = [];
      for (j = 0; j <= 28; j++) {
        var q = ringPt(k, (PI * j) / 28),
          h = q[2],
          x = q[0] + A[0] * h,
          y = q[1] + A[1] * h;
        if (Math.abs(G.mob ? y : x) > G.a + 1) run.push(proj(x, y, 0));
        else {
          if (run.length > 1) {
            var d = { v: "" };
            add(d, run);
            sh += d.v;
          }
          run = [];
        }
      }
      if (run.length > 1) {
        var d2 = { v: "" };
        add(d2, run);
        sh += d2.v;
      }
      [
        [-0.85, 0],
        [PI, PI + 0.85],
      ].forEach(function (seg) {
        var pts = [];
        for (var i = 0; i <= 6; i++) {
          var q = ringPt(k, seg[0] + ((seg[1] - seg[0]) * i) / 6);
          pts.push(proj(q[0], q[1], q[2]));
        }
        var d = { v: "" };
        add(d, pts);
        stub += d.v;
      });
      [0, PI].forEach(function (f) {
        var c = ringPt(k, f),
          pts = [],
          o = (f ? -1 : 1) * G.hd;
        if (G.mob) c[1] += o;
        else c[0] += o;
        for (var i = 0; i < 18; i++) {
          var t = (2 * PI * i) / 18;
          pts.push(proj(c[0] + R * Math.cos(t), c[1] + R * Math.sin(t), 0));
        }
        var d = { v: "" };
        add(d, pts);
        clip += d.v + "Z";
      });
    }
    var defs = svg("defs", {}, s),
      fl = svg(
        "filter",
        { id: "cBlur", x: "-10%", y: "-10%", width: "120%", height: "120%" },
        defs,
      );
    svg("feGaussianBlur", { stdDeviation: G.mob ? 0.9 : 1.6 }, fl);
    svg("path", { d: clip }, svg("clipPath", { id: "cHoles" }, defs));
    svg(
      "path",
      {
        d: sh,
        fill: "none",
        stroke: "rgba(28,16,4,.34)",
        "stroke-width": n1(w * 1.15),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        filter: "url(#cBlur)",
      },
      s,
    );
    var g = svg("g", { "clip-path": "url(#cHoles)" }, s);
    svg(
      "path",
      { d: stub, fill: "none", stroke: "#090807", "stroke-width": w },
      g,
    );
    svg(
      "path",
      {
        d: stub,
        fill: "none",
        stroke: "#3a3e42",
        "stroke-width": n1(w * 0.55),
        transform: "translate(" + n1(-0.13 * w) + " " + n1(-0.2 * w) + ")",
      },
      g,
    );
  }
  function setArc(o, fa, fb, nearR, nearL) {
    var key = fa.toFixed(4) + "," + fb.toFixed(4) + nearR + nearL;
    if (o.key === key) return;
    o.key = key;
    var d = arcs(fa, fb);
    o.o.setAttribute("d", d);
    o.b.setAttribute("d", d);
    o.l.setAttribute("d", d);
    o.s.setAttribute("d", d);
    [0.12, 0.22, 0.36].forEach(function (len, i) {
      var dm = "";
      if (nearR && d) dm += arcs(fa, Math.min(fb, fa + len));
      if (nearL && d) dm += arcs(Math.max(fa, fb - len), fb);
      o.dm[i].setAttribute("d", dm);
    });
  }

  function place(L, zoff) {
    var th = L.th,
      c = L.c || 0,
      dir = L.dir || 1,
      key = th.toFixed(5) + "|" + zoff + "|" + c.toFixed(4) + "|" + dir;
    if (L.key === key) return;
    L.key = key;
    var b1 = c * G.bend[0] * dir,
      b2 = c * G.bend[1] * dir,
      s1;
    if (G.mob) {
      L.el.style.transform =
        "translate3d(" +
        (-G.W / 2 + (G.sig * th) / PI).toFixed(2) +
        "px,0," +
        zoff +
        "px) rotateX(" +
        (th * DEG).toFixed(3) +
        "deg)";
      L.st[0].style.transform = "translateY(" + G.a + "px)";
      s1 =
        "translateY(" +
        (G.a + G.off[1]) +
        "px) rotateX(" +
        (-b1).toFixed(2) +
        "deg)";
      L.st[1].style.transform = s1;
      L.st[2].style.transform =
        s1 +
        " translateY(" +
        G.strips[1] +
        "px) rotateX(" +
        (-b2).toFixed(2) +
        "deg)";
    } else {
      L.el.style.transform =
        "translate3d(0," +
        -G.H / 2 +
        "px," +
        zoff +
        "px) rotateY(" +
        (-th * DEG).toFixed(3) +
        "deg)";
      L.st[0].style.transform = "translateX(" + G.a + "px)";
      s1 =
        "translateX(" +
        (G.a + G.off[1]) +
        "px) rotateY(" +
        b1.toFixed(2) +
        "deg)";
      L.st[1].style.transform = s1;
      L.st[2].style.transform =
        s1 +
        " translateX(" +
        G.strips[1] +
        "px) rotateY(" +
        b2.toFixed(2) +
        "deg)";
    }
    // Shade each strip by how far it has turned from the light, blending across the
    // hinges so the curl reads as one sheet. Back windows are mirrored: outer edge first.
    var lr = G.light[0],
      lz = G.light[1],
      ln = Math.sqrt(lr * lr + lz * lz),
      df = [],
      db = [];
    lr /= ln;
    lz /= ln;
    [th, th - b1 / DEG, th - (b1 + b2) / DEG].forEach(function (an) {
      var dot = -Math.sin(an) * lr + Math.cos(an) * lz;
      df.push(0.5 * Math.min(1, Math.max(0, 1 - dot / lz)));
      db.push(0.5 * Math.min(1, Math.max(0, 1 + dot / lz)));
    });
    var ef = [df[0], (df[0] + df[1]) / 2, (df[1] + df[2]) / 2, df[2]],
      eb = [db[0], (db[0] + db[1]) / 2, (db[1] + db[2]) / 2, db[2]];
    for (var k = 0; k < 3; k++) {
      L.shd[k][0].style.background = shade(ef[k], ef[k + 1]);
      L.shd[k][1].style.background = shade(eb[k + 1], eb[k]);
    }
  }
  function shade(a, b) {
    return a + b < 0.004
      ? "none"
      : "linear-gradient(" +
          (G.mob ? 180 : 90) +
          "deg,rgba(33,23,10," +
          a.toFixed(3) +
          "),rgba(33,23,10," +
          b.toFixed(3) +
          "))";
  }
  // the strips are only pictures of the page: give them what was typed before it turns
  function syncParts(L) {
    var from = L.whole.querySelectorAll("input,textarea");
    if (!from.length) return;
    L.st.forEach(function (s) {
      var to = s.querySelectorAll("input,textarea");
      from.forEach(function (f, i) {
        if (!to[i]) return;
        if (f.type === "checkbox") to[i].checked = f.checked;
        else to[i].value = f.value;
      });
    });
  }
  function state(L, s) {
    if (L.cls === s) return;
    if (s === "fly") syncParts(L);
    L.cls = s;
    L.ctx.className = "ctx " + s + (L.tabbed ? " tabbed" : "");
    L.ctx.setAttribute("aria-hidden", s === "top" ? "false" : "true");
  }

  function render() {
    var Rs = [],
      Ls = [],
      F = [];
    leaves.forEach(function (L) {
      (L.th <= 1e-4 ? Rs : L.th >= PI - 1e-4 ? Ls : F).push(L);
    });
    Ls.reverse();
    Rs.forEach(function (L, k) {
      place(L, -k * G.LEAF);
      state(L, k ? "deep" : "top");
      L.ctx.style.zIndex = 60 - k;
    });
    Ls.forEach(function (L, k) {
      place(L, -k * G.LEAF);
      state(L, k ? "deep" : "top");
      L.ctx.style.zIndex = 120 - k;
    });
    F.forEach(function (L) {
      place(L, 0);
      state(L, "fly");
    });
    var cR = 0,
      cL = 0;
    F.forEach(function (L) {
      var t = L.th;
      if (t < PI / 2) cR = Math.max(cR, 0.55 * Math.sin(2 * t));
      else cL = Math.max(cL, 0.55 * Math.sin(2 * (PI - t)));
    });
    leaves.forEach(function (L) {
      var v = L === Rs[0] ? cR : L === Ls[0] ? cL : 0;
      if (L.cast !== v) {
        L.cast = v;
        L.ctx.style.setProperty("--cast", v.toFixed(3));
      }
    });
    // Painter's order around the axis: the turning leaves cut the loops into sectors;
    // whatever lies angularly further from the eye is drawn first.
    F.sort(function (a, b) {
      return a.th - b.th;
    });
    var m = F.length,
      bnd = [0],
      z = 200,
      j,
      jm = 0;
    F.forEach(function (L) {
      bnd.push(L.th);
    });
    bnd.push(PI);
    while (jm < m && F[jm].th < G.psi) jm++;
    function sec(j) {
      layers[j].svg.style.zIndex = z++;
      setArc(layers[j], bnd[j], bnd[j + 1], j === 0, j === m);
    }
    for (j = 0; j < jm; j++) {
      sec(j);
      F[j].ctx.style.zIndex = z++;
    }
    for (j = m; j > jm; j--) {
      sec(j);
      F[j - 1].ctx.style.zIndex = z++;
    }
    sec(jm);
    for (j = m + 1; j < layers.length; j++)
      setArc(layers[j], 0, 0, false, false);
  }

  function curl(u) {
    return Math.sin(PI * Math.pow(u, 0.8)) * (1 - 0.4 * u);
  }
  function frame(now) {
    raf = 0;
    var busy = false;
    leaves.forEach(function (L) {
      var A = L.anim;
      if (!A) return;
      var u = (now - A.t0) / A.dur;
      if (u >= 1) {
        L.th = A.to;
        L.c = 0;
        L.anim = null;
        return;
      }
      busy = true;
      L.dir = A.dir;
      if (u <= 0) {
        L.th = A.from;
        L.c = 0;
        return;
      }
      L.th = A.from + (A.to - A.from) * ease(u);
      L.c = reduce ? 0 : curl(u) * Math.min(1, Math.abs(A.to - A.from) / PI);
    });
    render();
    if (busy) kick();
  }
  function kick() {
    if (!raf) raf = requestAnimationFrame(frame);
  }
  // Turn to spread t. o.instant lays the leaves down at once; o.delay holds the turn
  // back, e.g. until the camera has arrived.
  function go(t, o) {
    o = o || {};
    t = Math.max(0, Math.min(G.N - 1, t));
    if (t === p) return;
    var fwd = t > p,
      lo = Math.min(p, t),
      hi = Math.max(p, t),
      now = performance.now() + (o.delay || 0);
    var stag = reduce ? 0 : Math.min(110, 720 / Math.max(1, hi - lo - 1));
    for (var i = lo; i < hi; i++) {
      var L = leaves[i],
        to = fwd ? PI : 0,
        dist = Math.abs(to - L.th) / PI;
      if (o.instant) {
        L.th = to;
        L.anim = null;
        continue;
      }
      if (dist < 1e-4) {
        L.anim = null;
        continue;
      }
      L.anim = {
        from: L.th,
        to: to,
        t0: now + (fwd ? i - lo : hi - 1 - i) * stag,
        dur: (reduce ? 260 : 980) * Math.max(0.4, dist),
        dir: fwd ? 1 : -1,
      };
    }
    p = t;
    section();
    if (o.instant) render();
    else kick();
  }
  function section() {
    var s = 0;
    G.SEC.forEach(function (v, k) {
      if (p >= v) s = k;
    });
    root.setAttribute("data-sec", s);
    if (s === sec) return;
    sec = s;
    if (onSection) onSection(s);
  }

  function build() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    world.innerHTML = "";
    world.style.perspective = G.P + "px";
    world.style.perspectiveOrigin = G.ox + "px " + G.oy + "px";
    var rs = root.style,
      len = G.mob ? G.W : G.H;
    rs.setProperty("--W", G.W + "px");
    rs.setProperty("--H", G.H + "px");
    rs.setProperty("--pitch", G.pitch + "px");
    rs.setProperty("--hw2", 2 * G.hu + "px");
    rs.setProperty("--htop", G.s0 + len / 2 - G.pitch / 2 + "px");
    rs.setProperty("--hlen", G.n * G.pitch + "px");
    rs.setProperty("--hole-img", holeTile());
    (G.mob ? baseMob : baseDesk)(ctx(1));
    leaves = [];
    for (var i = 0; i < G.N; i++) leaves.push(makeLeaf(i));
    coilBase();
    layers = [];
    for (i = 0; i <= G.N; i++) layers.push(wireLayer());
    section();
    render();
  }

  return {
    // (Re)build for the desk or the phone, keeping the open section.
    setMode: function (mob) {
      G = geo(mob);
      p = G.SEC[Math.max(0, sec)];
      build();
    },
    size: function () {
      return { w: G.SW, h: G.SH };
    },
    step: function (d) {
      go(p + d);
    },
    turn: function (a) {
      go(a === "next" ? p + 1 : a === "prev" ? p - 1 : 0);
    },
    // Open section k: unless o.jump, any page already in that section will do.
    toSec: function (k, o) {
      o = o || {};
      if (k === sec && !o.jump) return;
      go(G.SEC[k], o);
    },
    sec: function () {
      return sec;
    },
    state: function () {
      return {
        p: p,
        sec: sec,
        flying: leaves.filter(function (L) {
          return L.anim;
        }).length,
      };
    },
  };
}
