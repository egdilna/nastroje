// Import balíčku: definice aspektů a atributů jdou s entitami.
//
// Dřív import „Jen entity" definice vlastních aspektů zahodil a jejich hodnoty
// se v cílovém PIM ukazovaly jako vlastní atributy entity. Sada simuluje dva
// PIMy v jednom okně: export se vyrobí z „domácí" báze, pak se báze vymění za
// „cizí" (jiné vlastní aspekty, vypnutý vestavěný aspekt) a importuje se.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const s = novySoucet('Import: definice aspektů');
const { prohlizec, stranka } = await otevriAplikaci(s);

const SMLOUVA = { key: 'Smlouva', label: 'Smlouva', fields: [
  { key: 'cislo_smlouvy', label: 'Číslo smlouvy', type: 'text' },
  { key: 'stav_smlouvy', label: 'Stav smlouvy', type: 'select', options: ['návrh', 'podepsaná', 'ukončená'] },
  { key: 'protistrana', label: 'Protistrana', type: 'relation' }
] };
const NEPOUZITY = { key: 'Nepouzity', label: 'Nepoužitý', fields: [{ key: 'x', label: 'X', type: 'text' }] };

// ---- domácí PIM: export ----
await stranka.evaluate(({ SMLOUVA, NEPOUZITY }) => { db.customAspects = [SMLOUVA, NEPOUZITY]; }, { SMLOUVA, NEPOUZITY });
await nasypej(stranka, [
  { id: 'sm1', title: 'Smlouva o dílo', aspects: ['Note', 'Smlouva'], tags: ['prenos'],
    attributes: { cislo_smlouvy: 'S-2026-01', stav_smlouvy: 'podepsaná', protistrana: 'org1' } },
  { id: 'org1', title: 'Firma a.s.', aspects: ['Organization'], tags: ['prenos'] },
  { id: 'kn1', title: 'Kniha', aspects: ['Book'], tags: ['prenos'], attributes: { author: 'Autor' } }
], { customAspects: [SMLOUVA, NEPOUZITY] });
await stranka.evaluate(({ SMLOUVA, NEPOUZITY }) => { db.customAspects = [SMLOUVA, NEPOUZITY]; }, { SMLOUVA, NEPOUZITY });

const balicek = await stranka.evaluate(() => buildJsonExport('tags', { tags: ['prenos'] }));
ok(s, (balicek.db.customAspects || []).map(a => a.key).join(',') === 'Smlouva', 'export podle tagů nese definici použitého vlastního aspektu (a nepoužitý ne)', balicek.db.customAspects);
const balicekVse = await stranka.evaluate(() => buildJsonExport('full'));
ok(s, balicekVse.db.customAspects.length === 2, 'export celé báze nese všechny vlastní aspekty');
for (const [rozsah, volby] of [['selected', { entityIds: ['sm1'] }], ['view', {}]]) {
  const b = await stranka.evaluate(({ rozsah, volby }) => { state.view = 'all'; return buildJsonExport(rozsah, volby); }, { rozsah, volby });
  ok(s, !b.db.entities.some(e => e.aspects.includes('Smlouva')) || b.db.customAspects.some(a => a.key === 'Smlouva'),
    'rozsah ' + rozsah + ': entita s vlastním aspektem → definice v balíčku');
}

// ---- cizí PIM: jiný stav ----
async function cizíPim(nastav) {
  await stranka.evaluate((nastav) => {
    db.entities = [];
    db.customAspects = nastav.aspekty || [];
    state.settings.disabledAspects = nastav.vypnute || [];
    render();
  }, nastav);
}

nadpis('„Jen entity" do PIM bez těch aspektů');
await cizíPim({ vypnute: ['Book'] });
const log1 = await stranka.evaluate(async (b) => {
  const log = await performImport(b, 'skip', 'entities');
  return { log, aspekty: db.customAspects.map(a => a.key), vypnute: state.settings.disabledAspects.slice(),
    popis: popisImportuDefinic(log.definice) };
}, balicek);
ok(s, log1.aspekty.join(',') === 'Smlouva', 'definice Smlouvy se převzala (nepoužitý aspekt ne)', log1.aspekty);
ok(s, !log1.vypnute.includes('Book'), 'vypnutý vestavěný aspekt Kniha se zapnul', log1.vypnute);
ok(s, /Smlouva/.test(log1.popis) && /Kniha|Book/.test(log1.popis), 'a hlášení o importu to říká', log1.popis);

await otevriDetail(stranka, 'sm1', 'read');
const cteni = await stranka.evaluate(() => document.querySelector('#main, main').textContent);
ok(s, cteni.includes('Číslo smlouvy') && cteni.includes('S-2026-01') && cteni.includes('Stav smlouvy'), 'v detailu jsou pole pod popisky aspektu');
ok(s, !/cislo_smlouvy|stav_smlouvy/.test(cteni), 'a ne jako vlastní atributy se syrovým klíčem');
const vlastni = await stranka.evaluate(() => findOrphanAttributeKeys(findEntity('sm1'), []));
ok(s, vlastni.length === 0, 'entita nemá žádný „osiřelý" atribut', vlastni);
await otevriDetail(stranka, 'sm1', 'edit');
const editace = await stranka.evaluate(() => {
  const leg = [...document.querySelectorAll('legend')].find(l => /Vlastní atributy/.test(l.textContent));
  return { vlastni: leg ? leg.parentElement.textContent : '', vse: document.querySelector('#main, main').textContent };
});
ok(s, !/cislo_smlouvy|stav_smlouvy/.test(editace.vlastni), 'ani v editaci nejsou mezi vlastními atributy', editace.vlastni.slice(0, 200));
await otevriDetail(stranka, 'kn1', 'edit');
const kniha = await stranka.evaluate(() => {
  const leg = [...document.querySelectorAll('legend')].find(l => /Vlastní atributy/.test(l.textContent));
  return leg ? leg.parentElement.textContent : '';
});
ok(s, !/author/.test(kniha), 'pole vestavěného aspektu (dřív vypnutého) nejsou vlastní atributy', kniha.slice(0, 200));
await stranka.evaluate(() => { state.detailMode = 'read'; setView('dashboard'); });

nadpis('Cílový PIM má starší verzi téhož aspektu');
await cizíPim({ aspekty: [{ key: 'Smlouva', label: 'Smlouva (místní)', fields: [
  { key: 'cislo_smlouvy', label: 'Číslo (místní popisek)', type: 'text' },
  { key: 'stav_smlouvy', label: 'Stav', type: 'select', options: ['návrh', 'zrušená'] },
  { key: 'protistrana', label: 'Protistrana', type: 'text' }
] }] });
const log2 = await stranka.evaluate(async (b) => {
  const log = await performImport(b, 'skip', 'entities');
  const sm = db.customAspects.find(a => a.key === 'Smlouva');
  return { log: log.definice, sm };
}, balicek);
const stav = log2.sm.fields.find(f => f.key === 'stav_smlouvy');
ok(s, log2.sm.label === 'Smlouva (místní)' && log2.sm.fields.find(f => f.key === 'cislo_smlouvy').label === 'Číslo (místní popisek)',
  'místní popisky se nepřepsaly', log2.sm);
ok(s, stav.options.join('|') === 'návrh|zrušená|podepsaná|ukončená', 'volby výběru doplněné (místní zůstaly)', stav.options);
ok(s, log2.sm.fields.find(f => f.key === 'protistrana').type === 'text' && log2.log.spory.length === 1,
  'nesoulad typu: ponechán místní a nahlášen', log2.log.spory);
// chybějící pole se doplní
await cizíPim({ aspekty: [{ key: 'Smlouva', label: 'Smlouva', fields: [{ key: 'cislo_smlouvy', label: 'Číslo', type: 'text' }] }] });
const log3 = await stranka.evaluate(async (b) => {
  const log = await performImport(b, 'skip', 'entities');
  return { klice: db.customAspects[0].fields.map(f => f.key).join(','), n: log.definice.doplnenoPoli };
}, balicek);
ok(s, log3.klice === 'cislo_smlouvy,stav_smlouvy,protistrana' && log3.n === 2, 'chybějící pole se doplní', log3);

nadpis('„Vše" přinese i nepoužité vlastní aspekty');
await cizíPim({});
const log4 = await stranka.evaluate(async (b) => { await performImport(b, 'skip', 'all'); return db.customAspects.map(a => a.key).sort().join(','); }, balicekVse);
ok(s, log4 === 'Nepouzity,Smlouva', 'u „Vše" jsou oba', log4);

nadpis('Starý balíček bez definic');
await cizíPim({});
const log5 = await stranka.evaluate(async (b) => {
  const stary = JSON.parse(JSON.stringify(b)); stary.db.customAspects = [];
  const log = await performImport(stary, 'skip', 'entities');
  return popisImportuDefinic(log.definice);
}, balicek);
ok(s, /bez definice.*Smlouva/.test(log5), 'aspekt bez definice se nahlásí, nic se nevymýšlí', log5);

nadpis('Nové ID: odkazy jen v importovaných entitách');
await cizíPim({});
const remap = await stranka.evaluate(async (b) => {
  // Cílový PIM už má sm1 i org1 a místní entitu, která na org1 odkazuje.
  db.entities = [
    newEntity({ id: 'org1', title: 'Firma (místní)', aspects: ['Organization'] }),
    newEntity({ id: 'sm1', title: 'Smlouva (místní)', aspects: ['Note'] }),
    newEntity({ id: 'loc', title: 'Místní', aspects: ['Note'], links: [{ type: 'relatedTo', to: 'org1' }] })
  ];
  await performImport(b, 'new-id', 'entities');
  const nova = db.entities.find(e => e.title === 'Smlouva o dílo (importováno)');
  const novaOrg = db.entities.find(e => e.title === 'Firma a.s. (importováno)');
  return {
    mistniVazba: findEntity('loc').links[0].to,
    relace: nova && nova.attributes.protistrana,
    novaOrg: novaOrg && novaOrg.id
  };
}, balicek);
ok(s, remap.mistniVazba === 'org1', 'místní entita dál odkazuje na místní verzi (dřív se přesměrovala na kopii)', remap);
ok(s, remap.relace === remap.novaOrg && remap.relace !== 'org1', 'atribut typu relace v importované entitě míří na importovanou kopii', remap);

nadpis('Dialog importu: celou cestou přes UI');
await cizíPim({});
await stranka.evaluate(() => openImportDialog());
await stranka.setInputFiles('#imp-file', { name: 'balicek.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(balicek)) });
await stranka.waitForTimeout(500);
const popisek = await stranka.evaluate(() => document.querySelector('input[name="imp-scope"][value="entities"]').parentElement.textContent);
ok(s, /definicemi aspektů a atributů/.test(popisek), 'volba „Jen entity" říká, že definice jdou s nimi', popisek);
await stranka.click('#imp-go');
await stranka.waitForTimeout(600);
const poUi = await stranka.evaluate(() => ({ aspekty: db.customAspects.map(a => a.key).join(','), hlaska: document.getElementById('alert-region').textContent }));
ok(s, poUi.aspekty === 'Smlouva' && /Definice:.*Smlouva/.test(poUi.hlaska), 'import přes dialog převezme definici a ohlásí ji', poUi);

await prohlizec.close();
process.exit(uzavri(s));
