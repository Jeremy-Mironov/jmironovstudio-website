// Small helpers shared by the desk scripts.
export var NS = "http://www.w3.org/2000/svg";
export var reduce = !!(
  window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches
);

export function el(tag, cls, parent) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
}
export function svg(tag, at, parent) {
  var e = document.createElementNS(NS, tag);
  for (var k in at) e.setAttribute(k, at[k]);
  if (parent) parent.appendChild(e);
  return e;
}
export function n1(v) {
  return Math.round(v * 10) / 10;
}
export function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
export function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Taped photos and notes (and anything marked .lbable) open in the lightbox.
export function markLB(scope, live) {
  scope
    .querySelectorAll(".shot,.mini,.polar,.sticky,.lbable")
    .forEach(function (e) {
      if (!e.classList.contains("lbable") && !e.querySelector(".tape")) return;
      e.classList.add("lbable");
      if (!live) return;
      e.tabIndex = 0;
      e.setAttribute("role", "button");
      e.setAttribute(
        "aria-label",
        e.querySelector("img") ? "Open photo" : "Open note",
      );
    });
}
