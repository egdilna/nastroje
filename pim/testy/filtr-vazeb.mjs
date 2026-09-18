// FILTRY „MÁ VAZBU Z / NA" v pohledu Vše.
//
// Typický důvod, proč existují: zobrazit všechno, co patří k jednomu projektu,
// a udělat s tím hromadnou operaci. Test proto jde až k tomu — vyfiltruje,
// zapne režim výběru a zkontroluje, že se vybírá právě to správné.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const s = novySoucet('Filtry vazeb');
const { prohlizec, stranka } = await otevriAplikaci(s);

// Projekt, tři jeho části, jedna cizí entita a jedna, na kterou projekt ukazuje.
async function priprav() {
  await stranka.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
  await nasypej(stranka, [
    { id: 'p1', title: 'Projekt Alfa', aspects: ['Project'] },
    { id: 'p2', title: 'Projekt Beta', aspects: ['Project'] },
    { id: 'u1', title: 'Ukol jedna', aspects: ['Task'] },
    { id: 'u2', title: 'Ukol dva', aspects: ['Task'] },
    { id: 'd1', title: 'Dokument', aspects: ['Note'] },
    { id: 'x1', title: 'Cizi entita', aspects: ['Note'] },
    { id: 'c1', title: 'Cil projektu', aspects: ['Note'] }
  ]);
  await stranka.evaluate(() => {
    // u1, u2, d1 jsou součástí projektu Alfa (ukazují NA něj)
    findEntity('u1').links = [{ to: 'p1', type: 'partOf', note: '' }];
    findEntity('u2').links = [{ to: 'p1', type: 'partOf', note: '' }];
    findEntity('d1').links = [{ to: 'p1', type: 'relatedTo', note: '' }];
    // projekt Alfa ukazuje na cíl (vazba Z něj)
    findEntity('p1').links = [{ to: 'c1', type: 'relatedTo', note: '' }];
    // cizí entita visí u jiného projektu
    findEntity('x1').links = [{ to: 'p2', type: 'partOf', note: '' }];
    state.view = 'all';
    state.filter = { aspect: '', tag: '', text: '', status: '', attrFilters: [] };
    _bulk.active = false; _bulk.selected = new Set();
    render();
  });
  await stranka.waitForTimeout(500);
}

const nazvyVysledku = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#all-results tbody tr td:first-child')].map(td => td.textContent.trim()));
const nastavFiltr = async (klic, id) => {
  await stranka.evaluate(({ klic, id }) => { state.filter[klic] = id; render(); }, { klic, id });
  await stranka.waitForTimeout(500);
  // Panel filtrů je sbalený <details>; pro klikání na tlačítka ho rozbalíme.
  await stranka.evaluate(() => { const d = document.getElementById('filters-details'); if (d) d.open = true; });
  await stranka.waitForTimeout(200);
};

nadpis('Filtry jsou v panelu a dají se ovládat');
await priprav();
await stranka.evaluate(() => { const d = document.getElementById('filters-details'); if (d) d.open = true; });
await stranka.waitForTimeout(300);
const ovladaci = await stranka.evaluate(() => ({
  zBtn: !!document.getElementById('filter-link-from-btn'),
  naBtn: !!document.getElementById('filter-link-to-btn'),
  zPopisek: (document.querySelector('label[for="filter-link-from-btn"]') || {}).textContent,
  naPopisek: (document.querySelector('label[for="filter-link-to-btn"]') || {}).textContent,
  zText: (document.getElementById('filter-link-from-btn') || {}).textContent
}));
ok(s, ovladaci.zBtn && ovladaci.naBtn, 'obě tlačítka jsou ve filtrech', ovladaci);
ok(s, ovladaci.zPopisek === 'Má vazbu z' && ovladaci.naPopisek === 'Má vazbu na', 'popisky sedí', ovladaci);
ok(s, /libovolná/.test(ovladaci.zText), 'bez výběru hlásí „libovolná"', ovladaci);

nadpis('Má vazbu na — co patří k projektu');
await nastavFiltr('linkTo', 'p1');
let v = await nazvyVysledku();
ok(s, v.length === 3, 'projekt Alfa má tři navázané entity', v);
ok(s, v.some(x => x.includes('Ukol jedna')) && v.some(x => x.includes('Ukol dva')) && v.some(x => x.includes('Dokument')),
  'a jsou to ty správné', v);
ok(s, !v.some(x => x.includes('Cizi entita')), 'entita u jiného projektu se nechytla', v);
ok(s, !v.some(x => x.includes('Cil projektu')), 'ani ta, na kterou projekt ukazuje sám', v);
ok(s, !v.some(x => x.includes('Projekt Alfa')), 'ani projekt samotný', v);

nadpis('Má vazbu z — na co ukazuje projekt');
await priprav();
await nastavFiltr('linkFrom', 'p1');
v = await nazvyVysledku();
ok(s, v.length === 1 && v[0].includes('Cil projektu'), 'najde právě cíl, na který projekt ukazuje', v);

nadpis('Popisek tlačítka a zrušení');
await priprav();
await nastavFiltr('linkTo', 'p1');
ok(s, /Projekt Alfa/.test(await stranka.evaluate(() => document.getElementById('filter-link-to-btn').textContent)),
  'tlačítko ukazuje název vybrané entity');
ok(s, await stranka.evaluate(() => !!document.querySelector('button[data-vazba-zrusit="filter-link-to"]')),
  'a je u něj křížek na zrušení');
await stranka.click('button[data-vazba-zrusit="filter-link-to"]');
await stranka.waitForTimeout(600);
ok(s, !(await stranka.evaluate(() => state.filter.linkTo)), 'křížek filtr zruší');
ok(s, (await nazvyVysledku()).length === 7, 'a vrátí se všechny entity', (await nazvyVysledku()).length);

nadpis('Počítá se mezi aktivní filtry a Reset ho smaže');
await priprav();
await nastavFiltr('linkTo', 'p1');
await stranka.evaluate(() => { const d = document.getElementById('filters-details'); if (d) d.open = true; });
await stranka.waitForTimeout(300);
ok(s, /1 aktivních/.test(await stranka.evaluate(() => document.getElementById('filters-summary').textContent)),
  'souhrn hlásí jeden aktivní filtr',
  await stranka.evaluate(() => document.getElementById('filters-summary').textContent));
await stranka.click('#filter-reset');
await stranka.waitForTimeout(700);
ok(s, !(await stranka.evaluate(() => state.filter.linkTo)), 'Reset filtr vazeb smaže');
ok(s, /libovolná/.test(await stranka.evaluate(() => document.getElementById('filter-link-to-btn').textContent)),
  'a tlačítko se vrátí do výchozího stavu');

nadpis('Kombinace s ostatními filtry');
await priprav();
await nastavFiltr('linkTo', 'p1');
await stranka.evaluate(() => { state.filter.aspect = 'Task'; render(); });
await stranka.waitForTimeout(500);
v = await nazvyVysledku();
ok(s, v.length === 2 && v.every(x => x.includes('Ukol')), 'vazba + aspekt se kombinují logikou AND', v);

nadpis('Obě vazby najednou');
await priprav();
await stranka.evaluate(() => {
  // d1 je součástí Alfy a zároveň na něj Alfa ukazuje
  findEntity('p1').links.push({ to: 'd1', type: 'relatedTo', note: '' });
  state.filter.linkTo = 'p1'; state.filter.linkFrom = 'p1'; render();
});
await stranka.waitForTimeout(500);
v = await nazvyVysledku();
ok(s, v.length === 1 && v[0].includes('Dokument'), 'obě podmínky najednou projdou jen oboustranné vazbě', v);

nadpis('Vazba přes atribut typu relation');
await priprav();
await stranka.evaluate(() => {
  db.customAspects = [{ key: 'vazbovy', label: 'Vazbový', fields: [{ key: 'sef', label: 'Šéf', type: 'relation' }] }];
  const e = findEntity('x1');
  e.aspects = ['vazbovy'];
  e.attributes = { sef: 'p1' };
  e.links = [];
  state.filter.linkTo = 'p1'; render();
});
await stranka.waitForTimeout(500);
v = await nazvyVysledku();
ok(s, v.some(x => x.includes('Cizi entita')), 'chytne i vazbu přes atribut typu relation', v);

nadpis('Hromadný výběr nad vyfiltrovaným');
await priprav();
await nastavFiltr('linkTo', 'p1');
await stranka.evaluate(() => { bulkToggle(true); render(); });
await stranka.waitForTimeout(500);
await stranka.evaluate(() => {
  document.querySelectorAll('#all-results tbody input[type="checkbox"]').forEach(cb => {
    if (!cb.checked) { cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true })); }
  });
});
await stranka.waitForTimeout(500);
const vybrane = await stranka.evaluate(() => [...(_bulk.selected || [])].sort());
ok(s, vybrane.length === 3 && vybrane.join(',') === 'd1,u1,u2',
  'hromadný výběr vezme právě entity projektu', vybrane);

nadpis('Uložený pohled si filtr zapamatuje');
await priprav();
await nastavFiltr('linkTo', 'p1');
await stranka.evaluate(() => {
  db.savedViews = [{ id: 'sv1', name: 'Vse k Alfe', filters: JSON.parse(JSON.stringify(state.filter)) }];
  state.view = 'savedView'; state.savedViewId = 'sv1';
  state.filter = { aspect: '', tag: '', text: '', status: '', attrFilters: [] };
  render();
});
await stranka.waitForTimeout(600);
const vPohledu = await stranka.evaluate(() =>
  [...document.querySelectorAll('#view-results tbody tr td:first-child')].map(td => td.textContent.trim()));
ok(s, vPohledu.length === 3, 'uložený pohled filtruje stejně', vPohledu);
ok(s, /má vazbu na/.test(await stranka.evaluate(() => document.querySelector('#main .meta').textContent)),
  'a popis pohledu to zmiňuje',
  await stranka.evaluate(() => document.querySelector('#main .meta').textContent));

nadpis('Nemá žádný tag');
await priprav();
await stranka.evaluate(() => {
  findEntity('u1').tags = ['praca'];
  findEntity('d1').tags = ['praca', 'osobni'];
  // u2, x1, c1, p1, p2 zůstávají bez tagů
  render();   // ať se tagy dostanou do nabídky selectu
});
await stranka.waitForTimeout(400);
await stranka.evaluate(() => {
  const sel = document.getElementById('filter-tag-not');
  sel.value = FILTR_ZADNY_TAG;
  sel.dispatchEvent(new Event('change', { bubbles: true }));
});
await stranka.waitForTimeout(600);
let bt = await nazvyVysledku();
ok(s, bt.length === 5, 'najde právě entity bez jediného tagu', bt);
ok(s, !bt.some(x => x.includes('Ukol jedna')) && !bt.some(x => x.includes('Dokument')),
  'otagované se nechytly', bt);

// konkrétní tag ve stejném selectu funguje dál
await stranka.evaluate(() => {
  const sel = document.getElementById('filter-tag-not');
  sel.value = 'praca';
  sel.dispatchEvent(new Event('change', { bubbles: true }));
});
await stranka.waitForTimeout(600);
bt = await nazvyVysledku();
ok(s, bt.length === 5 && !bt.some(x => x.includes('Ukol jedna')) && !bt.some(x => x.includes('Dokument')),
  '„nemá konkrétní tag" se nerozbilo', bt);

nadpis('Není v žádném projektu');
await priprav();
await stranka.evaluate(() => {
  const sel = document.getElementById('filter-project');
  sel.value = 'none';
  sel.dispatchEvent(new Event('change', { bubbles: true }));
});
await stranka.waitForTimeout(600);
let pr = await nazvyVysledku();
ok(s, !pr.some(x => x.includes('Ukol jedna')) && !pr.some(x => x.includes('Ukol dva')),
  'úkoly navázané na projekt vazbou „je součástí" se nechytly', pr);
ok(s, !pr.some(x => x.includes('Cizi entita')), 'ani entita u druhého projektu', pr);
ok(s, pr.some(x => x.includes('Cil projektu')) && pr.some(x => x.includes('Projekt Alfa')),
  'ostatní ano — projekt sám v žádném projektu není', pr);
ok(s, pr.some(x => x.includes('Dokument')),
  'a „souvisí s" projektem nestačí, musí to být „je součástí"', pr);

await stranka.evaluate(() => {
  const sel = document.getElementById('filter-project');
  sel.value = 'any';
  sel.dispatchEvent(new Event('change', { bubbles: true }));
});
await stranka.waitForTimeout(600);
pr = await nazvyVysledku();
ok(s, pr.length === 3 && pr.every(x => /Ukol|Cizi/.test(x)),
  'opačná volba najde právě ty v projektech', pr);

nadpis('Oba nové filtry v uloženém pohledu');
await priprav();
await stranka.evaluate(() => {
  findEntity('u1').tags = ['praca'];
  db.savedViews = [{ id: 'sv2', name: 'Bez tagu mimo projekty',
    filters: { tagNot: FILTR_ZADNY_TAG, project: 'none' } }];
  state.view = 'savedView'; state.savedViewId = 'sv2'; render();
});
await stranka.waitForTimeout(600);
const vp = await stranka.evaluate(() =>
  [...document.querySelectorAll('#view-results tbody tr td:first-child')].map(td => td.textContent.trim()));
ok(s, vp.length > 0 && !vp.some(x => x.includes('Ukol')), 'pohled kombinuje obojí', vp);
const popis = await stranka.evaluate(() => document.querySelector('#main .meta').textContent);
ok(s, /bez tagů/.test(popis) && /mimo projekty/.test(popis), 'a popis pohledu je čitelný', popis);

nadpis('Smazaná entita filtr nerozbije');
await priprav();
await nastavFiltr('linkTo', 'neexistujici-id');
ok(s, (await nazvyVysledku()).length === 0, 'neznámé id prostě nic nenajde');
ok(s, s.chyby.length === 0, 'a nic nespadne');

await prohlizec.close();
process.exit(uzavri(s));
