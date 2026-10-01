// Tagová matice nad vazbami entity: řádky = navázané entity (oběma směry),
// sloupce = jen tagy, které se v tom okolí někde vyskytují.
//
// Dvě věci, na kterých to celé stojí: do dat se nesmí sáhnout, dokud se
// nezmáčkne Uložit, a uložit se smí jen to, co se opravdu změnilo. Proto
// kanárci na entity mimo okolí i na nezměněné řádky.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Tagová matice nad vazbami');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

async function priprav() {
  await nasypej(stranka, [
    { id: 'pa', title: 'Projekt A', aspects: ['Project'], tags: ['projektovy', 'rok2026'] },
    { id: 'u1', title: 'Ukol jedna', aspects: ['Task'], tags: ['projektovy', 'dodavatele'],
      links: [{ to: 'pa', type: 'partOf', note: '' }] },
    { id: 'u2', title: 'Ukol dva', aspects: ['Task'], tags: ['dodavatele'],
      links: [{ to: 'pa', type: 'partOf', note: '' }] },
    { id: 'd1', title: 'Dokument bez tagu', aspects: ['Document'], tags: [],
      links: [{ to: 'pa', type: 'partOf', note: '' }] },
    { id: 'z1', title: 'Zapis z porady', aspects: ['Note'], tags: [], body: 'Viz [[Projekt A]].' },
    { id: 'arch', title: 'Archivovana cast', aspects: ['Note'], tags: ['archivni'], archived: true,
      links: [{ to: 'pa', type: 'partOf', note: '' }] },
    { id: 'mimo', title: 'Kanarek mimo okoli', aspects: ['Note'], tags: ['kanarek-tag'] }
  ]);
  await otevriDetail(stranka, 'pa');
}

const otevriMatici = async () => {
  await stranka.evaluate(() => document.getElementById('btn-tag-matice').click());
  await stranka.waitForTimeout(400);
};
const stavDb = () => stranka.evaluate(() =>
  Object.fromEntries(db.entities.map(e => [e.id, (e.tags || []).join(',')])));

// Buňka se adresuje názvem entity a tagem — pořadí řádků je abecední a na to
// se test nesmí spoléhat.
const prepni = (nazev, tag, hodnota) => stranka.evaluate(({ nazev, tag, hodnota }) => {
  const d = document.getElementById('dialog-tag-matice');
  const sloupce = Array.from(d.querySelectorAll('thead th.tm-sloupec .tm-tag')).map(x => x.textContent);
  const si = sloupce.indexOf(tag);
  const radky = Array.from(d.querySelectorAll('tbody tr'));
  const ri = radky.findIndex(r => r.querySelector('th.tm-radek').textContent.trim().startsWith(nazev));
  if (si < 0 || ri < 0) throw new Error('buňka nenalezena: ' + nazev + ' / ' + tag);
  const cb = d.querySelector('input[data-tm-r="' + ri + '"][data-tm-s="' + si + '"]');
  cb.checked = hodnota;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
}, { nazev, tag, hodnota }).then(() => stranka.waitForTimeout(150));

nadpis('Řádky: všechny vazby oběma směry, i bez tagů');
await priprav();
await otevriMatici();
const zaklad = await stranka.evaluate(() => {
  const d = document.getElementById('dialog-tag-matice');
  return {
    otevreno: !!(d && d.open),
    radky: Array.from(d.querySelectorAll('tbody th.tm-radek')).map(x => x.textContent.replace(/\s+/g, ' ').trim()),
    prvniRadek: d.querySelector('tbody tr').className,
    sloupce: Array.from(d.querySelectorAll('thead th.tm-sloupec .tm-tag')).map(x => x.textContent),
    pocty: Array.from(d.querySelectorAll('thead th.tm-sloupec .tm-pocet')).map(x => x.textContent),
    zmeny: d.querySelector('#tm-zmeny').textContent
  };
});
ok(soucet, zaklad.otevreno, 'matice se otevřela jako samostatné okno');
ok(soucet, zaklad.radky.length === 5, 'pět řádků: entita sama + čtyři vazby', zaklad.radky);
ok(soucet, zaklad.radky.some(r => r.startsWith('Dokument bez tagu')),
  'entita BEZ tagů je v matici taky — to je přesně to opomenutí, co se hledá', zaklad.radky);
ok(soucet, zaklad.radky.some(r => r.startsWith('Zapis z porady')),
  'příchozí odkaz z textu je taky vazba', zaklad.radky);
ok(soucet, !zaklad.radky.some(r => r.startsWith('Archivovana')),
  'archivovaná entita v matici není', zaklad.radky);
ok(soucet, !zaklad.radky.some(r => r.startsWith('Kanarek mimo')),
  'entita bez vazby v matici není', zaklad.radky);
ok(soucet, zaklad.radky[0].startsWith('Projekt A') && /tato entita/.test(zaklad.radky[0]),
  'první řádek je entita sama a je označená', zaklad.radky[0]);
ok(soucet, zaklad.prvniRadek === 'tm-stred', 'a je i vizuálně odlišená', zaklad.prvniRadek);
ok(soucet, zaklad.radky.every(r => /^[A-ZČŘŽÁÉÍÓÚ]/.test(r)),
  'každý řádek začíná názvem entity (hledání po písmenech odečítačem)', zaklad.radky);

nadpis('Sloupce: jen tagy z tohoto okolí, ne celá databáze');
ok(soucet, zaklad.sloupce.join(',') === 'dodavatele,projektovy,rok2026',
  'sloupce jsou jen tagy vyskytující se v okolí, abecedně', zaklad.sloupce);
ok(soucet, !zaklad.sloupce.includes('kanarek-tag'),
  'tag, který je jen mimo okolí, sloupec nedostane', zaklad.sloupce);
ok(soucet, !zaklad.sloupce.includes('archivni'),
  'ani tag jen z archivované entity', zaklad.sloupce);
ok(soucet, zaklad.pocty.join(' ') === '2/5 2/5 1/5',
  'hlavička sloupce ukazuje, kolik z řádků tag má', zaklad.pocty);
ok(soucet, zaklad.zmeny === 'Beze změn', 'na začátku hlásí, že se nic nezměnilo');

nadpis('Dokud se neuloží, do dat se nesahá');
const predZmenou = await stavDb();
await prepni('Dokument bez tagu', 'projektovy', true);
const poKliknuti = await stranka.evaluate(() => {
  const d = document.getElementById('dialog-tag-matice');
  return {
    zmeny: d.querySelector('#tm-zmeny').textContent,
    pocty: Array.from(d.querySelectorAll('thead th.tm-sloupec .tm-pocet')).map(x => x.textContent),
    zvyrazneno: d.querySelectorAll('td.tm-zmeneno').length
  };
});
ok(soucet, /\+1 tag/.test(poKliknuti.zmeny), 'počítadlo změn se zvedlo', poKliknuti.zmeny);
ok(soucet, poKliknuti.pocty[1] === '3/5', 'počet ve hlavičce sloupce jde podle rozdělané práce', poKliknuti.pocty);
ok(soucet, poKliknuti.zvyrazneno === 1, 'změněná buňka je zvýrazněná', poKliknuti.zvyrazneno);
const behemZmeny = await stavDb();
ok(soucet, JSON.stringify(behemZmeny) === JSON.stringify(predZmenou),
  'data jsou pořád netknutá — nic se neuložilo', behemZmeny);

nadpis('Zrušit beze změn opravdu nic nezmění');
await stranka.evaluate(() => document.getElementById('tm-zrusit').click());
await stranka.waitForTimeout(300);
const zeptalSe = await stranka.evaluate(() => {
  const c = document.getElementById('dialog-confirm');
  return !!(c && c.open);
});
ok(soucet, zeptalSe, 'na zahození rozdělané práce se nejdřív zeptá');
await stranka.evaluate(() => document.getElementById('confirm-yes').click());
await stranka.waitForTimeout(400);
const poZruseni = await stavDb();
ok(soucet, JSON.stringify(poZruseni) === JSON.stringify(predZmenou),
  'po Zrušit beze změn jsou data do znaku stejná (kanárek)', poZruseni);
ok(soucet, !(await stranka.evaluate(() => !!document.getElementById('dialog-tag-matice'))),
  'okno se zavřelo');

nadpis('Uložit zapíše přesně to, co se zaškrtalo');
await priprav();
await otevriMatici();
await prepni('Dokument bez tagu', 'projektovy', true);
await prepni('Zapis z porady', 'projektovy', true);
await prepni('Ukol jedna', 'dodavatele', false);
const pred = await stranka.evaluate(() => document.getElementById('tm-zmeny').textContent);
ok(soucet, /\+2 tag/.test(pred) && /−1 tag/.test(pred) && /3 entit/.test(pred),
  'počítadlo hlásí +2, −1 u tří entit', pred);
await stranka.evaluate(() => document.getElementById('tm-ulozit').click());
await stranka.waitForTimeout(700);
const po = await stavDb();
ok(soucet, po.d1 === 'projektovy', 'dokument dostal tag', po.d1);
ok(soucet, po.z1 === 'projektovy', 'zápis dostal tag', po.z1);
ok(soucet, po.u1 === 'projektovy', 'úkolu jedna se odebral dodavatele a zbyl projektovy', po.u1);
ok(soucet, po.u2 === 'dodavatele', 'nezměněný řádek zůstal beze změny (kanárek)', po.u2);
ok(soucet, po.pa === 'projektovy,rok2026', 'entita sama se nezměnila (kanárek)', po.pa);
ok(soucet, po.mimo === 'kanarek-tag', 'entita mimo okolí se nezměnila (kanárek)', po.mimo);
ok(soucet, po.arch === 'archivni', 'archivovaná entita se nezměnila (kanárek)', po.arch);
ok(soucet, !(await stranka.evaluate(() => !!document.getElementById('dialog-tag-matice'))),
  'po uložení se okno zavřelo');

nadpis('Uloží se jen opravdu změněné entity');
await priprav();
const casyPred = await stranka.evaluate(() =>
  Object.fromEntries(db.entities.map(e => [e.id, e.updated_at])));
await otevriMatici();
await prepni('Dokument bez tagu', 'projektovy', true);
await stranka.evaluate(() => document.getElementById('tm-ulozit').click());
await stranka.waitForTimeout(700);
const casyPo = await stranka.evaluate(() =>
  Object.fromEntries(db.entities.map(e => [e.id, e.updated_at])));
const zmenene = Object.keys(casyPo).filter(id => casyPo[id] !== casyPred[id]);
ok(soucet, zmenene.join(',') === 'd1',
  'updated_at se zvedlo jen u té jediné opravdu změněné entity', zmenene);

nadpis('Entita bez vazeb matici nenabízí');
await nasypej(stranka, [{ id: 'samota', title: 'Bez vazeb', aspects: ['Note'], tags: ['x'] }]);
await otevriDetail(stranka, 'samota');
const bezVazeb = await stranka.evaluate(() => !!document.getElementById('btn-tag-matice'));
ok(soucet, bezVazeb === false, 'u entity bez vazeb tlačítko není (sekce Vazby se nevykreslí)');

nadpis('Pohyb šipkami po mřížce');
await priprav();
await otevriMatici();
const sipky = await stranka.evaluate(async () => {
  const d = document.getElementById('dialog-tag-matice');
  const start = d.querySelector('input[data-tm-r="0"][data-tm-s="0"]');
  start.focus();
  const posli = (key) => document.activeElement
    .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  const kde = () => { const a = document.activeElement; return a.dataset.tmR + ',' + a.dataset.tmS; };
  const out = [];
  posli('ArrowDown'); out.push(kde());
  posli('ArrowRight'); out.push(kde());
  posli('ArrowUp'); out.push(kde());
  posli('ArrowLeft'); out.push(kde());
  posli('ArrowLeft'); out.push(kde());   // na kraji se nesmí nikam posunout
  return out;
});
ok(soucet, sipky.join(' | ') === '1,0 | 1,1 | 0,1 | 0,0 | 0,0',
  'šipky chodí po mřížce a na kraji se zastaví', sipky);

await prohlizec.close();
process.exit(uzavri(soucet));
