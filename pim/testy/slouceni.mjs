// DVA LIDÉ NA JEDNOM SOUBORU: SLOUČENÍ MÍSTO PŘEPSÁNÍ.
//
// Soubor na GitHubu je jediné trvalé úložiště dat, takže souběh dvou lidí je
// normální provoz, ne výjimka. Dřív vyhrál ten, kdo ukládal jako druhý — a cizí
// práce zmizela bez hlásky. Tahle sada hlídá obojí: že se posílá sha, ze které
// jsme vyšli (jinak se celá ochrana vypne), a že sloučení **jen přidává**.
//
// Většina kontrol jede přímo na `slucDb()`, protože je to čistá funkce. Celé
// kolečko s GitHubem se testuje přes podvrženou `GH._api` — opravdový server
// by do testu přinesl síť a tím i nejistotu.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Sloučení dvou verzí');
const { prohlizec, stranka } = await otevriAplikaci(s);

// Pomocníci uvnitř stránky: entita a databáze o pár polích.
await stranka.evaluate(() => {
  window.__E = (o) => Object.assign({
    id: o.id, title: o.title || o.id, aspects: ['Note'], attributes: {}, tags: [],
    body: '', links: [], attachments: [], comments: [], annotations: [],
    created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z'
  }, o);
  window.__D = (ents, extra) => Object.assign({
    schemaVersion: 2, title: 'T', description: '', entities: ents,
    tags: [], savedViews: [], customTemplates: [], customAspects: [], ghMeta: {}
  }, extra || {});
});

// Spustí sloučení a vrátí jen to, co nás zajímá.
const sluc = (telo) => stranka.evaluate(telo);

nadpis('Kde každý sáhl jinam, zůstane obojí');
ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a' })]),
    __D([__E({ id: 'a' }), __E({ id: 'moje' })]),
    __D([__E({ id: 'a' }), __E({ id: 'jejich' })]));
  return v.db.entities.map(e => e.id).sort().join(',') + '|' + v.spory.length;
})) === 'a,jejich,moje|0', 'každý jinou entitu → obojí zůstane, bez sporu');

ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a', attributes: { x: '1' } })]),
    __D([__E({ id: 'a', attributes: { x: '1', moje: 'M' } })]),
    __D([__E({ id: 'a', attributes: { x: '1', jejich: 'J' } })]));
  const a = v.db.entities[0].attributes;
  return [a.x, a.moje, a.jejich, v.spory.length].join(',');
})) === '1,M,J,0', 'každý jiný atribut téže entity → obojí zůstane');

ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a' }), __E({ id: 'b' }), __E({ id: 'c' })]),
    __D([__E({ id: 'a', links: [{ to: 'b', type: 'partOf' }] }), __E({ id: 'b' }), __E({ id: 'c' })]),
    __D([__E({ id: 'a', links: [{ to: 'c', type: 'mentions' }] }), __E({ id: 'b' }), __E({ id: 'c' })]));
  return v.db.entities[0].links.map(l => l.type + '→' + l.to).sort().join(',') + '|' + v.spory.length;
})) === 'mentions→c,partOf→b|0',
  'každý jinou vazbu → obojí zůstane; vazba se pozná dvojicí typ+cíl, ne indexem');

ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a', comments: [{ id: 'c1', content: 'první' }] })]),
    __D([__E({ id: 'a', comments: [{ id: 'c1', content: 'první' }, { id: 'c2', content: 'můj' }] })]),
    __D([__E({ id: 'a', comments: [{ id: 'c1', content: 'první' }, { id: 'c3', content: 'jejich' }] })]));
  return v.db.entities[0].comments.map(c => c.id).sort().join(',');
})) === 'c1,c2,c3', 'komentáře se slučují podle id');

ok(s, (await sluc(() => {
  const R = (rid, v2) => ({ _rid: rid, pole: v2 });
  const v = slucDb(__D([__E({ id: 'a', attributes: { db_records: [R('r1', 'A')] } })]),
    __D([__E({ id: 'a', attributes: { db_records: [R('r1', 'A'), R('r2', 'moje')] } })]),
    __D([__E({ id: 'a', attributes: { db_records: [R('r1', 'A'), R('r3', 'jejich')] } })]));
  return v.db.entities[0].attributes.db_records.map(r => r._rid).sort().join(',');
})) === 'r1,r2,r3', 'řádky databáze se slučují podle _rid — nikdo nepřijde o svoje řádky');

const tagy = await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a', tags: ['x', 'y'], aspects: ['Note'] })]),
    __D([__E({ id: 'a', tags: ['x', 'y', 'moje'], aspects: ['Note', 'Task'] })]),
    __D([__E({ id: 'a', tags: ['y', 'jejich'], aspects: ['Note'] })]));
  return { tagy: v.db.entities[0].tags.slice().sort().join(','), aspekty: v.db.entities[0].aspects.slice().sort().join(',') };
});
ok(s, tagy.tagy === 'jejich,moje,y' && tagy.aspekty === 'Note,Task',
  'tagy a aspekty množinově: přírůstky obou stran zůstanou, odebrání druhého platí', tagy);

nadpis('Kde sáhli oba, vyhraje ukládající — a řekne se to');
const spor = await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a', title: 'Původní' })]),
    __D([__E({ id: 'a', title: 'Moje' })]),
    __D([__E({ id: 'a', title: 'Jejich' })]));
  return { title: v.db.entities[0].title, spory: v.spory };
});
ok(s, spor.title === 'Moje', 'moje hodnota vyhrála', spor);
ok(s, spor.spory.length === 1 && spor.spory[0].co === 'title',
  'a spor je vypsaný i s názvem pole', spor.spory);

ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a', updated_at: '2026-01-01T00:00:00.000Z' })]),
    __D([__E({ id: 'a', updated_at: '2026-02-01T00:00:00.000Z' })]),
    __D([__E({ id: 'a', updated_at: '2026-03-01T00:00:00.000Z' })]));
  return v.db.entities[0].updated_at + '|' + v.spory.length;
})) === '2026-03-01T00:00:00.000Z|0',
  'updated_at není změna, jen razítko — bere se novější a spor z něj nevzniká');

ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a', attributes: { x: '1', y: '2' } })]),
    __D([__E({ id: 'a', attributes: { x: '1', y: '2' } })]),
    __D([__E({ id: 'a', attributes: { y: '2', x: '1' } })]));
  return v.spory.length;
})) === 0, 'jiné pořadí klíčů v JSONu není spor');

nadpis('Smazat smí jen ten, koho se druhý nedotkl');
ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a' }), __E({ id: 'b' })]),
    __D([__E({ id: 'a' }), __E({ id: 'b' })]),
    __D([__E({ id: 'a' })]));
  return v.db.entities.map(e => e.id).join(',') + '|' + v.ozivene.length;
})) === 'a|0', 'druhý smazal, já se nedotkl → smazání platí');

const oziv = await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a' }), __E({ id: 'b', title: 'B' })]),
    __D([__E({ id: 'a' }), __E({ id: 'b', title: 'B upravené' })]),
    __D([__E({ id: 'a' })]));
  return { ids: v.db.entities.map(e => e.id).join(','), ozivene: v.ozivene };
});
ok(s, oziv.ids === 'a,b', 'druhý smazal, já upravil → entita zůstane', oziv);
ok(s, oziv.ozivene.length === 1, 'a řekne se to', oziv.ozivene);

ok(s, (await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a' }), __E({ id: 'b' })]),
    __D([__E({ id: 'a', links: [{ to: 'b', type: 'partOf' }] }), __E({ id: 'b' })]),
    __D([__E({ id: 'a' })]));
  return JSON.stringify(v.db.entities.map(e => ({ id: e.id, v: (e.links || []).length })));
})) === '[{"id":"a","v":0}]',
  'po sloučení nezůstane vazba na entitu, kterou druhý smazal');

nadpis('Bez základu je ze sloučení sjednocení');
ok(s, (await sluc(() => {
  const v = slucDb(null,
    __D([__E({ id: 'a' }), __E({ id: 'moje' })]),
    __D([__E({ id: 'a' }), __E({ id: 'jejich' })]));
  return v.db.entities.map(e => e.id).sort().join(',');
})) === 'a,jejich,moje',
  'nic se nesmaže a při střetu vyhraje ukládající — proto se sloučení nemusí ptát');

nadpis('Čísla entit: z duplicity by vznikl odkaz na dvě věci');
const cisla = await sluc(() => {
  const v = slucDb(__D([__E({ id: 'a', numericId: 1 })]),
    __D([__E({ id: 'a', numericId: 1 }), __E({ id: 'm', numericId: 42, title: 'Moje' })]),
    __D([__E({ id: 'a', numericId: 1 }), __E({ id: 'j', numericId: 42, title: 'Jejich' })]));
  return { cisla: v.db.entities.map(e => e.id + '#' + e.numericId).join(' '), spory: v.spory.length };
});
ok(s, /m#42/.test(cisla.cisla) && /j#43/.test(cisla.cisla),
  'moje číslo zůstane (mohu na něj mít odkaz #42 v textu), přečísluje se to příchozí', cisla);
ok(s, cisla.spory === 1, 'a přečíslování se vypíše', cisla);

nadpis('Celé kolečko s GitHubem (podvržená API vrstva)');
const kolecko = await stranka.evaluate(async () => {
  const log = [];
  const server = { sha: 'sha-1', commit: 'commit-1', obsah: null };
  const zaklDb = __D([__E({ id: 'a', title: 'Společná' })]);
  server.obsah = JSON.parse(JSON.stringify(zaklDb));
  state.settings.github = { owner: 'o', repo: 'r', path: 'pim.json', branch: 'main' };
  GH.setToken('token');
  GH._api = async (method, path, body) => {
    log.push(method + ' ' + path.split('?')[0]);
    if (method === 'GET' && path.includes('/commits')) return [{ sha: server.commit }];
    if (method === 'GET' && path.includes('/contents/')) {
      return { sha: server.sha, size: 100, content: GH._utf8ToB64(JSON.stringify(server.obsah)) };
    }
    if (method === 'PUT' && path.includes('/contents/')) {
      if ((body.sha || null) !== server.sha) { const e = new Error('Conflict'); e.status = 409; throw e; }
      server.obsah = JSON.parse(new TextDecoder().decode(
        Uint8Array.from(atob(body.content), c => c.charCodeAt(0))));
      server.sha = 'sha-' + Math.random().toString(36).slice(2, 7);
      server.commit = 'commit-' + Math.random().toString(36).slice(2, 7);
      return { content: { sha: server.sha }, commit: { sha: server.commit } };
    }
    throw new Error('neočekávané volání ' + method);
  };
  const out = {};

  await GH.downloadAndLoad(true);
  out.poNacteni = { zaklad: !!ghZaklad(), neodeslane: _ghNeodeslaneZmeny, sha: db.ghMeta.sha === server.sha };

  // Běžné uložení
  log.length = 0;
  db.entities.push(__E({ id: 'moje', title: 'Moje nová' }));
  save();
  out.priznakPoZmene = _ghNeodeslaneZmeny;
  await GH.upload();
  out.beznaUloha = {
    getContentsPredZapisem: log.filter(l => l === 'GET /repos/o/r/contents/pim.json').length,
    naServeru: server.obsah.entities.map(e => e.id).sort().join(','),
    neodeslane: _ghNeodeslaneZmeny,
    zakladMaMoji: !!(ghZaklad().entities || []).find(e => e.id === 'moje')
  };

  // Souběh: druhý uložil mezitím
  server.obsah = JSON.parse(JSON.stringify(server.obsah));
  server.obsah.entities.push(__E({ id: 'cizi', title: 'Cizí nová' }));
  server.sha = 'sha-cizi'; server.commit = 'commit-cizi';
  db.entities.push(__E({ id: 'moje2', title: 'Moje druhá' }));
  save();
  log.length = 0;
  out.soubeh = { uspech: await GH.upload() };
  out.soubeh.naServeru = server.obsah.entities.map(e => e.id).sort().join(',');
  out.soubeh.vPameti = db.entities.map(e => e.id).sort().join(',');
  out.soubeh.pokusyPut = log.filter(l => l.startsWith('PUT')).length;

  // Cizí commit přitéká sám
  server.obsah = JSON.parse(JSON.stringify(server.obsah));
  server.obsah.entities.push(__E({ id: 'cizi2', title: 'Od kolegy' }));
  server.sha = 'sha-cizi2'; server.commit = 'commit-cizi2';
  out.polling = { slouceno: await zkontrolujVzdalene(), maCizi2: !!findEntity('cizi2') };
  out.pollingZnovu = await zkontrolujVzdalene();

  // Vlastní commit se nesmí tvářit jako cizí
  db.entities.push(__E({ id: 'moje3' }));
  save();
  await GH.upload();
  out.vlastniCommit = { sloucilSeSamSeSebou: await zkontrolujVzdalene(), znamyJeNas: _ghZnamyCommit === server.commit };
  return out;
});

ok(s, kolecko.poNacteni.zaklad && kolecko.poNacteni.sha && kolecko.poNacteni.neodeslane === false,
  'načtení nastaví základ i sha a shodí příznak neodeslaných změn', kolecko.poNacteni);
ok(s, kolecko.priznakPoZmene === true, 'změna příznak zvedne');
ok(s, kolecko.beznaUloha.getContentsPredZapisem === 0,
  'před zápisem se NEnačítá čerstvá sha — tím by se celá ochrana vypnula', kolecko.beznaUloha);
ok(s, kolecko.beznaUloha.naServeru === 'a,moje' && kolecko.beznaUloha.neodeslane === false,
  'běžné uložení projde a příznak se shodí', kolecko.beznaUloha);
ok(s, kolecko.beznaUloha.zakladMaMoji,
  'novým základem je to, co jsme odeslali', kolecko.beznaUloha);
ok(s, kolecko.soubeh.uspech === true && kolecko.soubeh.pokusyPut === 2,
  'odmítnutý zápis se po sloučení zkusí znovu', kolecko.soubeh);
ok(s, kolecko.soubeh.naServeru === 'a,cizi,moje,moje2',
  'na serveru je po souběhu práce obou lidí — nic se nepřepsalo', kolecko.soubeh);
ok(s, kolecko.soubeh.vPameti === 'a,cizi,moje,moje2',
  'a v paměti taky', kolecko.soubeh);
ok(s, kolecko.polling.slouceno === true && kolecko.polling.maCizi2,
  'cizí commit se slije sám', kolecko.polling);
ok(s, kolecko.pollingZnovu === false, 'druhá kontrola bez nového commitu nic nedělá');
ok(s, kolecko.vlastniCommit.sloucilSeSamSeSebou === false && kolecko.vlastniCommit.znamyJeNas,
  'vlastní commit se netváří jako cizí — aplikace se neslučuje sama se sebou', kolecko.vlastniCommit);

nadpis('Změna během nahrávání: nahrávání trvá, uživatel pracuje dál');
// Nahrávání celého souboru může u větší báze trvat i desítky sekund. Snímek obsahu
// se bere na začátku zápisu, takže změna provedená během něj v odeslaných datech
// není. Tři věci se na tom dřív rozbily: změnu nikdo nenaplánoval k odeslání
// (autosave má v té době plánování zakázané), příznak „vše odesláno" lhal,
// a nejbližší cizí commit tu změnu tiše zahodil. Čtvrtá chyba přišla s opravou:
// `upload()` si volá `save()` sám, takže si označil „změna během nahrávání"
// a řetězil commity bez konce.
const behem = await stranka.evaluate(async () => {
  const server = { sha: 'sha-1', commit: 'c-1', obsah: __D([__E({ id: 'a' })]) };
  state.settings.github = { owner: 'o', repo: 'r', path: 'pim.json', branch: 'main' };
  GH.setToken('t');
  let putu = 0;
  GH._api = async (method, path, body) => {
    if (method === 'GET' && path.includes('/commits')) return [{ sha: server.commit }];
    if (method === 'GET' && path.includes('/contents/'))
      return { sha: server.sha, size: 10, content: GH._utf8ToB64(JSON.stringify(server.obsah)) };
    if (method === 'PUT') {
      putu++;
      await new Promise(z => setTimeout(z, 400));      // „nahrávání trvá"
      if ((body.sha || null) !== server.sha) { const e = new Error('c'); e.status = 409; throw e; }
      server.obsah = JSON.parse(new TextDecoder().decode(
        Uint8Array.from(atob(body.content), c => c.charCodeAt(0))));
      server.sha = 'sha-' + putu; server.commit = 'c-' + putu;
      return { content: { sha: server.sha }, commit: { sha: server.commit } };
    }
    throw new Error('?');
  };
  await GH.downloadAndLoad(true);
  state.settings.autosaveGhSeconds = 1;
  if (!_autosaveGhEnabled) toggleAutosaveGh();

  const out = {};
  db.entities.push(__E({ id: 'prvni' }));
  save();
  await new Promise(z => setTimeout(z, 1100));         // autosave rozjel zápis
  out.beziZapis = window._autosaveSkip === true;
  db.entities.push(__E({ id: 'druha' }));              // změna uprostřed zápisu
  save();
  await new Promise(z => setTimeout(z, 1200));
  out.hnedPoZapisu = {
    naServeru: server.obsah.entities.map(e => e.id).sort().join(','),
    priznak: _ghNeodeslaneZmeny,
    naplanovano: _autosaveGhTimer !== null
  };
  await new Promise(z => setTimeout(z, 2200));         // doběhový zápis
  out.poDobehu = {
    naServeru: server.obsah.entities.map(e => e.id).sort().join(','),
    priznak: _ghNeodeslaneZmeny,
    putu: putu
  };
  const putuTed = putu;
  await new Promise(z => setTimeout(z, 2500));
  out.klid = { stejnePocty: putu === putuTed, naplanovano: _autosaveGhTimer !== null };

  // Cizí commit nesmí změnu z doby nahrávání zahodit — zkusíme to v obou stavech.
  db.entities.push(__E({ id: 'treti' }));
  save();
  server.obsah = JSON.parse(JSON.stringify(server.obsah));
  server.obsah.entities.push(__E({ id: 'cizi' }));
  server.sha = 'sha-cizi'; server.commit = 'c-cizi';
  await slucSVzdalenym({ tiche: true });
  out.poCizim = { vPameti: db.entities.map(e => e.id).sort().join(',') };
  if (_autosaveGhEnabled) toggleAutosaveGh();
  // Uklidit po sobě: zkrácený interval byl jen pro tenhle test, ať neovlivní
  // kontrolu výchozí hodnoty níž.
  delete state.settings.autosaveGhSeconds;
  return out;
});
ok(s, behem.beziZapis, 'zápis v okamžiku druhé změny opravdu běžel', behem);
ok(s, behem.hnedPoZapisu.naServeru === 'a,prvni',
  'odeslal se snímek z začátku zápisu — druhá změna v něm není', behem.hnedPoZapisu);
ok(s, behem.hnedPoZapisu.priznak === true,
  'příznak neodeslaných změn zůstal — jinak by lhal', behem.hnedPoZapisu);
ok(s, behem.hnedPoZapisu.naplanovano === true,
  'a doběhový zápis je naplánovaný, takže změnu někdo odešle', behem.hnedPoZapisu);
ok(s, behem.poDobehu.naServeru === 'a,druha,prvni' && behem.poDobehu.priznak === false,
  'doběhový zápis změnu z doby nahrávání dopraví na server', behem.poDobehu);
ok(s, behem.poDobehu.putu === 2, 'a stačily na to dva zápisy, ne víc', behem.poDobehu);
ok(s, behem.klid.stejnePocty && behem.klid.naplanovano === false,
  'pak je klid — vlastní save uploadu neřetězí commity bez konce', behem.klid);
ok(s, behem.poCizim.vPameti === 'a,cizi,druha,prvni,treti',
  'cizí commit nezahodí neodeslanou změnu — slučuje se, nepřepisuje vcelku', behem.poCizim);

nadpis('Kanárci: sloučení nesmí ztratit obsah entit');
const kanarci = await stranka.evaluate(() => {
  const v = slucDb(
    __D([__E({ id: 'k1', body: 'KANAREK-TELO', attributes: { pozn: 'KANAREK-ATRIBUT' },
      comments: [{ id: 'c1', content: 'KANAREK-KOMENTAR' }] }), __E({ id: 'k2', body: 'KANAREK-DRUHY' })]),
    __D([__E({ id: 'k1', body: 'KANAREK-TELO', attributes: { pozn: 'KANAREK-ATRIBUT' },
      comments: [{ id: 'c1', content: 'KANAREK-KOMENTAR' }] }), __E({ id: 'k2', body: 'KANAREK-DRUHY' }),
      __E({ id: 'novy', title: 'Novinka' })]),
    __D([__E({ id: 'k1', body: 'KANAREK-TELO', attributes: { pozn: 'KANAREK-ATRIBUT', jejich: 'X' },
      comments: [{ id: 'c1', content: 'KANAREK-KOMENTAR' }] }), __E({ id: 'k2', body: 'KANAREK-DRUHY' })]));
  const t = JSON.stringify(v.db);
  return {
    telo: t.includes('KANAREK-TELO'), atribut: t.includes('KANAREK-ATRIBUT'),
    komentar: t.includes('KANAREK-KOMENTAR'), druhy: t.includes('KANAREK-DRUHY'),
    novy: !!v.db.entities.find(e => e.id === 'novy'),
    jejich: v.db.entities[0].attributes.jejich === 'X',
    spory: v.spory.length
  };
});
ok(s, kanarci.telo && kanarci.atribut && kanarci.komentar && kanarci.druhy,
  'všechny značky v nedotčených místech přežily', kanarci);
ok(s, kanarci.novy && kanarci.jejich && kanarci.spory === 0,
  'a přírůstky obou stran jsou v datech, bez sporu', kanarci);

nadpis('Zvuky: start nahrávání a úspěšné uložení musí znít jinak');
// Slyšet to v testu nejde, ale jde si odposlechnout, co se ve zvukové vrstvě
// naplánuje. Podvrhne se AudioContext a zapíše se každý oscilátor i jeho hlasitost.
// Bez toho se to jednou pokazilo: start nahrávání a úspěšné uložení vedly na týž
// tón, takže uživatel nepoznal, jestli se to posílá, nebo už je venku.
const zvuk = await stranka.evaluate(() => {
  const zaznam = [];
  const cas = 0;
  const fake = {
    get currentTime() { return cas; },
    createOscillator() {
      const o = { type: 'sine', detune: { value: 0 },
        frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} },
        connect() {}, start(t) { o._start = t; }, stop(t) { o._stop = t; } };
      zaznam.push(o);
      return o;
    },
    createGain() {
      const g = { gain: { _max: 0,
        setValueAtTime(v) { if (v > this._max) this._max = v; },
        linearRampToValueAtTime(v) { if (v > this._max) this._max = v; },
        exponentialRampToValueAtTime(v) { if (v > this._max) this._max = v; } }, connect() {} };
      if (zaznam.length) zaznam[zaznam.length - 1]._gain = g;
      return g;
    },
    createBiquadFilter() { return { type: '', Q: { value: 0 },
      frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; },
    destination: {}
  };
  const puvodni = window._audioCtx;
  window._audioCtx = () => fake;
  state.settings.audioFeedback = true;
  const zmer = (kind) => {
    zaznam.length = 0;
    playSound(kind);
    const t = zaznam.map(o => ({ hz: Math.round(o.frequency.value), konec: o._stop - cas,
      typ: o.type, hlasitost: o._gain ? o._gain.gain._max : 0 }));
    return { tonu: t.length,
      delkaMs: t.length ? Math.round(Math.max(...t.map(x => x.konec)) * 1000) : 0,
      hlasitost: t.length ? Math.max(...t.map(x => x.hlasitost)) : 0,
      hz: t.map(x => x.hz),
      typy: [...new Set(t.map(x => x.typ))] };
  };
  const out = {
    start: zmer('upload-start'),
    ulozeno: zmer('save-gh'),
    sync: zmer('sync'),
    lokalne: zmer('save'),
    chyba: zmer('error')
  };
  window._audioCtx = puvodni;
  return out;
});
// Na jediný rozměr se spoléhat nejde: dva krátké sinusové pipy o různé výšce
// uživatel vnímá jako týž zvuk — ověřeno v provozu, ne odhadem. Start a úspěch
// se proto musí lišit v **pěti** věcech zároveň.
ok(s, zvuk.start.tonu === 2 && zvuk.ulozeno.tonu === 3,
  '1. počet tónů: start dva rychlé tiky, úspěch tři', { start: zvuk.start.tonu, ulozeno: zvuk.ulozeno.tonu });
ok(s, zvuk.start.hz[0] === zvuk.start.hz[1] &&
     zvuk.ulozeno.hz[0] < zvuk.ulozeno.hz[1] && zvuk.ulozeno.hz[1] < zvuk.ulozeno.hz[2],
  '2. směr: start stojí na jedné výšce, úspěch stoupá', { start: zvuk.start.hz, ulozeno: zvuk.ulozeno.hz });
ok(s, Math.max.apply(null, zvuk.start.hz) < Math.min.apply(null, zvuk.ulozeno.hz),
  '3. registr: start je celý pod úspěchem — nepřekrývají se ani jedním tónem',
  { start: zvuk.start.hz, ulozeno: zvuk.ulozeno.hz });
ok(s, zvuk.start.typy.join(',') !== zvuk.ulozeno.typy.join(','),
  '4. barva tónu je jiná', { start: zvuk.start.typy, ulozeno: zvuk.ulozeno.typy });
ok(s, zvuk.ulozeno.hlasitost > zvuk.start.hlasitost * 2 && zvuk.ulozeno.delkaMs > zvuk.start.delkaMs * 2,
  '5. úspěch je víc než dvakrát hlasitější i delší',
  { start: [zvuk.start.hlasitost, zvuk.start.delkaMs], ulozeno: [zvuk.ulozeno.hlasitost, zvuk.ulozeno.delkaMs] });
ok(s, zvuk.start.hlasitost <= 0.04 && zvuk.start.delkaMs <= 140,
  'start je přitom pořád tichý a krátký — zní při každém autosave', zvuk.start);
ok(s, zvuk.chyba.hz[0] > zvuk.chyba.hz[1],
  'chyba naopak klesá', zvuk.chyba.hz);
ok(s, zvuk.sync.tonu === 2 && zvuk.sync.hlasitost < zvuk.ulozeno.hlasitost &&
     zvuk.sync.typy.join(',') !== zvuk.start.typy.join(','),
  'synchronizace se neplete ani se startem (jiná barva i registr), ani s uložením (tišší)',
  { sync: zvuk.sync, start: zvuk.start });
ok(s, zvuk.lokalne.tonu === 1 && zvuk.lokalne.delkaMs <= 120,
  'lokální uložení zůstává jeden krátký tón — zní při každé drobné úpravě', zvuk.lokalne);
ok(s, zvuk.ulozeno.delkaMs < 400,
  'i ten výraznější zvuk je pořád daleko od někdejšího modemu (800 ms)', zvuk.ulozeno.delkaMs);

nadpis('Průběh nahrávání se nepředčítá, chyba ano');
// `toast()` zapisuje i do `#status-region` (`aria-live="polite"`), takže každá
// bublina se odečítačem předčítá. „Nahrávám…" a „Uloženo (1,8 MB)" se při autosave
// opakují po čtyřech sekundách práce — informace, se kterou uživatel nic nedělá,
// nemá přerušovat čtení. Bublina zůstává vidět, do živé oblasti se nezapíše.
const hlaseni = await stranka.evaluate(() => {
  const reg = document.getElementById('status-region');
  const zmer = (fn) => {
    reg.textContent = '';
    fn();
    return { region: reg.textContent, bublina: (document.querySelector('.toast') || {}).textContent || '' };
  };
  return {
    nahravam: zmer(() => toast('Nahrávám na GitHub…', 100, { neohlasovat: true })),
    ulozeno: zmer(() => toast('✓ Uloženo na GitHub (1,8 MB).', 100, { neohlasovat: true })),
    chyba: zmer(() => toast('✗ Nahrání selhalo: síť není dostupná', 100)),
    bezneUlozeni: zmer(() => toast('✓ Entita uložena.', 100))
  };
});
ok(s, hlaseni.nahravam.region === '' && /Nahrávám/.test(hlaseni.nahravam.bublina),
  '„Nahrávám na GitHub…" je vidět v bublině, ale do živé oblasti nejde', hlaseni.nahravam);
ok(s, hlaseni.ulozeno.region === '' && /1,8 MB/.test(hlaseni.ulozeno.bublina),
  'totéž pro „Uloženo na GitHub (1,8 MB)"', hlaseni.ulozeno);
ok(s, /selhalo/.test(hlaseni.chyba.region),
  'chyba se ale předčítá — bez toho by uživatel odečítače nevěděl, že se něco nepovedlo',
  hlaseni.chyba);
ok(s, /uložena/.test(hlaseni.bezneUlozeni.region),
  'a běžné hlášky bez té volby se hlásí dál — ztišilo se jen hlášení o průběhu',
  hlaseni.bezneUlozeni);

nadpis('Zvuky a prodleva autosave');
const zvuky = await stranka.evaluate(() => ({
  sekundy: getAutosaveSeconds(),
  mamFunkce: ['_zvukUlozeno', '_zvukSync', '_zvukChyba', '_pip',
    '_zvukZacatekUploadu', '_zvukUlozenoNaGithub'].every(n => typeof window[n] === 'function'),
  sync: (() => { try { playSound('sync'); return true; } catch (e) { return String(e.message); } })(),
  ulozeno: (() => { try { playSound('save-gh'); return true; } catch (e) { return String(e.message); } })(),
  chyba: (() => { try { playSound('error'); return true; } catch (e) { return String(e.message); } })()
}));
ok(s, zvuky.sekundy === 4, 'autosave čeká 4 s (dřív 15) — tím je dané, jak dlouho druhý nevidí mou práci', zvuky.sekundy);
ok(s, zvuky.mamFunkce, 'krátké zvuky existují jako vlastní funkce', zvuky);
ok(s, zvuky.sync === true && zvuky.ulozeno === true && zvuky.chyba === true,
  'uložení, synchronizace i chyba mají svůj zvuk a nespadnou', zvuky);

nadpis('Tlačítko ↻ Sloučit');
const tlacitko = await stranka.evaluate(() => {
  const b = document.getElementById('btn-gh-slucit');
  return b ? { je: true, skryte: b.hidden, popis: b.title, klavesa: b.accessKey } : { je: false };
});
ok(s, tlacitko.je, 'tlačítko v hlavičce existuje', tlacitko);
ok(s, /Neukládá/.test(tlacitko.popis || ''),
  'a v popisku stojí, že neukládá — je to čtení, ne zápis', tlacitko.popis);
ok(s, await stranka.evaluate(() => typeof slucitZGithubuRucne === 'function'), 'obsluha existuje');
ok(s, await stranka.evaluate(() => document.getElementById('btn-gh-slucit').accessKey === 'm'),
  'accesskey je „m" — stejné písmeno jako v DKM');

nadpis('Klávesová zkratka Alt+M / Alt+Shift+M');
// `accesskey` má každý prohlížeč jinak (Firefox Alt+Shift, Chrome Alt, macOS Ctrl+Alt)
// a v bezhlavém Chromiu nefunguje vůbec — ani u stávajících tlačítek. Proto je zkratka
// i ve vlastní klávesové vrstvě: chová se všude stejně a jde ověřit.
const zkratka = await stranka.evaluate(() => {
  state.settings.github = { owner: 'o', repo: 'r', path: 'p.json', branch: 'main' };
  GH.setToken('t'); GH.refreshUI();
  window.__puvodniSluc = window.slucitZGithubuRucne;
  window.__pocetSlouceni = 0;
  window.slucitZGithubuRucne = () => { window.__pocetSlouceni++; };
  return true;
});
ok(s, zkratka, 'příprava: GitHub nastavený a obsluha odchycená');
await stranka.keyboard.press('Alt+m');
await stranka.waitForTimeout(200);
ok(s, await stranka.evaluate(() => window.__pocetSlouceni) === 1, 'Alt+M spustí sloučení');
await stranka.keyboard.press('Alt+Shift+m');
await stranka.waitForTimeout(200);
ok(s, await stranka.evaluate(() => window.__pocetSlouceni) === 2, 'Alt+Shift+M taky');
await stranka.evaluate(() => { window.__pocetSlouceni = 0; });
await stranka.keyboard.press('Shift+m');
await stranka.waitForTimeout(200);
ok(s, await stranka.evaluate(() => window.__pocetSlouceni) === 0,
  'samotné Shift+M zůstává navigací, zkratka ho nespolkla');
const bezGh = await stranka.evaluate(async () => {
  GH.setToken(''); state.settings.github = { owner: '', repo: '', path: '', branch: 'main' };
  window.__pocetSlouceni = 0;
  return true;
});
ok(s, bezGh, 'příprava: GitHub odpojený');
await stranka.keyboard.press('Alt+m');
await stranka.waitForTimeout(250);
const stav = await stranka.evaluate(() => ({
  pocet: window.__pocetSlouceni,
  toast: (document.querySelector('.toast') || {}).textContent || ''
}));
ok(s, stav.pocet === 0 && /GitHub/.test(stav.toast),
  'bez nastaveného GitHubu zkratka jen poradí, nic nespustí', stav);
await stranka.evaluate(() => { window.slucitZGithubuRucne = window.__puvodniSluc; });

await prohlizec.close();
process.exit(uzavri(s));
