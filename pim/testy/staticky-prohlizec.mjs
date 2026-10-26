// STATICKÝ PROHLÍŽEČ — vygenerovaný jednosouborový export musí opravdu fungovat.
//
// Šablona prohlížeče je uvnitř index.html jako řetězec, takže chyba v escapování
// se projeví až ve vygenerovaném souboru, ne při načtení PIM. Proto se tady
// prohlížeč skutečně vygeneruje, uloží a otevře jako samostatná stránka.
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const s = novySoucet('Statický prohlížeč');
const { prohlizec, stranka } = await otevriAplikaci(s);

await nasypej(stranka, [
  { id: 'p1', title: 'Projekt Alfa', aspects: ['Project'],
    body: '# Cil\n\nKanarek-PROJEKT.\n\n## Detaily\n\n| a | b |\n|---|---|\n| 1 | 2 |',
    attributes: { status: 'active', goal: 'Kanarek-GOAL' }, tags: ['tag-a'] },
  { id: 'p2', title: 'Ukol jedna', aspects: ['Task'], attributes: { status: 'todo' }, body: 'Kanarek-UKOL' },
  { id: 'p3', title: 'Archivovana', aspects: ['Note'], body: 'Kanarek-ARCHIV', archived: true },
  { id: 'p4', title: 'Osoba', aspects: ['Person'], body: 'Kanarek-OSOBA s [[Projekt Alfa]].' },
  // Srovnání úrovní nadpisů při includu má šablona prohlížeče vlastní kopii, takže
  // se musí ověřit na vygenerovaném souboru. Vkládaná část má schválně jen nadpisy
  // 4 a 5 — pod nadpisem 2 z nich musí vyjít 3 a 4.
  { id: 'p5', title: 'Vkladana cast', aspects: ['Note'],
    body: '#### Ctyrka\n\nKanarek-VLOZENE\n\n##### Petka\n\nText.' },
  { id: 'p6', title: 'Hostitel', aspects: ['Note'],
    body: '# Hlavni\n\n## Kapitola\n\n{{include:Vkladana cast}}' }
], { savedViews: [{ id: 'v1', name: 'Pohled', icon: '⭐', filters: { aspect: 'Task' } }] });
await stranka.evaluate(() => { findEntity('p2').links = [{ to: 'p1', type: 'partOf', note: '' }]; });

nadpis('Generování');
// Do nastavení schválně nasypeme rozpoznatelná tajemství. Hledáme jejich HODNOTY,
// ne názvy proměnných – prohlížeč se rozdává dál a klíč v něm být nesmí.
const TAJNE_AI = 'TAJNY-AI-KLIC-' + Date.now();
const TAJNY_GH = 'TAJNY-GH-TOKEN-' + Date.now();
await stranka.evaluate(({ ai, gh }) => {
  try { localStorage.setItem('pim_ai_key', ai); } catch (e) {}
  state.settings.github = { owner: 'o', repo: 'r', path: 'p', branch: 'main', token: gh };
  db.ghMeta = { path: 'x', sha: 'y', lastSyncAt: 'z', branch: 'main', token: gh };
}, { ai: TAJNE_AI, gh: TAJNY_GH });

const html = await stranka.evaluate(() => buildStaticViewerHtml());
ok(s, typeof html === 'string' && html.length > 10000, 'prohlížeč se vygeneroval', html && html.length);
ok(s, !html.includes(TAJNE_AI), 'klíč k umělé inteligenci se do prohlížeče nedostal');
ok(s, !html.includes(TAJNY_GH), 'GitHub token se do prohlížeče nedostal');

const soubor = path.join(tmpdir(), 'pim-test-prohlizec.html');
writeFileSync(soubor, html);

nadpis('Chování vygenerovaného souboru');
const chybyProhlizece = [];
const stranka2 = await (await prohlizec.newContext()).newPage();
stranka2.on('pageerror', e => chybyProhlizece.push(e.message));
await stranka2.goto('file://' + soubor);
await stranka2.waitForTimeout(1500);

const zaklad = await stranka2.evaluate(() => ({
  viewerMode: !!window.__VIEWER_MODE,
  entit: (db.entities || []).length,
  maRender: typeof render === 'function'
}));
ok(s, zaklad.viewerMode, 'běží ve viewer módu');
ok(s, zaklad.entit === 6, 'má všechny entity', zaklad.entit);

await stranka2.evaluate(() => { state.view = 'detail'; state.detailId = 'p1'; render(); });
await stranka2.waitForTimeout(700);
const detail = await stranka2.evaluate(() => document.getElementById('main').textContent);
ok(s, detail.includes('Kanarek-PROJEKT'), 'detail ukazuje tělo');
ok(s, detail.includes('Kanarek-GOAL'), 'a atribut');
ok(s, await stranka2.evaluate(() => !!document.querySelector('#main table')), 'tabulka se vykreslila');
ok(s, await stranka2.evaluate(() => !!document.querySelector('.kanban-col')), 'kanban projektu se vykreslil');
ok(s, await stranka2.evaluate(() =>
  [...document.querySelectorAll('.kanban-col')].every(c => c.querySelectorAll('.kanban-card').length > 0)),
  'a nemá prázdné sloupce');

nadpis('Srovnání úrovní nadpisů při includu platí i v prohlížeči');
await stranka2.evaluate(() => { state.view = 'detail'; state.detailId = 'p6'; render(); });
await stranka2.waitForTimeout(700);
const urovne = await stranka2.evaluate(() =>
  Array.from(document.querySelectorAll('#body-rendered h1,#body-rendered h2,#body-rendered h3,#body-rendered h4,#body-rendered h5,#body-rendered h6'))
    .map(h => h.tagName.slice(1) + ':' + h.textContent.trim()));
ok(s, urovne.join(' | ') === '1:Hlavni | 2:Kapitola | 3:Ctyrka | 4:Petka',
  'z nadpisů 4 a 5 vyjdou pod nadpisem 2 nadpisy 3 a 4 — stejně jako v aplikaci', urovne);
ok(s, await stranka2.evaluate(() => document.getElementById('main').textContent.includes('Kanarek-VLOZENE')),
  'a vložený text je celý');

for (const [pohled, popis] of [['all', 'Vše'], ['tasks', 'Úkoly'], ['tags', 'Tagy'], ['savedView', 'uložený pohled']]) {
  const pred = chybyProhlizece.length;
  await stranka2.evaluate((v) => { state.view = v; state.savedViewId = 'v1'; render(); }, pohled);
  await stranka2.waitForTimeout(500);
  ok(s, chybyProhlizece.length === pred, 'pohled ' + popis + ' se vykreslí bez chyby');
}

ok(s, chybyProhlizece.length === 0, 'prohlížeč nevyhodil žádnou chybu', chybyProhlizece.slice(0, 3));
if (chybyProhlizece.length) s.chyby.push(...chybyProhlizece.map(c => 'prohlížeč: ' + c));

await prohlizec.close();
process.exit(uzavri(s));
