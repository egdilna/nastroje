// VYBRAT ENTITU — dialog pro cíl vazby, wiki odkaz, include i status chip.
// Hledat se musí v názvu, tazích i TYPU (aspektu), bez ohledu na velikost
// písmen a diakritiku: „cinnost" má najít všechny entity typu „Činnost".
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Výběr entity');
const { prohlizec, stranka } = await otevriAplikaci(s);

await stranka.evaluate(() => {
  db.customAspects = [{ key: 'cinnost', label: 'Činnost', fields: [] }];
  db.entities = [
    newEntity({ id: 'a1', title: 'Zalevani kvetin', aspects: ['cinnost'] }),
    newEntity({ id: 'a2', title: 'Uklid dilny', aspects: ['cinnost'] }),
    newEntity({ id: 'a3', title: 'Činnost na zahradě', aspects: ['Note'] }),
    newEntity({ id: 'a4', title: 'Petr Novák', aspects: ['Person'], tags: ['kolega'] }),
    newEntity({ id: 'a5', title: 'Anna Malá', aspects: ['Person'] })
  ];
  state.view = 'dashboard'; render();
});
await stranka.waitForTimeout(400);

async function hledej(dotaz) {
  await stranka.evaluate(() => openRelationPicker({ fieldLabel: 'test', multiple: false, onSelect: () => {} }));
  await stranka.waitForTimeout(350);
  await stranka.fill('#rp-search', dotaz);
  await stranka.waitForTimeout(450);
  const v = await stranka.evaluate(() =>
    [...document.querySelectorAll('#rp-list li')].map(li => li.textContent.trim().replace(/\s+/g, ' ')));
  await stranka.evaluate(() => document.getElementById('relation-picker').close());
  await stranka.waitForTimeout(200);
  return v;
}

nadpis('Hledání podle typu');
for (const dotaz of ['Činnost', 'činnost', 'ČINNOST', 'cinnost', 'CINNOST']) {
  const v = await hledej(dotaz);
  const maObe = v.some(x => x.includes('Zalevani')) && v.some(x => x.includes('Uklid'));
  ok(s, maObe, '„' + dotaz + '" najde obě entity typu Činnost', v);
}
const vCinnost = await hledej('Činnost');
ok(s, vCinnost.some(x => x.includes('Činnost na zahradě')),
  'a zároveň entitu, která to má v názvu');

nadpis('Hledání podle názvu a tagu');
ok(s, (await hledej('Novák')).some(x => x.includes('Petr Novák')), 'název s diakritikou');
ok(s, (await hledej('novak')).some(x => x.includes('Petr Novák')), 'název bez diakritiky');
ok(s, (await hledej('kolega')).some(x => x.includes('Petr Novák')), 'tag');
ok(s, (await hledej('Osoba')).length >= 2, 'vestavěný typ Osoba');

nadpis('Víc slov je AND');
const vic = await hledej('osoba anna');
ok(s, vic.some(x => x.includes('Anna')) && !vic.some(x => x.includes('Petr')),
  'dvě slova zúží výsledek, ne rozšíří', vic);

nadpis('Co se nemá najít');
const nic = await hledej('naprostoneexistujici');
ok(s, !nic.some(x => x.includes('Petr') || x.includes('Anna') || x.includes('Uklid')),
  'nesmyslný dotaz nevrátí entity', nic);

await prohlizec.close();
process.exit(uzavri(s));
