// Sekce v detailu entity: Nedokončené položky, Příznaky, Critic komentáře
// a Anotace jsou rozbalené, a v Nedokončených položkách jdou úkoly rovnou
// odškrtnout.
//
// Odškrtnutí zapisuje na KONKRÉTNÍ ŘÁDEK zdroje (collectUnfinishedMdTasks ho
// vrací), ne na N-tý výskyt a ne podle textu. Proto jsou v datech schválně dva
// stejně znějící úkoly a úkoly ve dvou zdrojích (tělo + textový atribut) —
// kdyby se počítalo pořadím, trefí se jiný.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, telo, uzavri } from './lib.mjs';

const soucet = novySoucet('Sekce v detailu entity');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const TELO = [
  '# Kanarek-NADPIS 🚩', '',
  '- [ ] stejny ukol', '- [x] uz hotovy', '- [ ] stejny ukol', '',
  '## Dalsi', '',
  '- [ ] treti ukol (>anotace k radku)', '',
  'Text s {>>critic poznamka<<} uvnitr.'
].join('\n');

async function priprav() {
  await nasypej(stranka, [{ id: 'e1', title: 'Zapis', aspects: ['Note'], body: TELO }]);
  await stranka.evaluate(() => { db.flagEmojis = ['🚩']; });
  await otevriDetail(stranka, 'e1');
}

const sekce = () => stranka.evaluate(() => {
  const podleSummary = (txt) => {
    const d = Array.from(document.querySelectorAll('details')).find(x => {
      const s = x.querySelector('summary');
      return s && s.textContent.trim().startsWith(txt);
    });
    return d ? d.open : null;
  };
  return {
    ukoly: podleSummary('Nedokončené položky'),
    priznaky: podleSummary('Příznaky'),
    critic: podleSummary('💬'),
    anotace: podleSummary('Anotace')
  };
});

nadpis('Čtyři sekce jsou rozbalené');
await priprav();
const s = await sekce();
ok(soucet, s.ukoly === true, 'Nedokončené položky jsou rozbalené', s);
ok(soucet, s.priznaky === true, 'Příznaky jsou rozbalené', s);
ok(soucet, s.critic === true, 'Komentáře v textu (CriticMarkup) jsou rozbalené', s);
ok(soucet, s.anotace === true, 'Anotace jsou rozbalené', s);

nadpis('Seznam nedokončených položek má zaškrtávátka');
const polozky = await stranka.evaluate(() =>
  Array.from(document.querySelectorAll('details.md-tasks-section input.md-sekce-ukol')).map(cb => ({
    zdroj: cb.dataset.mdtSource, radek: cb.dataset.mdtLine, text: cb.dataset.mdtText,
    zaskrtnuto: cb.checked,
    vLabelu: !!cb.closest('label')
  })));
ok(soucet, polozky.length === 3, 'jsou tam všechny tři nedokončené úkoly', polozky);
ok(soucet, polozky.every(x => x.zaskrtnuto === false), 'žádný není předem zaškrtnutý');
ok(soucet, polozky.every(x => x.zdroj === 'body'), 'úkoly z těla mají zdroj body', polozky);
ok(soucet, polozky.map(x => x.radek).join(',') === '2,4,8',
  'každý úkol si nese své číslo řádku ve zdroji', polozky);
ok(soucet, polozky.every(x => x.vLabelu), 'zaškrtávátko je v <label>, takže jde kliknout i na text');

nadpis('Zaškrtnutí trefí ten správný řádek, i když je text stejný');
async function zaskrtni(index) {
  await stranka.evaluate((index) => {
    const cb = document.querySelectorAll('details.md-tasks-section input.md-sekce-ukol')[index];
    cb.checked = true;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  }, index);
  await stranka.waitForTimeout(550);
}

await priprav();
await zaskrtni(1);   // DRUHÝ ze dvou stejně znějících „stejny ukol"
let body = await telo(stranka, 'e1');
ok(soucet, body === TELO.replace('- [ ] stejny ukol\n\n', '- [x] stejny ukol\n\n'),
  'zaškrtl se DRUHÝ ze dvou stejných úkolů, zbytek textu je do znaku stejný', body);

await priprav();
await zaskrtni(0);   // první
body = await telo(stranka, 'e1');
ok(soucet, body.split('\n')[2] === '- [x] stejny ukol' && body.split('\n')[4] === '- [ ] stejny ukol',
  'a naopak první zaškrtne první', body.split('\n').slice(2, 5));
ok(soucet, body.replace('- [x] stejny ukol', '- [ ] stejny ukol') === TELO,
  'nic jiného se nezměnilo (kanárek)', body);

nadpis('Hotový úkol ze seznamu zmizí a počet se sníží');
const po = await stranka.evaluate(() => {
  const d = document.querySelector('details.md-tasks-section');
  return {
    souhrn: d.querySelector('summary').textContent.trim(),
    otevrena: d.open,
    zbyle: Array.from(d.querySelectorAll('input.md-sekce-ukol')).map(cb => cb.dataset.mdtText)
  };
});
ok(soucet, po.souhrn === 'Nedokončené položky (2)', 'počet v hlavičce klesl na 2', po.souhrn);
ok(soucet, po.zbyle.length === 2, 'v seznamu zbyly dvě položky', po.zbyle);
ok(soucet, po.otevrena === true, 'sekce zůstala po překreslení rozbalená', po);

nadpis('Úkoly z textového atributu se zapisují do atributu, ne do těla');
await nasypej(stranka, [{ id: 'e2', title: 'S atributem', aspects: ['Note'],
  body: '- [ ] ukol v tele' }]);
await stranka.evaluate(() => {
  const e = findEntity('e2');
  e.customFields = [{ key: 'pozn', label: 'Poznámky', type: 'textarea' }];
  e.attributes = { pozn: '- [ ] ukol v atributu' };
});
await otevriDetail(stranka, 'e2');
const zdroje = await stranka.evaluate(() =>
  Array.from(document.querySelectorAll('details.md-tasks-section input.md-sekce-ukol'))
    .map(cb => cb.dataset.mdtSource + ' | ' + cb.dataset.mdtText));
ok(soucet, zdroje.length === 2 && zdroje.some(z => z.startsWith('attr:pozn')),
  'v seznamu jsou úkoly z těla i z textového atributu', zdroje);
const idxAttr = zdroje.findIndex(z => z.startsWith('attr:pozn'));
await stranka.evaluate((i) => {
  const cb = document.querySelectorAll('details.md-tasks-section input.md-sekce-ukol')[i];
  cb.checked = true;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
}, idxAttr);
await stranka.waitForTimeout(550);
const stav2 = await stranka.evaluate(() => {
  const e = findEntity('e2');
  return { telo: e.body, attr: e.attributes.pozn };
});
ok(soucet, stav2.attr === '- [x] ukol v atributu', 'úkol v atributu se zaškrtl v atributu', stav2);
ok(soucet, stav2.telo === '- [ ] ukol v tele', 'tělo entity zůstalo nedotčené (kanárek)', stav2);

nadpis('Když se text mezitím změní, nezapíše se nic');
await priprav();
const obrana = await stranka.evaluate(async () => {
  const cb = document.querySelector('details.md-tasks-section input.md-sekce-ukol');
  // Podstrčit jiný text, než jaký je na tom řádku
  cb.dataset.mdtText = 'neco uplne jineho';
  cb.checked = true;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(z => setTimeout(z, 400));
  // alertMsg píše do aria-live oblasti #alert-region
  const oblast = document.getElementById('alert-region');
  return { telo: findEntity('e1').body, zaskrtnuto: cb.checked,
    hlaska: !!(oblast && /nepodařilo najít/.test(oblast.textContent || '')) };
});
ok(soucet, obrana.telo === TELO, 'text entity se nezměnil, když očekávaný úkol na řádku není', obrana.telo);
ok(soucet, obrana.zaskrtnuto === false, 'zaškrtávátko se vrátilo zpátky', obrana);
ok(soucet, obrana.hlaska === true, 'a uživatel se to dozvěděl hláškou', obrana);

await prohlizec.close();
process.exit(uzavri(soucet));
