// LIMIT VE VŠE — do stránky se smí vykreslit jen zvolený počet řádků.
// Smysl je výkonnostní: nad tisíci entitami se nesmí generovat HTML pro všechny.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Limit v pohledu Vše');
const { prohlizec, stranka } = await otevriAplikaci(s);

await stranka.evaluate(() => {
  db.entities = [];
  for (let i = 0; i < 2500; i++) {
    db.entities.push(newEntity({ id: 'e' + i, title: 'Entita ' + String(i).padStart(4, '0'),
      aspects: ['Note'], body: 'text ' + i }));
  }
  state.view = 'all';
  state.filter = { aspect: '', tag: '', text: '', status: '', attrFilters: [] };
  state._allLimit = undefined;
  render();
});
await stranka.waitForTimeout(700);

const radky = () => stranka.evaluate(() => document.querySelectorAll('#all-results tbody tr').length);
const popis = () => stranka.evaluate(() => (document.querySelector('#all-results .meta') || {}).textContent || '');

nadpis('Select a výchozí stav');
const volby = await stranka.evaluate(() =>
  [...document.querySelectorAll('#all-limit option')].map(o => o.value).join(','));
ok(s, volby === '100,300,500,1000,2000,0', 'nabídka je 100/300/500/1000/2000/vše', volby);
ok(s, (await stranka.evaluate(() => document.getElementById('all-limit').value)) === '100', 'výchozí je 100');
ok(s, (await radky()) === 100, 'a vykreslí se přesně 100 řádků z 2500', await radky());
ok(s, /Nalezeno 2500 entit/.test(await popis()) && /Zobrazeno prvních 100/.test(await popis()),
  'počet hlásí celek i ořez', await popis());

nadpis('Každá volba vykreslí přesně tolik řádků');
for (const [hodnota, ocekavano] of [['300', 300], ['500', 500], ['1000', 1000], ['2000', 2000], ['0', 2500], ['100', 100]]) {
  await stranka.selectOption('#all-limit', hodnota);
  await stranka.waitForTimeout(450);
  const n = await radky();
  ok(s, n === ocekavano, 'limit ' + (hodnota === '0' ? 'vše' : hodnota) + ' → ' + ocekavano + ' řádků', n);
}

nadpis('Limit se drží i s filtrem a řazením');
await stranka.fill('#filter-text', 'Entita 01');
await stranka.waitForTimeout(700);
ok(s, (await radky()) === 100, 'filtrovaný výsledek je taky oříznutý na 100', await radky());
ok(s, /Nalezeno 179 entit/.test(await popis()), 'ale hlásí skutečný počet nálezů', await popis());
await stranka.selectOption('#all-limit', '0');
await stranka.waitForTimeout(500);
ok(s, (await radky()) === 179, 'a „vše" ukáže všech 179', await radky());

await stranka.fill('#filter-text', '');
await stranka.waitForTimeout(600);
await stranka.selectOption('#all-limit', '300');
await stranka.waitForTimeout(450);
await stranka.evaluate(() => document.querySelector('#all-results button.th-sort').click());
await stranka.waitForTimeout(600);
ok(s, (await radky()) === 300 && (await stranka.evaluate(() => document.getElementById('all-limit').value)) === '300',
  'kliknutí na řazení limit neztratí');

await prohlizec.close();
process.exit(uzavri(s));
