// Volby obsahu v exportu (JSON i ZIP balíček pro přenos mezi PIMy):
//   „Exportovat i s komentáři", „Exportovat sledování času"
//   a u exportu podle tagů „Exportovat i ostatní tagy".
//
// Jde se přes skutečný dialog (zaškrtávátka + Exportovat). Výstup se zachytí
// podvržením `downloadJsonExport`, kterou volá obsluha formuláře. Kontroluje se
// payload, že výchozí stav exportuje vše jako dřív, že se do `db` nesáhlo
// (kanárci) a že ořezaný balíček jde naimportovat.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const s = novySoucet('Volby obsahu exportu');
const { prohlizec, stranka } = await otevriAplikaci(s);

const zaznam = { id: 'tt1', start: '2026-11-01T08:00:00.000Z', end: '2026-11-01T09:30:00.000Z', note: 'práce' };
await nasypej(stranka, [
  { id: 'a', title: 'Alfa', aspects: ['Note', 'TimeTracking'], tags: ['klient', 'interni', 'tajne'], body: 'KANAREK-A',
    comments: [{ id: 'k1', author: 'Já', content: 'KOMENTAR-A', created_at: '2026-11-01T10:00:00.000Z' }],
    attributes: { tt_entries: [zaznam], tt_running: null, poznamka: 'zustane' } },
  { id: 'b', title: 'Beta', aspects: ['Task'], tags: ['klient'], body: 'KANAREK-B',
    comments: [{ id: 'k2', author: 'Já', content: 'KOMENTAR-B', created_at: '2026-11-01T10:00:00.000Z' }] },
  { id: 'c', title: 'Gama', aspects: ['Note'], tags: ['jiny'], body: 'KANAREK-C' }
]);
const puvodniDb = await stranka.evaluate(() => JSON.stringify(db.entities));

// Otevře dialog, nastaví rozsah a zaškrtávátka, odešle a vrátí zachycený payload.
async function exportuj({ rozsah = 'full', tagy = [], komentare, cas, ostatniTagy }) {
  await stranka.evaluate(() => {
    window.__zachyceno = null;
    window.downloadJsonExport = (scope, options) => { window.__zachyceno = buildJsonExport(scope, options); };
    openExportDialog();
    document.getElementById('export-dialog').showModal();
  });
  await stranka.waitForTimeout(200);
  await stranka.check('input[name="exp-scope"][value="' + rozsah + '"]');
  for (const t of tagy) await stranka.check('input[name="exp-tag"][value="' + t + '"]');
  const nastav = async (sel, v) => { if (v === true) await stranka.check(sel); else if (v === false) await stranka.uncheck(sel); };
  await nastav('#exp-with-comments', komentare);
  await nastav('#exp-with-timetracking', cas);
  await nastav('#exp-other-tags', ostatniTagy);
  await stranka.click('#exp-go');
  await stranka.waitForTimeout(200);
  return await stranka.evaluate(() => window.__zachyceno);
}
const ent = (p, id) => p.db.entities.find(e => e.id === id);

nadpis('Dialog: zaškrtávátka');
await stranka.evaluate(() => { openExportDialog(); document.getElementById('export-dialog').showModal(); });
await stranka.waitForTimeout(200);
const vychozi = await stranka.evaluate(() => ['exp-with-comments', 'exp-with-timetracking', 'exp-other-tags']
  .map(id => { const el = document.getElementById(id); return el ? el.checked : null; }));
ok(s, vychozi.every(v => v === true), 'tři nová zaškrtávátka existují a výchozí je zapnuto (export jako dřív)', vychozi);
await stranka.check('input[name="exp-scope"][value="tags"]');
ok(s, await stranka.isVisible('#exp-other-tags'), '„Exportovat i ostatní tagy" je vidět u exportu podle tagů');
await stranka.check('input[name="exp-scope"][value="full"]');
ok(s, !(await stranka.isVisible('#exp-other-tags')), 'a u jiného rozsahu ne');
await stranka.check('input[name="exp-format"][value="xlsx"]');
ok(s, !(await stranka.isVisible('#exp-with-comments')), 'u Excelu se volby balíčku neukazují');
await stranka.evaluate(() => document.getElementById('export-dialog').close());

nadpis('Výchozí stav: vše jako dřív');
const plny = await exportuj({});
ok(s, ent(plny, 'a').comments.length === 1 && ent(plny, 'b').comments.length === 1, 'komentáře v exportu jsou');
ok(s, ent(plny, 'a').attributes.tt_entries.length === 1 && ent(plny, 'a').aspects.includes('TimeTracking'), 'sledování času v exportu je');

nadpis('Bez komentářů');
const bezKom = await exportuj({ komentare: false });
ok(s, plny.db.entities.length === bezKom.db.entities.length, 'entit je stejně');
ok(s, bezKom.db.entities.every(e => Array.isArray(e.comments) && e.comments.length === 0), 'komentáře odebrané u všech entit');
ok(s, JSON.stringify(bezKom).indexOf('KOMENTAR-') < 0, 'text komentáře v payloadu nikde není');
ok(s, ent(bezKom, 'a').attributes.tt_entries.length === 1, 'sledování času zůstalo (jiná volba)');
ok(s, bezKom.options && bezKom.options.sKomentari === false, 'payload nese, co se exportovalo', bezKom.options);

nadpis('Bez sledování času');
const bezCasu = await exportuj({ cas: false });
const aBez = ent(bezCasu, 'a');
ok(s, !('tt_entries' in aBez.attributes) && !('tt_running' in aBez.attributes), 'pole tt_* odebraná', aBez.attributes);
ok(s, !aBez.aspects.includes('TimeTracking') && aBez.aspects.includes('Note'), 'aspekt Sledování času odebraný, ostatní zůstaly', aBez.aspects);
ok(s, aBez.attributes.poznamka === 'zustane' && aBez.body === 'KANAREK-A', 'ostatní atributy i tělo zůstaly');
ok(s, aBez.comments.length === 1, 'komentáře zůstaly (jiná volba)');

nadpis('Podle tagů: ostatní tagy');
const sTagy = await exportuj({ rozsah: 'tags', tagy: ['klient'] });
ok(s, sTagy.db.entities.map(e => e.id).sort().join(',') === 'a,b', 'vybrané jsou entity s tagem klient');
ok(s, ent(sTagy, 'a').tags.join(',') === 'klient,interni,tajne', 'výchozí: entity si nesou i ostatní tagy', ent(sTagy, 'a').tags);
ok(s, ['klient', 'interni', 'tajne'].every(t => sTagy.db.tags.includes(t)), 'a seznam tagů je obsahuje', sTagy.db.tags);
const jenVybrane = await exportuj({ rozsah: 'tags', tagy: ['klient'], ostatniTagy: false });
ok(s, jenVybrane.db.entities.every(e => e.tags.join(',') === 'klient'), 'vypnuto: entity mají jen zaškrtnuté tagy', jenVybrane.db.entities.map(e => e.tags));
ok(s, jenVybrane.db.tags.join(',') === 'klient', 'a seznam tagů jen zaškrtnuté', jenVybrane.db.tags);
ok(s, JSON.stringify(jenVybrane).indexOf('tajne') < 0, 'ostatní tag v payloadu nikde není');
const vse = await exportuj({ rozsah: 'tags', tagy: ['klient'], ostatniTagy: false, komentare: false, cas: false });
ok(s, vse.db.entities.every(e => e.comments.length === 0 && !e.aspects.includes('TimeTracking') && e.tags.join(',') === 'klient'),
  'všechny tři volby najednou');

nadpis('Kanárci: do dat se nesáhlo');
const poExportu = await stranka.evaluate(() => JSON.stringify(db.entities));
ok(s, poExportu === puvodniDb, 'db.entities je po všech exportech beze změny');

nadpis('Ořezaný balíček jde naimportovat');
const importLog = await stranka.evaluate(async (payload) => {
  db.entities = [];
  const log = await performImport(payload, 'skip', 'all');
  const a = findEntity('a');
  return { log, n: db.entities.length, tagy: a.tags, kom: a.comments.length, tt: !!(a.attributes || {}).tt_entries };
}, vse);
ok(s, importLog.n === 2 && importLog.tagy.join(',') === 'klient' && importLog.kom === 0 && !importLog.tt, 'import do čisté báze', importLog);

await prohlizec.close();
process.exit(uzavri(s));
