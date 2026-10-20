/*!
 * Mandalink announcement board — embeddable widget
 *
 * Shows the same announcements as mandalink.org/announcements, straight from the
 * Mandalink database, on any website (built for rayanupadhyay.com).
 *
 *   <div data-mandalink-announcements></div>
 *   <script src="https://mandalink.org/announcements-embed.js" defer></script>
 *
 * Options (all optional) — set as data-attributes on the <div>:
 *   data-category   all | mandalink | rayanupadhyay | other     (default: all)
 *   data-limit      how many posts to show                      (default: 12)
 *   data-tabs       true | false  — category tabs               (default: true when category=all)
 *   data-theme      light | dark                                (default: light)
 *   data-accent     any CSS colour, e.g. #0f6cbd                (default: Mandalink blue)
 *   data-link       true | false  — "View all on Mandalink"     (default: true)
 *   data-api        override the Mandalink API base URL
 *
 * Styling: the widget lives in a Shadow DOM, so your site's CSS can't break it.
 * To restyle it, set CSS variables on the <div>: --mlb-accent, --mlb-bg, --mlb-card,
 * --mlb-text, --mlb-muted, --mlb-border, --mlb-radius. It inherits your site's font.
 */
(function () {
  'use strict';

  var DEFAULT_API = 'https://mychineseapp.onrender.com';
  var BOARD_URL = 'https://mandalink.org/announcements';
  var CATS = [
    { key: 'mandalink', label: 'Mandalink' },
    { key: 'rayanupadhyay', label: 'rayanupadhyay.com' },
    { key: 'other', label: 'Other' }
  ];

  var CSS = [
    ':host{display:block}',
    '.mlb{--a:var(--mlb-accent,#0f6cbd);--bg:var(--mlb-bg,transparent);--card:var(--mlb-card,#fff);--tx:var(--mlb-text,#242424);--mu:var(--mlb-muted,#7a746a);--bd:var(--mlb-border,#e4ddd0);--r:var(--mlb-radius,14px);',
    'font-family:inherit;color:var(--tx);background:var(--bg);line-height:1.5;box-sizing:border-box}',
    '.mlb *{box-sizing:border-box}',
    '.mlb.dark{--card:var(--mlb-card,#1c2230);--tx:var(--mlb-text,#eef1f6);--mu:var(--mlb-muted,#9aa3b2);--bd:var(--mlb-border,#2b3446)}',
    '.tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}',
    '.tab{font:inherit;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:999px;border:1.5px solid var(--bd);background:var(--card);color:var(--mu);cursor:pointer;transition:all .15s}',
    '.tab:hover{border-color:var(--a);color:var(--a)}',
    '.tab.on{background:var(--a);border-color:var(--a);color:#fff}',
    '.tab .n{font-size:11px;opacity:.75}',
    '.grid{display:flex;gap:16px;align-items:flex-start}',
    '.col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:16px}',
    '.card{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.04)}',
    '.card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:rgba(15,108,189,.08)}',
    '.bd{padding:16px 18px 20px}',
    '.meta{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin:0 0 9px}',
    '.chip{padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.02em}',
    '.chip.mandalink{background:rgba(15,108,189,.12);color:var(--a)}',
    '.chip.rayanupadhyay{background:rgba(185,138,46,.16);color:#b98a2e}',
    '.chip.other{background:rgba(20,122,110,.14);color:#147a6e}',
    '.pin{font-size:11.5px;font-weight:700;color:#b98a2e}',
    '.dt{margin-left:auto;font-size:12px;font-weight:600;color:var(--mu)}',
    '.ttl{margin:0 0 7px;font-size:18px;font-weight:800;line-height:1.25;letter-spacing:-.01em;overflow-wrap:anywhere}',
    '.txt{margin:0;font-size:14.5px;line-height:1.6;color:var(--mu);white-space:pre-wrap;overflow-wrap:anywhere}',
    '.state{padding:34px 20px;text-align:center;color:var(--mu);font-size:14.5px;border:1px dashed var(--bd);border-radius:var(--r)}',
    '.state button{font:inherit;font-weight:700;margin-top:12px;padding:8px 16px;border-radius:999px;border:1.5px solid var(--a);background:transparent;color:var(--a);cursor:pointer}',
    '.foot{margin-top:16px;text-align:right;font-size:13px}',
    '.foot a{color:var(--a);font-weight:700;text-decoration:none}',
    '.foot a:hover{text-decoration:underline}'
  ].join('\n');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Backend sends LocalDateTime with microseconds; trim so every browser parses it.
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(String(iso).replace(/(\.\d{3})\d+/, '$1'));
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function labelFor(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].key === key) return CATS[i].label;
    return 'Other';
  }

  function bool(v, dflt) {
    if (v == null || v === '') return dflt;
    return String(v).toLowerCase() !== 'false';
  }

  function init(host) {
    if (host.__mlbInit) return;
    host.__mlbInit = true;

    var ds = host.dataset || {};
    var api = (ds.api || DEFAULT_API).replace(/\/+$/, '');
    var category = (ds.category || 'all').toLowerCase();
    var limit = Math.max(1, Math.min(parseInt(ds.limit, 10) || 12, 100));
    var showTabs = bool(ds.tabs, category === 'all');
    var showLink = bool(ds.link, true);
    var dark = (ds.theme || 'light').toLowerCase() === 'dark';

    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var style = document.createElement('style');
    style.textContent = CSS;
    root.appendChild(style);

    var wrap = el('div', 'mlb' + (dark ? ' dark' : ''));
    if (ds.accent) wrap.style.setProperty('--a', ds.accent);
    root.appendChild(wrap);

    var items = [];
    var active = category === 'all' ? 'all' : category;
    var curGrid = null, curCards = [], curCols = 0;

    // Masonry without gaps: fit as many ~270px columns as the container allows
    // (max 3) and drop each card into whichever column is currently shortest.
    // Done by hand (not CSS multi-column) so a few posts spread predictably.
    function layoutGrid() {
      if (!curGrid) return;
      var w = wrap.clientWidth || 600;
      var cols = Math.max(1, Math.min(3, Math.floor((w + 16) / 286)));
      if (cols === curCols) return;
      curCols = cols;
      curGrid.textContent = '';
      var colEls = [];
      for (var i = 0; i < cols; i++) {
        var c = el('div', 'col');
        curGrid.appendChild(c);
        colEls.push(c);
      }
      curCards.forEach(function (card) {
        var shortest = colEls[0];
        for (var j = 1; j < colEls.length; j++) {
          if (colEls[j].offsetHeight < shortest.offsetHeight) shortest = colEls[j];
        }
        shortest.appendChild(card);
      });
    }
    if (window.ResizeObserver) new ResizeObserver(layoutGrid).observe(wrap);

    function showState(msg, retry) {
      wrap.textContent = '';
      var s = el('div', 'state', msg);
      if (retry) {
        var b = el('button', null, 'Try again');
        b.type = 'button';
        b.addEventListener('click', load);
        s.appendChild(document.createElement('br'));
        s.appendChild(b);
      }
      wrap.appendChild(s);
    }

    function render() {
      wrap.textContent = '';
      curGrid = null;
      curCards = [];
      curCols = 0;

      if (showTabs) {
        var tabs = el('div', 'tabs');
        tabs.setAttribute('role', 'tablist');
        [{ key: 'all', label: 'All' }].concat(CATS).forEach(function (c) {
          var n = c.key === 'all' ? items.length : items.filter(function (i) { return i.category === c.key; }).length;
          var t = el('button', 'tab' + (active === c.key ? ' on' : ''));
          t.type = 'button';
          t.setAttribute('role', 'tab');
          t.setAttribute('aria-selected', active === c.key ? 'true' : 'false');
          t.appendChild(document.createTextNode(c.label + ' '));
          t.appendChild(el('span', 'n', String(n)));
          t.addEventListener('click', function () { active = c.key; render(); });
          tabs.appendChild(t);
        });
        wrap.appendChild(tabs);
      }

      var visible = (active === 'all' ? items : items.filter(function (i) { return i.category === active; })).slice(0, limit);

      if (!visible.length) {
        wrap.appendChild(el('div', 'state', active === 'all' ? 'No announcements yet.' : 'Nothing in ' + labelFor(active) + ' yet.'));
      } else {
        var grid = el('div', 'grid');
        visible.forEach(function (a) {
          var card = el('article', 'card');
          if (a.imagePath) {
            var link = document.createElement('a');
            link.href = api + a.imagePath;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            var img = document.createElement('img');
            img.src = api + a.imagePath;
            img.alt = '';
            img.loading = 'lazy';
            link.appendChild(img);
            card.appendChild(link);
          }
          var bd = el('div', 'bd');
          var meta = el('div', 'meta');
          meta.appendChild(el('span', 'chip ' + (a.category || 'other'), labelFor(a.category)));
          if (a.pinned) meta.appendChild(el('span', 'pin', '📌 Pinned'));
          meta.appendChild(el('span', 'dt', fmtDate(a.createdAt)));
          bd.appendChild(meta);
          bd.appendChild(el('h3', 'ttl', a.title));
          if (a.body) bd.appendChild(el('p', 'txt', a.body));
          card.appendChild(bd);
          curCards.push(card);
        });
        wrap.appendChild(grid);
        curGrid = grid;
        layoutGrid();
      }

      if (showLink) {
        var foot = el('div', 'foot');
        var a = document.createElement('a');
        a.href = BOARD_URL;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'View all on Mandalink →';
        foot.appendChild(a);
        wrap.appendChild(foot);
      }
    }

    var slowTimer = null;
    function load() {
      showState('Loading announcements…');
      // The API runs on a free tier that sleeps when idle; the first request can be slow.
      slowTimer = setTimeout(function () {
        if (!items.length) showState('Waking up the server — one moment…');
      }, 6000);

      // Tabs need every category up front; a fixed category only needs its own.
      var qs = showTabs ? '?limit=100' : '?category=' + encodeURIComponent(category) + '&limit=' + limit;
      fetch(api + '/api/announcements' + qs)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (data) {
          clearTimeout(slowTimer);
          items = Array.isArray(data) ? data : [];
          render();
        })
        .catch(function () {
          clearTimeout(slowTimer);
          showState('Couldn’t load announcements right now.', true);
        });
    }

    load();
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-mandalink-announcements], #mandalink-announcements');
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }

  // Exposed so single-page apps can mount it after render: window.MandalinkAnnouncements.init(div)
  window.MandalinkAnnouncements = { init: init, boot: boot };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
