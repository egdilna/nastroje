// PALETA — tagy ve výsledcích a přechod na tag.
//
// Tag je v paletě plnohodnotný cíl: napsat jeho název (nebo „#") a Enterem
// skočit na entity, které ho mají. Hlídá se tu i pořadí — když uživatel napíše
// název tagu, nesmí ho odsunout příkaz, který se shodl jen volně.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const s = novySoucet('Paleta — tagy');
const { prohlizec, stranka } = await otevriAplikaci(s);

await nasypej(stranka, [
  { id: 't1', title: 'Jedna', aspects: ['Note'], tags: ['projekt', 'osobni'] },
  { id: 't2', title: 'Dva', aspects: ['Note'], tags: ['projekt'] },
  { id: 't3', title: 'Tri', aspects: ['Note'], tags: ['projekt', 'archiv'] },
  { id: 't4', title: 'Ctyri', aspects: ['Note'], tags: ['osobni'] },
  { id: 't5', title: 'Pet', aspects: ['Note'], tags: ['zahrada'] },
  { id: 't6', title: 'Sest', aspects: ['Note'], tags: ['kolega'] },
  { id: 't7', title: 'Sedm', aspects: ['Note'], tags: ['nakup'] },
  { id: 't8', title: 'Osm', aspects: ['Note'], tags: ['cteni'] },
  { id: 't9', title: 'Devet', aspects: ['Note'], tags: ['schůzka'] },
  { id: 't10', title: 'Archivovana', aspects: ['Note'], tags: ['projekt'], archived: true }
]);

const polozky = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#pal-list .pal-item .pal-label')].map(e => e.textContent));
const skupiny = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#pal-list .pal-skupina')].map(e => e.textContent));
// Položky pod hlavičkou skupiny „Tagy". Filtrovat podle emoji nejde – navigační
// příkaz „🏷 Tagy" (pohled) ho má taky.
const tagyVeSkupine = () => stranka.evaluate(() => {
  const out = [];
  let vSkupine = false;
  [...document.querySelectorAll('#pal-list li')].forEach(li => {
    if (li.classList.contains('pal-skupina')) { vSkupine = li.textContent === 'Tagy'; return; }
    if (vSkupine) {
      const b = li.querySelector('.pal-item .pal-label');
      if (b) out.push(b.textContent);
    }
  });
  return out;
});
const napovedy = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#pal-list .pal-item')].map(e => ({
    label: e.querySelector('.pal-label').textContent,
    hint: (e.querySelector('.pal-hint') || {}).textContent || ''
  })));

async function otevriPaletu(dotaz) {
  await stranka.evaluate(() => { const d = document.getElementById('dialog-palette'); if (d && d.open) d.close(); });
  await stranka.waitForTimeout(200);
  await stranka.keyboard.press('F1');
  await stranka.waitForTimeout(400);
  if (dotaz !== undefined) { await stranka.fill('#pal-input', dotaz); await stranka.waitForTimeout(400); }
}

nadpis('Prázdná paleta nabídne tagy');
await otevriPaletu();
const skupinyPrazdne = await skupiny();
ok(s, skupinyPrazdne.includes('Tagy'), 'skupina Tagy je i bez psaní', skupinyPrazdne);
const tagyPrazdne = await tagyVeSkupine();
ok(s, tagyPrazdne.length > 0, 'a nějaké tagy ukazuje', tagyPrazdne);
ok(s, tagyPrazdne[0] === '🏷 projekt', 'nejpoužívanější tag je první', tagyPrazdne);
ok(s, tagyPrazdne.length <= 8, 'v prázdné paletě jich není víc než osm', tagyPrazdne.length);

nadpis('Počet entit u tagu');
const sHinty = (await napovedy()).filter(x => x.label.startsWith('🏷'));
const projekt = sHinty.find(x => x.label === '🏷 projekt');
ok(s, projekt && /3 entity/.test(projekt.hint), 'tag hlásí počet entit a nepočítá archivované', projekt);
const zahrada = sHinty.find(x => x.label === '🏷 zahrada');
ok(s, zahrada && /1 entita/.test(zahrada.hint), 'a skloňuje správně', zahrada);

nadpis('Psaní názvu tagu ho vytáhne nahoru');
await otevriPaletu('projekt');
const prvni = (await polozky())[0];
ok(s, prvni === '🏷 projekt', 'tag je na prvním místě, ne za nesouvisejícími příkazy', prvni);
ok(s, (await skupiny())[0] === 'Tagy', 'a skupina Tagy je první', await skupiny());

nadpis('Předpona # hledá jen tagy');
await otevriPaletu('#');
const vseTagy = await polozky();
ok(s, vseTagy.length > 0 && vseTagy.every(t => t.startsWith('🏷 ')), 'samotné # vypíše jen tagy', vseTagy);
ok(s, (await skupiny()).join() === 'Tagy', 'a žádnou jinou skupinu', await skupiny());
ok(s, vseTagy.includes('🏷 schůzka'), 'včetně tagu s diakritikou', vseTagy);

await otevriPaletu('#schuzka');
ok(s, (await polozky()).some(t => t === '🏷 schůzka'), 'a hledá se bez diakritiky', await polozky());

await otevriPaletu('#zah');
ok(s, (await polozky()).some(t => t === '🏷 zahrada'), 'i podle části názvu', await polozky());

nadpis('Enter přejde na tag');
await otevriPaletu('#projekt');
await stranka.keyboard.press('Enter');
await stranka.waitForTimeout(800);
const stav = await stranka.evaluate(() => ({
  paletaOtevrena: !!(document.getElementById('dialog-palette') || {}).open,
  view: state.view, tag: state.filter.tag, aspekt: state.filter.aspect, text: state.filter.text,
  radky: document.querySelectorAll('#all-results tbody tr').length,
  vyber: !!(typeof _bulk !== 'undefined' && _bulk.active)
}));
ok(s, !stav.paletaOtevrena, 'paleta se zavřela', stav);
ok(s, stav.view === 'all', 'jsme v pohledu Vše', stav);
ok(s, stav.tag === 'projekt', 'filtr je nastavený na ten tag', stav);
ok(s, stav.radky === 3, 'a ukazuje právě jeho entity', stav);
ok(s, !stav.aspekt && !stav.text, 'ostatní filtry se vyčistily', stav);
ok(s, !stav.vyber, 'režim hromadného výběru se nezapnul', stav);

nadpis('Přechod na jiný tag přepíše ten předchozí');
await otevriPaletu('#osobni');
await stranka.keyboard.press('Enter');
await stranka.waitForTimeout(800);
const stav2 = await stranka.evaluate(() => ({
  tag: state.filter.tag, radky: document.querySelectorAll('#all-results tbody tr').length
}));
ok(s, stav2.tag === 'osobni' && stav2.radky === 2, 'druhý tag nahradil první', stav2);

nadpis('Klik myší funguje stejně');
await otevriPaletu('#kolega');
await stranka.evaluate(() => {
  const b = [...document.querySelectorAll('#pal-list .pal-item')]
    .find(x => x.textContent.includes('kolega'));
  if (b) b.click();
});
await stranka.waitForTimeout(800);
ok(s, (await stranka.evaluate(() => state.filter.tag)) === 'kolega', 'kliknutí na tag přejde stejně jako Enter');

nadpis('Databáze bez tagů paletu nerozbije');
await nasypej(stranka, [{ id: 'b1', title: 'Bez tagu', aspects: ['Note'], body: 'text' }]);
const chybPred = s.chyby.length;
await otevriPaletu();
ok(s, s.chyby.length === chybPred, 'prázdná paleta bez tagů nespadne');
ok(s, !(await skupiny()).includes('Tagy'), 'a skupinu Tagy vůbec nenabídne', await skupiny());
await otevriPaletu('#');
ok(s, (await polozky()).length === 0, 'samotné # nic nenajde', await polozky());

await prohlizec.close();
process.exit(uzavri(s));
