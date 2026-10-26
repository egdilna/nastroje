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
    newEntity({ id: 'a5', title: 'Anna Malá', aspects: ['Person'] }),
    newEntity({ id: 'o1', title: 'Firma XY, s.r.o.', aspects: ['Organization'] }),
    newEntity({ id: 'o2', title: 'Úřad Žatec', aspects: ['Organization'] }),
    newEntity({ id: 'z1', title: 'Jan Zaměstnanec', aspects: ['Person'],
      links: [{ to: 'o1', type: 'worksAt' }] }),
    newEntity({ id: 'z2', title: 'Eva Úřednice', aspects: ['Person'],
      links: [{ to: 'o2', type: 'worksAt' }] }),
    newEntity({ id: 'u1', title: 'Dopsat zápis', aspects: ['Task'], attributes: { status: 'done' } })
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

nadpis('Hledání podle organizace, ve které osoba pracuje');
// V řádku je organizace vidět („Jan Zaměstnanec (Firma XY, s.r.o.)"), ale hledat
// podle ní dřív nešlo: bylo vidět, kdo pracuje ve firmě XY, a „xy" nenašlo nikoho.
for (const dotaz of ['xy', 'XY', 'Firma XY']) {
  const v = await hledej(dotaz);
  ok(s, v.some(x => x.includes('Jan Zaměstnanec')),
    '„' + dotaz + '" najde osobu podle její organizace', v);
}
const vOrg = await hledej('xy');
ok(s, vOrg.some(x => x.includes('Firma XY')), 'a samotnou organizaci taky');
ok(s, !vOrg.some(x => x.includes('Eva Úřednice') || x.includes('Anna')),
  'osoby z jiné (nebo žádné) organizace se nepletou', vOrg);

ok(s, (await hledej('zatec')).some(x => x.includes('Eva Úřednice')),
  'organizace se hledá i bez diakritiky');
ok(s, (await hledej('Žatec')).some(x => x.includes('Eva Úřednice')),
  'a stejně tak s diakritikou');

const spolu = await hledej('eva zatec');
ok(s, spolu.some(x => x.includes('Eva Úřednice')) && !spolu.some(x => x.includes('Jan Zaměstnanec')),
  'jedno slovo z názvu a druhé z organizace platí jako AND', spolu);

nadpis('Hledá se i podle stavu úkolu — je taky v řádku vidět');
ok(s, (await hledej('hotovo')).some(x => x.includes('Dopsat zápis')),
  '„hotovo" najde hotový úkol podle stavu v popisku');

nadpis('Co se nemá najít');
const nic = await hledej('naprostoneexistujici');
ok(s, !nic.some(x => x.includes('Petr') || x.includes('Anna') || x.includes('Uklid')),
  'nesmyslný dotaz nevrátí entity', nic);

await prohlizec.close();
process.exit(uzavri(s));
