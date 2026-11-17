(() => {
  'use strict';

  // ---------------------------------------------------------------- config
  const SHEET_ID = '1BtHFvXhsUyDKANK-F2c1jDNItOld6_j4lve8Nahudk0';
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
  const gviz = (sheet) =>
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(sheet)}`;
  const JOURNAL_URL = 'https://animation.hiroshimafest.org/journal/';

  // 動画リンクの素性。スプレッドシートのタグをそのまま尊重して表示する。
  const KIND = {
    full:   { rank: 0, cls: 'ok' },
    manual: { rank: 0, cls: 'ok' },
    auto:   { rank: 1, cls: '' },
    clip:   { rank: 2, cls: 'warn' },
    doubt:  { rank: 3, cls: 'warn' },
  };

  // 投稿されたリストが名乗れる種類。"full"（映画祭サイト掲載の本編）はシート由来の動画だけのもの
  const LIST_KINDS = ['manual', 'auto', 'clip', 'doubt'];

  // ---------------------------------------------------------------- 文言（日本語 / English）
  const TEXT = {
    ja: {
      order: '順番', optYear: '年代順（1906→）', optPicks: '推薦が多い順', optCurator: '紹介者ごと', optShuffle: 'シャッフル',
      clips: '予告編・抜粋も流す', doubt: '不確かなマッチも流す', prev: '前の作品', next: '次の作品',
      about: '出典', close: '閉じる',
      gateTitle: '上映を始める', gateSound: '🔊 音ありで始める', gateMuted: '🔇 音なしで始める',
      gateCountdown: (n) => `選ばない場合、${n}秒後に音なしで始まる`,
      tabFilms: '作品', tabPeople: '紹介者', search: '作品・監督・紹介者で絞り込み', timeline: '年表', loading: 'データを読み込み中…',
      kind_full: '本編・映画祭サイト掲載', kind_manual: 'リスト作成者が指定した動画', kind_auto: '検索でマッチした動画（未確認）',
      kind_clip: '予告編・抜粋', kind_doubt: '不確かなマッチ',
      cantPlay: 'この動画はここでは再生できない', cantPlayWhy: '埋め込みが許可されていないか、削除された可能性がある。まもなく次の作品へ。',
      openYT: 'YouTube で開く', blocked: '自動再生がブラウザに止められた', start: '上映を始める', loadingVideo: '動画を読み込み中…',
      cantPlayShort: 'この動画はここでは再生できない。', skippedKind: 'この作品の動画は、いまの設定では流さない種類（予告編または不確かなマッチ）。',
      noEmbed: 'この作品は埋め込める動画が見つかっていない。下の情報から探してほしい。', searchYT: 'YouTube で検索', movingOn: 'まもなく次の作品へ。',
      nothing: '流せる作品がない', nothingHint: '上の設定を変えてみてほしい。',
      playList: 'この人のリストを流す', watchNow: 'いま流れている動画を YouTube で観る', official: '公式・推奨の視聴先: ', other: 'ほかの視聴先: ',
      physical: 'ソフト: ', noWatch: '視聴先の情報はまだない。', noVideo: '動画なし', directedBy: '監督 ', unknown: '不明',
      pickedBy: (n) => (n ? `この作品を選んだ人（${n}）` : 'この作品を選んだ人'),
      indexOnly: '冊子の索引にのみ掲載。どの参加者のリストにも載っていない。', watchHeading: '観る・知る',
      markBroken: '再生不可', markClipOnly: '予告のみ', markDoubt: '不確か', markClip: '予告',
      nPeople: (n) => `${n}人が選んだ`, nFilms: (n) => `${n}本`,
      groupFest: (n) => `ひろしまアニメーションシーズン2026 冊子（${n}名）`, groupExtra: 'そのほかのリスト',
      sourcePrefix: '出典: ', back: '← すべての作品に戻る',
      whereScope: (name) => `${name}のリスト`, whereAll: (n) => `全${n}作品`, playing: '上映',
      tlTitle: (f) => `${f.year} ${f.title} — ${f.director}（${f.picks.length}人）`,
      dataErr: 'データを読み込めなかった', openSheet: 'スプレッドシートを開く',
      sheetErr: (s, c) => `スプレッドシート「${s}」を取得できない (HTTP ${c})`, noFilms: '作品が1件も読めなかった',
      fromSnapshot: 'このサイトは、シートを取り込んだコピーを使っています。', fromLive: 'このサイトは、表示のたびにシートを直接読んでいます。',
      none: 'なし', journal: '映画祭ジャーナル', direct: 'このサイトへの投稿', source: '出典',
    },
    en: {
      order: 'Order', optYear: 'By year (1906→)', optPicks: 'Most picked', optCurator: 'Person by person', optShuffle: 'Shuffle',
      clips: 'Include trailers & clips', doubt: 'Include doubtful matches', prev: 'Previous film', next: 'Next film',
      about: 'Sources', close: 'Close',
      gateTitle: 'Start the screening', gateSound: '🔊 Start with sound', gateMuted: '🔇 Start muted',
      gateCountdown: (n) => `If you don’t choose, it starts muted in ${n} seconds`,
      tabFilms: 'Films', tabPeople: 'People', search: 'Filter by film, director or person', timeline: 'Timeline', loading: 'Loading data…',
      kind_full: 'Full film · embedded on the festival site', kind_manual: 'Video chosen by the list’s author', kind_auto: 'Matched by search (unverified)',
      kind_clip: 'Trailer or clip', kind_doubt: 'Doubtful match',
      cantPlay: 'This video can’t be played here', cantPlayWhy: 'Embedding may be disabled, or the video may have been removed. Moving on shortly.',
      openYT: 'Open on YouTube', blocked: 'The browser blocked autoplay', start: 'Start the screening', loadingVideo: 'Loading video…',
      cantPlayShort: 'This video can’t be played here.', skippedKind: 'The only video for this film is a trailer or a doubtful match, which the current settings skip.',
      noEmbed: 'No embeddable video has been found for this film. Try the links below.', searchYT: 'Search on YouTube', movingOn: 'Moving on shortly.',
      nothing: 'Nothing to play', nothingHint: 'Try changing the settings above.',
      playList: 'Play this person’s list', watchNow: 'Watch this video on YouTube', official: 'Official / best source: ', other: 'Also at: ',
      physical: 'Physical release: ', noWatch: 'No viewing information yet.', noVideo: 'No video', directedBy: 'Directed by ', unknown: 'unknown',
      pickedBy: (n) => (n ? `Picked by (${n})` : 'Picked by'),
      indexOnly: 'Listed only in the booklet’s index; not on any participant’s list.', watchHeading: 'Watch & learn more',
      markBroken: 'Unplayable', markClipOnly: 'Trailer only', markDoubt: 'Doubtful', markClip: 'Trailer',
      nPeople: (n) => `Picked by ${n} people`, nFilms: (n) => `${n} films`,
      groupFest: (n) => `Hiroshima Animation Season 2026 booklet (${n} people)`, groupExtra: 'Other lists',
      sourcePrefix: 'Source: ', back: '← Back to all films',
      whereScope: (name) => `${name}’s list`, whereAll: (n) => `All ${n} films`, playing: 'Playing',
      tlTitle: (f) => `${f.year} ${f.title} — ${f.director} (${f.picks.length} ${f.picks.length === 1 ? 'pick' : 'picks'})`,
      dataErr: 'Could not load the data', openSheet: 'Open the spreadsheet',
      sheetErr: (s, c) => `Could not fetch the “${s}” sheet (HTTP ${c})`, noFilms: 'No films could be read',
      fromSnapshot: 'This site uses a copy of the sheet.', fromLive: 'This site reads the sheet directly on every visit.',
      none: 'None', journal: 'Festival journal', direct: 'Submitted to this site', source: 'Source',
    },
  };

  // ---------------------------------------------------------------- helpers
  const $ = (s) => document.querySelector(s);
  const isUrl = (s) => /^https?:\/\/\S+$/i.test(s || '');

  const store = {
    get(k, d) { try { const v = localStorage.getItem('faf:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('faf:' + k, JSON.stringify(v)); } catch { /* 保存できなくても動く */ } },
  };

  let lang = store.get('lang', null);
  if (lang !== 'ja' && lang !== 'en') lang = (navigator.language || '').toLowerCase().startsWith('ja') ? 'ja' : 'en';
  const t = (key, ...args) => { const v = TEXT[lang][key]; return typeof v === 'function' ? v(...args) : v; };
  // データ側の文言は文字列か { ja, en }。いまの言語、なければもう一方を返す
  const loc = (v) => (v && typeof v === 'object' ? v[lang] || v.ja || v.en || '' : v || '');

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false || kid === '') continue;
      el.append(kid.nodeType ? kid : String(kid));
    }
    return el;
  }
  // replaceChildren は null を "null" という文字にしてしまうので、空の子を除いて差し替える
  const fill = (el, ...kids) => el.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false && k !== ''));
  const ext = (href, label) =>
    isUrl(href) ? h('a', { href, target: '_blank', rel: 'noopener noreferrer', class: 'ext' }, label, ' ↗') : null;

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.map((r) => r.map((x) => x.trim()));
  }

  const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9぀-ヿ一-鿿]+/g, ' ').trim().replace(/^(the|a|an) /, '').replace(/ /g, '');
  const nameTokens = (s) => new Set((s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .split(/[^a-z]+/).filter((x) => x.length >= 4));

  function youtubeId(url) {
    const m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url || '');
    return m ? m[1] : null;
  }
  function parseVideos(cell) {
    return (cell || '').split(/\s*\|\s*/).map((seg) => {
      const m = /^(?:\(([^)]*)\)\s*)?(https?:\/\/\S+)$/.exec(seg.trim());
      if (!m) return null;
      const tag = (m[1] || '').toLowerCase();
      const vid = youtubeId(m[2]);
      if (!vid) return null;
      let kind = 'auto';
      if (tag.includes('doubtful')) kind = 'doubt';
      else if (tag.includes('trailer') || tag.includes('clip')) kind = 'clip';
      else if (tag.startsWith('f')) kind = 'full';
      return { kind, vid, url: m[2] };
    }).filter(Boolean);
  }
  // "Wikipedia: https://… | Interview: https://…" や URL だけのセルをリンクの配列に
  function parseLinks(cell) {
    return (cell || '').split(/\s*\|\s*/).map((seg) => {
      const m = /^(.*?):?\s*(https?:\/\/\S+)$/.exec(seg.trim());
      if (!m) return null;
      let label = m[1].trim();
      if (!label) { try { label = new URL(m[2]).hostname.replace(/^www\./, ''); } catch { label = m[2]; } }
      return { label, url: m[2] };
    }).filter(Boolean);
  }

  // ---------------------------------------------------------------- data
  const films = new Map();     // id -> film
  const curators = new Map();  // id -> curator
  let dataFrom = '';

  async function loadCsv(localPath, sheetName) {
    try {
      const r = await fetch(localPath, { cache: 'no-cache' });
      if (r.ok) {
        const text = await r.text();
        if (text.trim() && !text.trimStart().startsWith('<')) return { text, from: 'snapshot' };
      }
    } catch { /* コピーなし → シートを直接読む */ }
    const r = await fetch(gviz(sheetName));
    if (!r.ok) throw new Error(t('sheetErr', sheetName, r.status));
    return { text: await r.text(), from: 'live' };
  }

  // data/lists/ の 1人1ファイルのリストを読む。
  // 公開時は GitHub Actions が作る index.json を使い、手元ではサーバーのディレクトリ一覧から拾う。
  async function loadLists() {
    const dir = 'data/lists/';
    let names = [];
    try {
      const r = await fetch(dir + 'index.json', { cache: 'no-cache' });
      if (r.ok) names = await r.json();
      else {
        const html = await fetch(dir, { cache: 'no-cache' }).then((x) => (x.ok ? x.text() : ''));
        names = [...html.matchAll(/href="([^"\/?#]+\.json)"/g)].map((m) => decodeURIComponent(m[1]));
      }
    } catch { /* リストなしでも冊子のデータだけで動く */ }
    names = [...new Set(names)].filter((n) => /^[a-z0-9][a-z0-9._-]*\.json$/.test(n) && n !== 'index.json').sort();
    const lists = await Promise.all(names.map(async (n) => {
      try {
        const r = await fetch(dir + n, { cache: 'no-cache' });
        const list = await r.json();
        if (!list || !list.name || !Array.isArray(list.picks)) throw new Error('name and picks are required');
        return Object.assign(list, { id: n.replace(/\.json$/, '') });
      } catch (err) {
        console.warn(`Could not read list ${n}:`, err);
        return null;
      }
    }));
    return { lists: lists.filter(Boolean) };
  }

  function colFinder(header) {
    const hdr = header.map((x) => x.toLowerCase());
    return (fallback, ...names) => {
      for (const n of names) { const i = hdr.findIndex((x) => x.startsWith(n)); if (i >= 0) return i; }
      return fallback;
    };
  }

  function addCurator(c) {
    curators.set(c.id, Object.assign({ picks: [], links: {}, kind: 'festival' }, c));
    return curators.get(c.id);
  }
  const journalSource = (url) => ({ label: { ja: TEXT.ja.journal, en: TEXT.en.journal }, url: isUrl(url) ? url : JOURNAL_URL });

  function buildPeople(csv) {
    const rows = parseCSV(csv);
    const col = colFinder(rows[0] || []);
    const c = {
      name: col(0, 'name'), jp: col(1, 'name (japanese'), role: col(2, 'title / affiliation'),
      jpRole: col(3, 'title / affiliation (japanese'), page: col(12, 'festival website'),
    };
    const linkCols = [['Website', col(6, 'website')], ['Instagram', col(7, 'instagram')], ['X', col(8, 'x /')],
      ['YouTube', col(9, 'youtube')], ['Vimeo', col(10, 'vimeo')], ['Wikipedia', col(11, 'wikipedia')]];
    for (const r of rows.slice(1)) {
      const name = r[c.name];
      if (!name) continue;
      const links = {};
      for (const [label, i] of linkCols) if (isUrl(r[i])) links[label] = r[i];
      addCurator({
        id: name, name, jpName: r[c.jp] || '', links, source: journalSource(r[c.page]),
        role: { ja: r[c.jpRole] || r[c.role] || '', en: r[c.role] || r[c.jpRole] || '' },
      });
    }
  }

  function buildPicks(csv) {
    const rows = parseCSV(csv);
    const col = colFinder(rows[0] || []);
    const c = {
      who: col(0, 'participant'), title: col(2, 'title'), dir: col(3, 'director'), year: col(4, 'year'),
      country: col(5, 'country'), yt: col(6, 'youtube'), len: col(7, 'first link'), official: col(8, 'official'),
      other: col(9, 'other places'), related: col(10, 'related'), offline: col(11, 'offline'),
      notes: col(12, 'notes'), jp: col(13, 'japanese'), ord: col(14, '# of'), id: col(16, 'film id'),
    };
    let seq = 0;
    for (const r of rows.slice(1)) {
      const title = r[c.title];
      if (!title) continue;
      const id = r[c.id] ? 'f' + r[c.id] : 't' + norm(title) + '|' + norm(r[c.dir]);
      let film = films.get(id);
      if (!film) {
        const jp = r[c.jp] || '';
        const cut = jp.lastIndexOf('　');
        const y = /\d{4}/.exec(r[c.year] || '');
        film = {
          id, title, director: r[c.dir] || '',
          jpTitle: cut > 0 ? jp.slice(0, cut) : jp, jpDirector: cut > 0 ? jp.slice(cut + 1) : '',
          year: y ? +y[0] : null, country: r[c.country] || '',
          videos: parseVideos(r[c.yt]), length: /^\d+:\d\d(:\d\d)?$/.test(r[c.len] || '') ? r[c.len] : '',
          official: parseLinks(r[c.official]), other: parseLinks(r[c.other]),
          related: parseLinks(r[c.related]), offline: r[c.offline] || '', notes: r[c.notes] || '',
          picks: [], seq: seq++,
        };
        films.set(id, film);
      }
      const who = r[c.who];
      if (!who || who.startsWith('(')) continue; // 冊子の索引のみに載っている作品
      const cur = curators.get(who) || addCurator({ id: who, name: who, role: '', source: journalSource('') });
      if (!film.picks.some((p) => p.curator === cur)) {
        film.picks.push({ curator: cur });
        cur.picks.push({ film, order: +r[c.ord] || cur.picks.length + 1 });
      }
    }
    for (const cur of curators.values()) cur.picks.sort((a, b) => a.order - b.order);
  }

  function buildExtra(extra) {
    const byTitle = new Map();
    for (const f of films.values()) {
      for (const k of [norm(f.title), norm(f.jpTitle)]) {
        if (!k) continue;
        if (!byTitle.has(k)) byTitle.set(k, []);
        byTitle.get(k).push(f);
      }
    }
    for (const list of (extra && extra.lists) || []) {
      const cur = addCurator({
        id: 'x:' + list.id, kind: 'extra', name: list.name, jpName: '', handle: list.handle || '',
        role: list.role || '', note: list.note || '', links: list.links || {},
        source: list.source && isUrl(list.source.url)
          ? { label: list.source.label || { ja: TEXT.ja.source, en: TEXT.en.source }, url: list.source.url }
          : { label: { ja: TEXT.ja.direct, en: TEXT.en.direct }, url: '' },
      });
      (list.picks || []).forEach((p, i) => {
        const want = nameTokens(p.director);
        let film = null;
        for (const title of [p.title, ...(p.aliases || [])]) {
          const cands = byTitle.get(norm(title)) || [];
          film = cands.find((f) => { const have = nameTokens(f.director); return !want.size || [...want].some((x) => have.has(x)); });
          if (film) break;
        }
        if (!film) {
          const urls = [].concat(p.youtube || []);
          film = {
            id: `${cur.id}:${i}`, title: p.title, director: p.director || '', jpTitle: p.jpTitle || '', jpDirector: '',
            year: p.year || null, country: p.country || '',
            // youtubeKind: "manual" はリスト作成者本人が示した動画。省略時は検索で見つけた未確認の動画として扱う
            videos: urls.map((u) => ({ kind: LIST_KINDS.includes(p.youtubeKind) ? p.youtubeKind : 'auto', vid: youtubeId(u), url: u })).filter((v) => v.vid),
            length: '', official: parseLinks(p.official), other: [], related: [], offline: '', notes: p.notes || '',
            picks: [], seq: films.size,
          };
          films.set(film.id, film);
        }
        film.picks.push({ curator: cur });
        cur.picks.push({ film, order: i + 1 });
      });
    }
  }

  // ---------------------------------------------------------------- state
  const state = {
    mode: store.get('mode', 'year'),
    clips: store.get('clips', true),
    doubt: store.get('doubt', false),
    scope: null,       // 絞り込み中の紹介者
    tab: 'films',
    current: null,
    order: [],         // いまの範囲の作品（表示順 = 上映順）
    started: false,    // 上映前の選択（音あり/音なし）が済んだか
    muted: false,
    everPlayed: false,
  };
  const broken = new Set();
  let shuffled = null;

  function bestVideo(f) {
    return f.videos
      .filter((v) => (state.clips || v.kind !== 'clip') && (state.doubt || v.kind !== 'doubt'))
      .sort((a, b) => KIND[a.kind].rank - KIND[b.kind].rank)[0] || null;
  }
  const playable = (f) => !!bestVideo(f) && !broken.has(f.id);

  function computeOrder() {
    if (state.scope) return state.scope.picks.map((p) => p.film);
    const all = [...films.values()];
    const byYear = (a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.seq - b.seq;
    if (state.mode === 'picks') return all.sort((a, b) => b.picks.length - a.picks.length || byYear(a, b));
    if (state.mode === 'curator') {
      const seen = new Set();
      for (const c of curators.values()) for (const p of c.picks) seen.add(p.film);
      for (const f of all) seen.add(f);
      return [...seen];
    }
    if (state.mode === 'shuffle') {
      if (!shuffled) {
        shuffled = all.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      }
      return shuffled.slice();
    }
    return all.sort(byYear);
  }

  // ---------------------------------------------------------------- player
  let player = null, playerReady = false, pendingVid = null, timer = null;
  let lastSeek = { at: 0, to: 0 };
  const overlay = $('#overlay');

  function showOverlay(...kids) { fill(overlay, kids); overlay.hidden = false; }
  function hideOverlay() { overlay.hidden = true; }
  function clearTimer() { clearTimeout(timer); timer = null; }

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('yt', {
      width: '100%', height: '100%', host: 'https://www.youtube-nocookie.com',
      playerVars: { autoplay: 1, mute: 0, playsinline: 1, rel: 0, iv_load_policy: 3 },
      events: {
        onReady: () => {
          playerReady = true;
          // 上映前の選択がプレーヤーの準備より先に済んでいた場合、ここで音の設定を反映する
          if (state.started) applySound();
          if (pendingVid) loadVideo(pendingVid);
        },
        onStateChange: (e) => {
          if (e.data === 1) { state.everPlayed = true; clearTimer(); hideOverlay(); }
          else if (e.data === 0) next();
        },
        onError: () => {
          const f = state.current;
          if (!f) return;
          broken.add(f.id);
          markRows();
          const v = bestVideo(f);
          clearTimer();
          showOverlay(
            h('p', { class: 'big' }, t('cantPlay')),
            h('p', { class: 'small' }, t('cantPlayWhy')),
            v && h('p', {}, ext(v.url, t('openYT'))),
          );
          timer = setTimeout(next, 6000);
        },
      },
    });
  };

  // 音の入/切の専用ボタンは置かない。YouTube のプレーヤー自身の音量操作と M キーに任せる
  function setMuted(m) {
    state.muted = m;
    if (!playerReady) return;
    if (m) player.mute();
    else { player.unMute(); if (player.getVolume() === 0) player.setVolume(100); player.playVideo(); }
  }

  function applySound() {
    if (state.muted) player.mute();
    else { player.unMute(); if (player.getVolume() === 0) player.setVolume(100); }
  }

  // ---- 上映前の選択 ----
  // 再生を始める前に、音あり・音なしを選んでもらう。ブラウザは操作なしの音あり再生を止めるので、
  // 音ありはここでのクリックをきっかけに始める。選ばなければ、しばらくして音なしで始まる。
  const GATE_SECONDS = 15;
  let gateTick = null, gateLeft = 0, gateCount = null;

  function renderGate() {
    gateCount = h('p', { class: 'small' }, t('gateCountdown', gateLeft));
    showOverlay(
      h('p', { class: 'big' }, t('gateTitle')),
      h('div', { class: 'gate-actions' },
        h('button', { class: 'accent', type: 'button', onclick: () => startScreening(false) }, t('gateSound')),
        h('button', { type: 'button', onclick: () => startScreening(true) }, t('gateMuted'))),
      gateCount,
    );
  }
  function openGate() {
    gateLeft = GATE_SECONDS;
    renderGate();
    gateTick = setInterval(() => {
      gateLeft -= 1;
      if (gateLeft <= 0) startScreening(true);
      // ボタンは作り直さない。作り直すと、押している最中のクリックが消える
      else gateCount.textContent = t('gateCountdown', gateLeft);
    }, 1000);
  }
  function startScreening(muted) {
    clearInterval(gateTick);
    state.started = true;
    state.muted = muted;
    if (playerReady) applySound();
    show(state.current);
  }

  function loadVideo(vid) {
    if (!playerReady) { pendingVid = vid; return; }
    pendingVid = null;
    player.loadVideoById(vid);
    clearTimer();
    // 再生が始まらない場合の見張り
    timer = setTimeout(() => {
      const s = player.getPlayerState ? player.getPlayerState() : -1;
      if (s === 1 || s === 2 || s === 3) return;
      if (!state.everPlayed) {
        showOverlay(
          h('p', { class: 'big' }, t('blocked')),
          h('button', { class: 'accent', type: 'button', onclick: () => { player.playVideo(); hideOverlay(); } }, t('start')),
        );
      } else next();
    }, 20000);
  }

  function show(film) {
    if (!film) return;
    state.current = film;
    store.set('last', film.id);
    try { history.replaceState(null, '', '#' + encodeURIComponent(film.id)); } catch { /* file:// など */ }
    renderInfo();
    markRows(true);
    updateCounter();
    clearTimer();
    if (!state.started) return; // 上映前の選択が済むまでは、作品を選ぶだけで再生しない
    const v = bestVideo(film);
    if (v && !broken.has(film.id)) {
      if (state.everPlayed) hideOverlay();
      else showOverlay(h('p', { class: 'small' }, t('loadingVideo')));
      loadVideo(v.vid);
    } else {
      if (playerReady) player.stopVideo();
      showOverlay(
        h('p', { class: 'big' }, film.title),
        h('p', { class: 'small' }, broken.has(film.id) ? t('cantPlayShort') : film.videos[0] ? t('skippedKind') : t('noEmbed')),
        h('p', {}, ext(`https://www.youtube.com/results?search_query=${encodeURIComponent(film.title + ' ' + film.director)}`, t('searchYT'))),
        h('p', { class: 'small' }, t('movingOn')),
      );
      timer = setTimeout(next, 12000);
    }
  }

  function step(dir) {
    const list = state.order;
    const n = list.length;
    const i = list.indexOf(state.current);
    for (let k = 1; k <= n; k++) {
      const j = i + dir * k;
      if (state.scope && (j < 0 || j >= n)) break; // 紹介者のリストは端で次の人へ
      const f = list[((j % n) + n) % n];
      if (f && playable(f)) return f;
    }
    return null;
  }
  function next() {
    let f = step(1);
    if (!f && state.scope) {
      // この人のリストが終わった → 次の紹介者のリストへ
      const cs = [...curators.values()];
      const i = cs.indexOf(state.scope);
      for (let k = 1; k <= cs.length && !f; k++) {
        const c = cs[(i + k) % cs.length];
        const first = c.picks.map((p) => p.film).find(playable);
        if (first) { setScope(c, false); f = first; }
      }
    }
    if (f) show(f);
    else showOverlay(h('p', { class: 'big' }, t('nothing')), h('p', { class: 'small' }, t('nothingHint')));
  }
  function prev() { const f = step(-1); if (f) show(f); }

  // ---------------------------------------------------------------- render
  // 日本語表示では日本語名を主に、英語表示では英語名だけを出す
  const curatorLabel = (c) => (lang === 'ja' && c.jpName) || c.name;
  const curatorAlt = (c) => (lang === 'ja' && c.jpName && c.jpName !== c.name ? c.name : '');
  const kindTag = (v) => h('span', { class: 'tag ' + KIND[v.kind].cls }, t('kind_' + v.kind));
  const sourceLink = (c, prefix = '') => ext(c.source.url, prefix + loc(c.source.label)) || h('span', { class: 'role' }, loc(c.source.label));

  function curatorLine(c) {
    return h('li', { class: 'who' },
      h('button', { type: 'button', title: t('playList'), onclick: () => setScope(c, true) }, curatorLabel(c)),
      curatorAlt(c) ? h('span', { class: 'role' }, curatorAlt(c)) : null,
      c.handle ? h('span', { class: 'role' }, c.handle) : null,
      h('span', { class: 'role' }, loc(c.role)),
      sourceLink(c),
    );
  }

  function renderInfo() {
    const f = state.current;
    if (!f) return;
    const v = bestVideo(f) || f.videos[0];
    const info = $('#info');
    const ja = lang === 'ja';
    const watch = [];
    if (v) watch.push(h('li', {}, ext(v.url, t('watchNow')), ' ', kindTag(v)));
    for (const l of f.official) watch.push(h('li', {}, t('official'), ext(l.url, l.label)));
    for (const l of f.other) watch.push(h('li', {}, t('other'), ext(l.url, l.label)));
    if (f.offline) watch.push(h('li', {}, t('physical'), f.offline));
    for (const l of f.related) watch.push(h('li', {}, ext(l.url, l.label)));
    if (!watch.length) watch.push(h('li', { class: 'notes' }, t('noWatch')));

    fill(info,
      h('p', { class: 'eyebrow' },
        [f.year, f.country, f.length].filter(Boolean).join(' · '),
        v ? kindTag(v) : h('span', { class: 'tag warn' }, t('noVideo'))),
      h('h1', {}, f.title),
      ja && f.jpTitle && f.jpTitle !== f.title ? h('p', { class: 'jp' }, f.jpTitle) : null,
      h('p', { class: 'director' }, t('directedBy'), f.director || t('unknown'), ja && f.jpDirector ? h('small', {}, f.jpDirector) : null),
      h('div', { class: 'cols' },
        h('section', {},
          h('h2', {}, t('pickedBy', f.picks.length)),
          h('ul', {}, f.picks.length ? f.picks.map((p) => curatorLine(p.curator)) : h('li', { class: 'notes' }, t('indexOnly')))),
        h('section', {},
          h('h2', {}, t('watchHeading')),
          h('ul', {}, watch),
          f.notes ? h('p', { class: 'notes' }, loc(f.notes)) : null)),
    );
    info.scrollTop = 0;
  }

  function rowMark(f) {
    if (broken.has(f.id)) return t('markBroken');
    const v = bestVideo(f);
    if (!v) return f.videos.length ? (f.videos.some((x) => x.kind === 'clip') ? t('markClipOnly') : t('markDoubt')) : t('noVideo');
    return v.kind === 'clip' ? t('markClip') : v.kind === 'doubt' ? t('markDoubt') : '';
  }

  function filmRow(f, lead) {
    const mark = rowMark(f);
    const who = f.picks.map((p) => [p.curator.jpName, p.curator.name, p.curator.handle].join(' ')).join(' ');
    return h('button', {
      type: 'button', class: 'row' + (playable(f) ? '' : ' off'), 'data-id': f.id,
      'data-q': [f.title, f.jpTitle, f.director, f.jpDirector, f.year, f.country, who].join(' ').toLowerCase(),
      onclick: () => show(f),
    },
    h('span', { class: 'y' }, lead ?? f.year ?? '—'),
    h('span', {}, h('span', { class: 't' }, f.title),
      h('span', { class: 'd' }, [f.director, lang === 'ja' ? f.jpTitle : ''].filter(Boolean).join(' ／ '))),
    h('span', { class: 'm' }, mark ? mark + ' ' : '', f.picks.length > 1 ? h('span', { class: 'n', title: t('nPeople', f.picks.length) }, '×' + f.picks.length) : ''));
  }

  function renderList() {
    const list = $('#list');
    const scopeBox = $('#scope');
    if (state.tab === 'people') {
      scopeBox.hidden = true;
      const fest = [...curators.values()].filter((c) => c.kind === 'festival');
      const extra = [...curators.values()].filter((c) => c.kind === 'extra');
      const row = (c) => h('button', {
        type: 'button', class: 'row' + (c === state.scope ? ' cur' : ''),
        'data-q': [c.name, c.jpName, c.handle, c.role && c.role.ja, c.role && c.role.en, loc(c.role)].join(' ').toLowerCase(),
        onclick: () => setScope(c, true),
      },
      h('span', { class: 'y' }, t('nFilms', c.picks.length)),
      h('span', {}, h('span', { class: 't' }, [curatorLabel(c), curatorAlt(c), c.handle].filter(Boolean).join(' ')),
        h('span', { class: 'd' }, loc(c.role))),
      h('span', { class: 'm' }));
      fill(list,
        h('div', { class: 'group' }, t('groupFest', fest.length)), fest.map(row),
        extra.length ? h('div', { class: 'group' }, t('groupExtra')) : null, extra.map(row),
      );
    } else {
      const c = state.scope;
      scopeBox.hidden = !c;
      if (c) {
        fill(scopeBox,
          h('div', { class: 'name' }, [curatorLabel(c), curatorAlt(c) && '/ ' + curatorAlt(c), c.handle].filter(Boolean).join(' ')),
          h('p', { class: 'role' }, loc(c.role)),
          c.note ? h('p', { class: 'note' }, loc(c.note)) : null,
          h('div', { class: 'links' }, sourceLink(c, t('sourcePrefix')), Object.entries(c.links).map(([k, u]) => ext(u, k))),
          h('button', { type: 'button', onclick: () => setScope(null, false) }, t('back')),
        );
      }
      list.replaceChildren(...state.order.map((f, i) => filmRow(f, c ? String(i + 1).padStart(2, '0') : undefined)));
    }
    applySearch();
    markRows(true);
  }

  function applySearch() {
    const q = $('#search').value.trim().toLowerCase();
    for (const el of $('#list').querySelectorAll('.row')) el.hidden = !!q && !el.dataset.q.includes(q);
  }

  function markRows(scroll) {
    const cur = state.current;
    for (const el of $('#list').querySelectorAll('.row[data-id]')) {
      const f = films.get(el.dataset.id);
      const on = f === cur;
      el.classList.toggle('cur', on);
      el.classList.toggle('off', !playable(f));
      if (on && scroll) {
        // scrollIntoView だと狭い画面でページ全体が動いてしまうので、リストの中だけを動かす
        const box = $('#list');
        const top = el.offsetTop - box.offsetTop;
        if (top < box.scrollTop || top + el.offsetHeight > box.scrollTop + box.clientHeight) {
          box.scrollTop = top - box.clientHeight / 2 + el.offsetHeight / 2;
        }
      }
    }
    const inScope = state.scope && new Set(state.scope.picks.map((p) => p.film));
    for (const el of $('#tl').querySelectorAll('button')) {
      const f = films.get(el.dataset.id);
      el.classList.toggle('cur', f === cur);
      el.classList.toggle('off', !playable(f));
      el.classList.toggle('dim', !!inScope && !inScope.has(f));
    }
  }

  function renderTimeline() {
    const byYear = new Map();
    let lo = 1906, hi = 2026;
    for (const f of films.values()) {
      if (!f.year) continue;
      lo = Math.min(lo, f.year); hi = Math.max(hi, f.year);
      if (!byYear.has(f.year)) byYear.set(f.year, []);
      byYear.get(f.year).push(f);
    }
    const max = Math.max(1, ...[...byYear.values()].map((a) => a.length));
    const tl = $('#tl'), axis = $('#tlAxis');
    tl.style.setProperty('--cell', Math.max(1, Math.min(6, Math.floor(60 / max) - 1)) + 'px');
    const cols = [], ticks = [];
    for (let y = lo; y <= hi; y++) {
      const fs = (byYear.get(y) || []).sort((a, b) => b.picks.length - a.picks.length);
      cols.push(h('div', { class: 'col' }, fs.map((f) => h('button', {
        type: 'button', 'data-id': f.id, class: f.picks.length >= 5 ? 'p3' : f.picks.length >= 2 ? 'p2' : '',
        title: t('tlTitle', f), 'aria-label': `${f.year} ${f.title}`,
        onclick: () => { if (state.scope && !state.scope.picks.some((p) => p.film === f)) setScope(null, false); show(f); },
      }))));
      // 狭い画面では 20年ごと（major）だけを残す
      ticks.push(h('span', { class: y % 20 === 0 ? 'major' : '' }, y % 10 === 0 ? String(y) : ''));
    }
    tl.replaceChildren(...cols);
    axis.replaceChildren(...ticks);
  }

  function updateCounter() {
    const list = state.order.filter(playable);
    const i = list.indexOf(state.current);
    const where = state.scope ? t('whereScope', curatorLabel(state.scope)) : t('whereAll', films.size);
    $('#counter').textContent = `${where} ・ ${t('playing')} ${i >= 0 ? i + 1 : '–'} / ${list.length}`;
  }

  function refresh() {
    state.order = computeOrder();
    renderList();
    updateCounter();
  }

  function setScope(c, play) {
    state.scope = c;
    state.tab = 'films';
    setTabs();
    $('#search').value = '';
    refresh();
    if (play && c) {
      const first = state.order.find(playable) || state.order[0];
      if (first) show(first);
    }
  }

  function setTabs() {
    $('#tabFilms').setAttribute('aria-selected', String(state.tab === 'films'));
    $('#tabPeople').setAttribute('aria-selected', String(state.tab === 'people'));
  }

  function renderCredits() {
    for (const el of document.querySelectorAll('.sheetLink')) el.href = SHEET_URL;
    for (const el of document.querySelectorAll('.dataFrom')) el.textContent = !dataFrom ? '' : dataFrom === 'snapshot' ? t('fromSnapshot') : t('fromLive');
    const extras = [...curators.values()].filter((c) => c.kind === 'extra');
    for (const el of document.querySelectorAll('.extraCredits')) {
      fill(el, extras.length
        ? extras.map((c) => h('div', {}, `${c.name} ${c.handle} — `, ext(c.source.url, loc(c.source.label)) || loc(c.source.label)))
        : t('none'));
    }
  }

  // HTML に書いた data-t 系の属性へ、いまの言語の文言を入れる
  function applyStatic() {
    document.documentElement.lang = lang;
    $('#lang').value = lang;
    for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
    for (const el of document.querySelectorAll('[data-t-title]')) el.title = t(el.dataset.tTitle);
    for (const el of document.querySelectorAll('[data-t-ph]')) el.placeholder = t(el.dataset.tPh);
    for (const el of document.querySelectorAll('[data-t-aria]')) el.setAttribute('aria-label', t(el.dataset.tAria));
  }

  function setLang(l) {
    lang = l;
    store.set('lang', l);
    applyStatic();
    renderCredits();
    if (!films.size) return;
    renderTimeline();
    refresh();
    renderInfo();
    if (!state.started) renderGate();
  }

  // ---------------------------------------------------------------- wiring
  function wire() {
    const order = $('#order'), clips = $('#clips'), doubt = $('#doubt');
    order.value = state.mode; clips.checked = state.clips; doubt.checked = state.doubt;
    order.addEventListener('change', () => { state.mode = order.value; store.set('mode', state.mode); if (state.scope) setScope(null, false); else refresh(); });
    clips.addEventListener('change', () => { state.clips = clips.checked; store.set('clips', state.clips); refresh(); });
    doubt.addEventListener('change', () => { state.doubt = doubt.checked; store.set('doubt', state.doubt); refresh(); });
    $('#lang').addEventListener('change', (e) => setLang(e.target.value));
    $('#next').addEventListener('click', next);
    $('#prev').addEventListener('click', prev);
    $('#tabFilms').addEventListener('click', () => { state.tab = 'films'; setTabs(); renderList(); });
    $('#tabPeople').addEventListener('click', () => { state.tab = 'people'; setTabs(); renderList(); });
    $('#search').addEventListener('input', applySearch);
    $('#aboutBtn').addEventListener('click', () => $('#about').showModal());
    window.addEventListener('hashchange', () => {
      let id = '';
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const f = films.get(id);
      if (f && f !== state.current) show(f);
    });
    document.addEventListener('keydown', (e) => {
      // キー操作は YouTube のプレーヤーと同じ。作品の切り替えはキーではしない
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (!playerReady || !state.started || $('#about').open) return;
      // 連打すると getCurrentTime がまだ前の位置を返すので、直前のシーク先を起点にして積み上げる
      const seek = (d) => {
        const now = Date.now();
        const base = now - lastSeek.at < 1000 ? lastSeek.to : player.getCurrentTime();
        lastSeek = { at: now, to: Math.max(0, base + d) };
        player.seekTo(lastSeek.to, true);
      };
      const vol = (d) => { if (d > 0 && state.muted) setMuted(false); player.setVolume(Math.max(0, Math.min(100, player.getVolume() + d))); };
      const keys = {
        ' ': () => (player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo()),
        k: () => keys[' '](),
        ArrowLeft: () => seek(-5), ArrowRight: () => seek(5),
        j: () => seek(-10), l: () => seek(10),
        ArrowUp: () => vol(5), ArrowDown: () => vol(-5),
        m: () => setMuted(!player.isMuted()),
      };
      const run = keys[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!run) return;
      e.preventDefault();
      // ボタンにフォーカスが残っていると Space がそのボタンを押してしまうので外す
      if (e.target.tagName === 'BUTTON') e.target.blur();
      run();
    });
  }

  async function init() {
    applyStatic();
    wire();
    try {
      const [picks, people, extra] = await Promise.all([
        loadCsv('data/booklet/all-picks.csv', 'All picks'),
        loadCsv('data/booklet/participants.csv', 'Participants'),
        loadLists(),
      ]);
      dataFrom = picks.from;
      buildPeople(people.text);
      buildPicks(picks.text);
      buildExtra(extra);
      if (!films.size) throw new Error(t('noFilms'));
    } catch (err) {
      showOverlay(h('p', { class: 'big' }, t('dataErr')), h('p', { class: 'small' }, String(err.message || err)),
        h('p', {}, ext(SHEET_URL, t('openSheet'))));
      return;
    }
    renderCredits();
    renderTimeline();
    refresh();

    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.append(s);

    let wanted = '';
    try { wanted = decodeURIComponent(location.hash.slice(1)); } catch { /* 壊れたハッシュは無視 */ }
    const start = films.get(wanted) || films.get(store.get('last', '')) || null;
    show(start && playable(start) ? start : state.order.find(playable) || state.order[0]);
    openGate();
  }

  init();
})();
