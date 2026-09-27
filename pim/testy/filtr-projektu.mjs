// Filtr podle projektu ve sdílených pohledech: Úkoly, Kalendář, Tagy, Příznaky,
// Vazby, Komentáře — a konkrétní projekt v filtrech pohledu Vše (tedy i
// v „posledních 100 změněných", což je tentýž pohled s řazením a limitem).
//
// Dvě věci, které musí platit: příslušnost k projektu je TRANZITIVNÍ (úkol pod
// schůzkou pod projektem tam patří) a filtr nikdy nesmí propustit entitu
// z jiného projektu. Proto kanárci s jasně odlišenými názvy.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const soucet = novySoucet('Filtr podle projektu');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

// Struktura:
//   Projekt A  ← Schuzka A  ← Ukol A2 (vnuk, tranzitivně v projektu A)
//              ← Ukol A1
//   Projekt B  ← Ukol B1
//   Projekt Z (archivovaný, nesmí být v nabídce)
//   Volna entita (mimo projekty)
await nasypej(stranka, [
  { id: 'pa', title: 'Projekt A', aspects: ['Project'], tags: ['tag-a'] },
  { id: 'pb', title: 'Projekt B', aspects: ['Project'], tags: ['tag-b'] },
  { id: 'pz', title: 'Projekt Z archiv', aspects: ['Project'], archived: true },
  { id: 'sa', title: 'Schuzka A', aspects: ['Event'], tags: ['tag-a'],
    links: [{ to: 'pa', type: 'partOf', note: '' }],
    attributes: { start: '2026-10-05T09:00' } },
  { id: 'ua1', title: 'Ukol A1', aspects: ['Task'], tags: ['tag-a'],
    links: [{ to: 'pa', type: 'partOf', note: '' }],
    attributes: { status: 'todo', deadline: '2026-10-06' },
    body: '- [ ] md ukol A1 🚩' },
  { id: 'ua2', title: 'Ukol A2 vnuk', aspects: ['Task'], tags: ['tag-vnuk'],
    links: [{ to: 'sa', type: 'partOf', note: '' }],
    attributes: { status: 'todo', deadline: '2026-10-07' },
    body: '- [ ] md ukol A2' },
  { id: 'ub1', title: 'Ukol B1', aspects: ['Task'], tags: ['tag-b'],
    links: [{ to: 'pb', type: 'partOf', note: '' }],
    attributes: { status: 'todo', deadline: '2026-10-08' },
    body: '- [ ] md ukol B1 🚩' },
  { id: 'volna', title: 'Volna entita', aspects: ['Note'], tags: ['tag-volny'],
    attributes: { review_date: '2026-10-09' }, body: 'text 🚩' }
]);
await stranka.evaluate(() => {
  const t = new Date().toISOString();
  findEntity('ua1').comments = [{ id: 'ka', author: 'A', content: 'komentar u ukolu A1', created_at: t, updated_at: t }];
  findEntity('ua2').comments = [{ id: 'kv', author: 'V', content: 'komentar u vnuka', created_at: t, updated_at: t }];
  findEntity('ub1').comments = [{ id: 'kb', author: 'B', content: 'komentar u ukolu B1', created_at: t, updated_at: t }];
  findEntity('volna').comments = [{ id: 'kvol', author: 'X', content: 'komentar volny', created_at: t, updated_at: t }];
  db.flagEmojis = ['🚩'];
});

const nastav = (id) => stranka.evaluate((id) => { state.projektFiltr = id; render(); }, id)
  .then(() => stranka.waitForTimeout(450));
const pohled = (v) => stranka.evaluate((v) => setView(v), v).then(() => stranka.waitForTimeout(500));
const text = () => stranka.evaluate(() => document.querySelector('main').textContent.replace(/\s+/g, ' '));

nadpis('Nabídka projektů');
await nastav('');
await pohled('tasks');
const nabidka = await stranka.evaluate(() => {
  const s = document.getElementById('tf-projekt');
  return s ? Array.from(s.options).map(o => o.value + '|' + o.textContent) : null;
});
ok(soucet, !!nabidka, 'select projektu je v pohledu Úkoly', nabidka);
ok(soucet, nabidka && nabidka[0].startsWith('|'), 'první volba je „všechny projekty"', nabidka && nabidka[0]);
ok(soucet, nabidka && nabidka.filter(o => o.startsWith('pa|') || o.startsWith('pb|')).length === 2,
  'nabízí oba nearchivované projekty', nabidka);
ok(soucet, nabidka && !nabidka.some(o => o.startsWith('pz|')),
  'archivovaný projekt v nabídce není', nabidka);
ok(soucet, nabidka && nabidka[1].indexOf('Projekt A') >= 0 && nabidka[2].indexOf('Projekt B') >= 0,
  'projekty jsou abecedně', nabidka);

nadpis('Úkoly');
await nastav('pa');
let t = await text();
ok(soucet, /Ukol A1/.test(t) && /Ukol A2 vnuk/.test(t), 'úkoly projektu A jsou vidět, i vnuk přes schůzku', t.slice(0, 200));
ok(soucet, !/Ukol B1/.test(t), 'úkol projektu B vidět není');
ok(soucet, /md ukol A1/.test(t) && /md ukol A2/.test(t) && !/md ukol B1/.test(t),
  'přehled markdownových úkolů se filtruje taky');
await nastav('pb');
t = await text();
ok(soucet, /Ukol B1/.test(t) && !/Ukol A1/.test(t) && !/Ukol A2/.test(t),
  'přepnutí na projekt B ukáže jen jeho úkoly');
await nastav('');
t = await text();
ok(soucet, /Ukol A1/.test(t) && /Ukol B1/.test(t), 'bez filtru jsou vidět všechny úkoly');

nadpis('Kalendář');
await pohled('calendar');
await nastav('pa');
t = await text();
ok(soucet, /Schuzka A/.test(t) && /Ukol A1/.test(t) && /Ukol A2/.test(t), 'kalendář ukazuje data projektu A');
ok(soucet, !/Ukol B1/.test(t) && !/Volna entita/.test(t), 'a nic mimo projekt A');

nadpis('Tagy');
await pohled('tags');
await nastav('pa');
const tagy = await stranka.evaluate(() =>
  Array.from(document.querySelectorAll('a.tag')).map(a => a.textContent));
ok(soucet, tagy.includes('tag-a') && tagy.includes('tag-vnuk'),
  'tagy entit projektu A (včetně vnuka) jsou vidět', tagy);
ok(soucet, !tagy.includes('tag-b') && !tagy.includes('tag-volny'),
  'tagy mimo projekt A vidět nejsou', tagy);

nadpis('Příznaky');
await pohled('flags');
await nastav('pa');
t = await text();
ok(soucet, /Ukol A1/.test(t), 'příznak u entity projektu A je vidět', t.slice(0, 300));
ok(soucet, !/Ukol B1/.test(t) && !/Volna entita/.test(t), 'příznaky mimo projekt A vidět nejsou');

nadpis('Vazby');
await pohled('links');
await nastav('pa');
const vazby = await stranka.evaluate(() =>
  Array.from(document.querySelectorAll('table tbody tr')).map(r => r.textContent.replace(/\s+/g, ' ')));
ok(soucet, vazby.some(r => /Schuzka A/.test(r) && /Projekt A/.test(r)),
  'vazba Schuzka A → Projekt A je vidět', vazby);
ok(soucet, vazby.some(r => /Ukol A2 vnuk/.test(r)), 'a vazba vnuka na schůzku taky', vazby);
ok(soucet, !vazby.some(r => /Ukol B1/.test(r)), 'vazba mimo projekt A vidět není', vazby);

nadpis('Komentáře');
await pohled('comments');
await nastav('pa');
t = await text();
ok(soucet, /komentar u ukolu A1/.test(t) && /komentar u vnuka/.test(t),
  'komentáře entit projektu A (i vnuka) jsou vidět');
ok(soucet, !/komentar u ukolu B1/.test(t) && !/komentar volny/.test(t),
  'komentáře mimo projekt A vidět nejsou');

nadpis('Filtr je společný a drží se mezi pohledy');
await pohled('tasks');
const drzi = await stranka.evaluate(() => {
  const s = document.getElementById('tf-projekt');
  return s ? s.value : null;
});
ok(soucet, drzi === 'pa', 'po přechodu do jiného pohledu zůstává vybraný projekt', drzi);

nadpis('Smazaný projekt se z filtru zapomene');
await stranka.evaluate(() => { db.entities = db.entities.filter(e => e.id !== 'pa'); render(); });
await stranka.waitForTimeout(450);
const poSmazani = await stranka.evaluate(() => ({ stav: state.projektFiltr, hodnota: (document.getElementById('tf-projekt') || {}).value }));
ok(soucet, poSmazani.stav === '' && poSmazani.hodnota === '',
  'po smazání projektu se filtr vypne, místo aby pohled tiše zůstal prázdný', poSmazani);

nadpis('Pohled Vše: konkrétní projekt ve filtrech');
await nasypej(stranka, [
  { id: 'pa', title: 'Projekt A', aspects: ['Project'] },
  { id: 'pb', title: 'Projekt B', aspects: ['Project'] },
  { id: 'sa', title: 'Schuzka A', aspects: ['Event'], links: [{ to: 'pa', type: 'partOf', note: '' }] },
  { id: 'ua2', title: 'Ukol A2 vnuk', aspects: ['Task'], links: [{ to: 'sa', type: 'partOf', note: '' }] },
  { id: 'ub1', title: 'Ukol B1', aspects: ['Task'], links: [{ to: 'pb', type: 'partOf', note: '' }] },
  { id: 'volna', title: 'Volna entita', aspects: ['Note'] }
]);
await pohled('all');
const volby = await stranka.evaluate(() => {
  const s = document.getElementById('filter-project');
  return s ? Array.from(s.options).map(o => o.value) : null;
});
ok(soucet, volby && volby.includes('none') && volby.includes('any') && volby.includes('pa') && volby.includes('pb'),
  'filtr Projekt nabízí původní volby i konkrétní projekty', volby);
const vysledek = await stranka.evaluate(async () => {
  const s = document.getElementById('filter-project');
  s.value = 'pa';
  s.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(z => setTimeout(z, 500));
  return document.querySelector('main').textContent.replace(/\s+/g, ' ');
});
ok(soucet, /Projekt A/.test(vysledek) && /Schuzka A/.test(vysledek) && /Ukol A2 vnuk/.test(vysledek),
  've Vše zůstane projekt A i jeho potomci včetně vnuka', vysledek.slice(0, 300));
ok(soucet, !/Ukol B1/.test(vysledek) && !/Volna entita/.test(vysledek),
  'a nic mimo projekt A', vysledek.slice(0, 300));

nadpis('Posledních 100 změněných respektuje filtr pohledu Vše');
const posledni = await stranka.evaluate(async () => {
  otevriPosledniZmeny();
  await new Promise(z => setTimeout(z, 500));
  const s = document.getElementById('filter-project');
  return { hodnota: s ? s.value : null, text: document.querySelector('main').textContent.replace(/\s+/g, ' ') };
});
ok(soucet, posledni.hodnota === '',
  '„Posledních 100 změněných" filtry schválně resetuje (a select to ukazuje)', posledni.hodnota);
ok(soucet, /Ukol B1/.test(posledni.text), 'takže je v něm zase vidět všechno', posledni.text.slice(0, 200));

nadpis('Paleta příkazů nabízí filtr projektu');
await stranka.evaluate(() => { state.projektFiltr = ''; render(); });
await stranka.waitForTimeout(300);
const paletaPrikazy = await stranka.evaluate(() =>
  paletaSestavPrikazy().filter(p => p.kategorie === 'Filtr projektu').map(p => p.id + '|' + p.label));
ok(soucet, paletaPrikazy.length === 2 && paletaPrikazy.every(x => x.startsWith('projekt-filtr:')),
  'bez filtru nabízí paleta oba projekty a nic na rušení', paletaPrikazy);
const poVolbe = await stranka.evaluate(async () => {
  const prikaz = paletaSestavPrikazy().find(p => p.id === 'projekt-filtr:pa');
  prikaz.run();
  await new Promise(z => setTimeout(z, 400));
  return { stav: state.projektFiltr,
    prikazy: paletaSestavPrikazy().filter(p => p.kategorie === 'Filtr projektu').map(p => p.id) };
});
ok(soucet, poVolbe.stav === 'pa', 'příkaz z palety filtr zapne', poVolbe);
ok(soucet, poVolbe.prikazy.includes('projekt-filtr-zrusit') && !poVolbe.prikazy.includes('projekt-filtr:pa'),
  'zapnutý projekt se přestane nabízet a přibude „Zrušit filtr projektu"', poVolbe.prikazy);
const poZruseni = await stranka.evaluate(async () => {
  paletaSestavPrikazy().find(p => p.id === 'projekt-filtr-zrusit').run();
  await new Promise(z => setTimeout(z, 400));
  return state.projektFiltr;
});
ok(soucet, poZruseni === '', 'a zrušení filtr vypne', poZruseni);

await prohlizec.close();
process.exit(uzavri(soucet));
