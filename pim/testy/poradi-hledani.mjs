// POŘADÍ VÝSLEDKŮ HLEDÁNÍ — název před obsahem.
//
// Co se najde, se nemění; mění se jen pořadí. Entita, která má hledaný výraz
// v názvu, musí být nad tou, která ho má jen v těle. Platí pro rychlé hledání
// v záhlaví, pohled Vše, uložený pohled i paletu příkazů.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const s = novySoucet('Pořadí výsledků hledání');
const { prohlizec, stranka } = await otevriAplikaci(s);

// „raketa" schválně na různých místech a v různém pořadí v databázi
// Každá entita má jiný čas změny — jinak by o pořadí při stejném skóre
// rozhodovalo pořadí v databázi a test by byl na náhodě.
async function priprav() {
  await stranka.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
  await nasypej(stranka, [
    { id: 'o1', updated_at: '2026-01-01T00:00:00.000Z', title: 'Poznamka o vesmiru', aspects: ['Note'], body: 'Tady se piše o raketa a dalších věcech.' },
    { id: 'o2', updated_at: '2026-01-02T00:00:00.000Z', title: 'Stavba rakety', aspects: ['Note'], body: 'nic zajimaveho' },
    { id: 'o3', updated_at: '2026-01-03T00:00:00.000Z', title: 'Dalsi text', aspects: ['Note'], body: 'raketa raketa raketa', tags: ['vesmir'] },
    { id: 'o4', updated_at: '2026-01-04T00:00:00.000Z', title: 'Raketa na Mars', aspects: ['Note'], body: 'popis' },
    { id: 'o5', updated_at: '2026-01-05T00:00:00.000Z', title: 'Neco jineho', aspects: ['Note'], body: 'jen text', tags: ['raketa'] },
    { id: 'o6', updated_at: '2026-01-06T00:00:00.000Z', title: 'Model rakety doma', aspects: ['Note'], body: 'dalsi popis' }
  ]);
}

const poradi = (dotaz) => stranka.evaluate((q) => searchEntities(q).map(e => e.id), dotaz);

nadpis('Jádro hledání řadí název před obsah');
await priprav();
let p = await poradi('raketa');
ok(s, p.length === 4 && p.slice().sort().join(',') === 'o1,o3,o4,o5',
  'najde se pořád totéž co dřív — o1 a o3 obsahem, o4 názvem, o5 tagem', p);
ok(s, p[0] === 'o4', 'entita s výrazem na začátku názvu je první', p);
ok(s, p.indexOf('o4') < p.indexOf('o1') && p.indexOf('o4') < p.indexOf('o3'),
  'název přebije obsah', p);
ok(s, p.indexOf('o5') < p.indexOf('o1') && p.indexOf('o5') < p.indexOf('o3'),
  'tag přebije obsah', p);
ok(s, p[2] === 'o3' && p[3] === 'o1' || p[2] === 'o1' && p[3] === 'o3',
  'obě shody jen v obsahu jsou na konci', p);

nadpis('Shoda uprostřed názvu je až za shodou na začátku');
p = await poradi('rakety');
ok(s, p.length === 2, 'dvě entity mají „rakety"', p);
ok(s, p.slice().sort().join(',') === 'o2,o6', 'jsou to ty dvě s „rakety" v názvu', p);
ok(s, p[0] === 'o6', 'obě mají shodu na začátku slova, takže rozhodl novější čas změny', p);

nadpis('Rychlé hledání v záhlaví');
await priprav();
await stranka.fill('#header-search', 'raketa');
await stranka.waitForTimeout(500);
const vZahlavi = await stranka.evaluate(() =>
  [...document.querySelectorAll('#header-search-results a[data-entity]')].map(a => a.dataset.entity));
ok(s, vZahlavi.length === 4, 'rychlé hledání našlo totéž', vZahlavi);
ok(s, vZahlavi[0] === 'o4', 'a první je entita s výrazem v názvu', vZahlavi);
ok(s, vZahlavi.indexOf('o1') > vZahlavi.indexOf('o4') && vZahlavi.indexOf('o1') > vZahlavi.indexOf('o5'),
  'entita se shodou jen v obsahu je vzadu', vZahlavi);
await stranka.evaluate(() => { document.getElementById('header-search').value = ''; });

nadpis('Pohled Vše');
await priprav();
await stranka.evaluate(() => {
  state.view = 'all';
  state.filter = { aspect: '', tag: '', text: '', status: '', attrFilters: [] };
  state._allSortRucni = false;
  render();
});
await stranka.waitForTimeout(500);
await stranka.fill('#filter-text', 'raketa');
await stranka.waitForTimeout(700);
const vSeznamu = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#all-results tbody tr a[data-entity]')].map(a => a.dataset.entity));
let v = await vSeznamu();
ok(s, v[0] === 'o4', 'v seznamu je první shoda v názvu', v);
ok(s, v.indexOf('o1') > v.indexOf('o4'), 'a shoda v obsahu je níž', v);

nadpis('Vlastní řazení uživatele má přednost');
await stranka.evaluate(() => document.querySelector('#all-results button.th-sort').click());
await stranka.waitForTimeout(600);
ok(s, await stranka.evaluate(() => state._allSortRucni === true), 'kliknutí na hlavičku se zapamatuje');
const poKliknuti = await vSeznamu();
ok(s, poKliknuti.join(',') !== v.join(','), 'pořadí se změnilo podle sloupce', poKliknuti);

nadpis('Nový dotaz se vrátí k relevanci');
await stranka.fill('#filter-text', 'rakety');
await stranka.waitForTimeout(700);
ok(s, await stranka.evaluate(() => state._allSortRucni === false), 'změna dotazu příznak zruší');
v = await vSeznamu();
ok(s, v.slice().sort().join(',') === 'o2,o6', 'a řadí se zase podle shody, ne podle sloupce', v);

nadpis('Bez hledání platí běžné řazení');
// Vrátit výchozí řazení — předchozí část testu klikla na hlavičku sloupce.
await stranka.evaluate(() => { state._allSort = { key: 'updated', dir: 'desc' }; state._allSortRucni = false; });
await stranka.fill('#filter-text', '');
await stranka.waitForTimeout(700);
v = await vSeznamu();
ok(s, v.length === 6, 'bez dotazu jsou všechny entity', v);
ok(s, v.join(',') === 'o6,o5,o4,o3,o2,o1', 'a pořadí je podle času změny, ne podle skóre', v);

nadpis('Uložený pohled a jeho hledání');
await priprav();
await stranka.evaluate(() => {
  db.savedViews = [{ id: 'sv', name: 'Vse', filters: {} }];
  state.view = 'savedView'; state.savedViewId = 'sv';
  state._viewFilter = {}; state._viewSortRucni = {};
  render();
});
await stranka.waitForTimeout(600);
await stranka.fill('#view-filter-text', 'raketa');
await stranka.waitForTimeout(700);
const vPohledu = await stranka.evaluate(() =>
  [...document.querySelectorAll('#view-results tbody tr a[data-entity]')].map(a => a.dataset.entity));
ok(s, vPohledu[0] === 'o4', 'i v uloženém pohledu je první shoda v názvu', vPohledu);
ok(s, vPohledu.indexOf('o1') > vPohledu.indexOf('o4'), 'a obsah je níž', vPohledu);

nadpis('Paleta: název přebije tag');
await priprav();
await stranka.keyboard.press('F1');
await stranka.waitForTimeout(400);
await stranka.fill('#pal-input', '@raketa');
await stranka.waitForTimeout(450);
const vPalete = await stranka.evaluate(() =>
  [...document.querySelectorAll('#pal-list .pal-item .pal-label')].map(e => e.textContent));
ok(s, vPalete.length > 0, 'paleta něco našla', vPalete);
ok(s, /Raketa na Mars/.test(vPalete[0]), 'první je entita s výrazem v názvu', vPalete);
ok(s, vPalete.findIndex(x => /Raketa na Mars/.test(x)) < vPalete.findIndex(x => /Neco jineho/.test(x)),
  'entita, která to má jen v tagu, je až za ní', vPalete);
await stranka.keyboard.press('Escape');

nadpis('Víc slov: všechna v názvu vyhrávají');
await stranka.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
await nasypej(stranka, [
  { id: 'm1', title: 'Cesta na Mars', aspects: ['Note'], body: 'raketa letí' },
  { id: 'm2', title: 'Raketa na Mars', aspects: ['Note'], body: 'nic' },
  { id: 'm3', title: 'Poznamka', aspects: ['Note'], body: 'raketa a Mars dohromady' }
]);
p = await poradi('raketa mars');
ok(s, p.length === 3, 'najde všechny tři', p);
ok(s, p[0] === 'm2', 'obě slova v názvu = nejvýš', p);
ok(s, p[p.length - 1] === 'm3', 'obě slova jen v obsahu = nejníž', p);

await prohlizec.close();
process.exit(uzavri(s));
