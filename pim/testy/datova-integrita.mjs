// DATOVÁ INTEGRITA — operace nad celou databází a nad strukturami v těle.
//
// Sourozenec integrita-obsahu.mjs. Tam jde o nástroje nad jedním polem, tady
// o věci, které sahají na víc entit najednou (hromadné akce, koš, import/export)
// a o editory struktur uvnitř těla (tabulka, seznam). Všechny mají stejný způsob,
// jak selhat potichu: přepíšou víc, než měly, a nikdo si toho hned nevšimne.
import {
  novySoucet, ok, nadpis, otevriAplikaci, nasypej, telo,
  otevriDetail, zapniEditaciSekci, odpovidejNaPotvrzeni, odklikniPotvrzeni, uzavri
} from './lib.mjs';

const s = novySoucet('Datová integrita');
const { prohlizec, stranka } = await otevriAplikaci(s);

const TELO_STRUKTURY = [
  '# Nahore', '', 'Kanarek-NAHORE.', '',
  '| sloupec | hodnota |', '|---|---|', '| radek1 | a |', '| radek2 | b |', '',
  '## Uprostred', '', 'Kanarek-UPROSTRED.', '',
  '- polozka jedna', '- polozka dva', '- polozka tri', '',
  '## Dole', '', 'Kanarek-DOLE.'
].join('\n');

async function pripravStruktury() {
  await nasypej(stranka, [{ id: 'st1', title: 'Struktury', aspects: ['Note'], body: TELO_STRUKTURY }]);
  await otevriDetail(stranka, 'st1', 'read');
  await zapniEditaciSekci(stranka);
}

// ============================================================
nadpis('EDITOR TABULKY — nesmí sežrat zbytek těla');
// ============================================================
await pripravStruktury();
const maTabEditor = await stranka.evaluate(() => !!document.querySelector('button[data-table-idx], .table-edit-btn'));
ok(s, maTabEditor, 'v režimu editace sekcí je u tabulky tlačítko');
await stranka.evaluate(() => openTableEditor(findEntity('st1'), 0));
await stranka.waitForTimeout(600);
const tabOtevren = await stranka.evaluate(() => !!document.getElementById('te-save'));
ok(s, tabOtevren, 'editor tabulky se otevřel');
if (tabOtevren) {
  // změnit jednu buňku a uložit
  await stranka.evaluate(() => {
    const inp = [...document.querySelectorAll('#table-editor-content input')].find(i => i.value === 'a');
    if (inp) { inp.value = 'ZMENENO'; inp.dispatchEvent(new Event('input', { bubbles: true })); }
  });
  await stranka.click('#te-save');
  await stranka.waitForTimeout(800);
  const t = await telo(stranka, 'st1');
  ok(s, t.includes('Kanarek-NAHORE') && t.includes('Kanarek-UPROSTRED') && t.includes('Kanarek-DOLE'),
    'uložení tabulky nechalo všechny sekce', t.slice(0, 200));
  ok(s, t.includes('polozka jedna'), 'a nechalo i seznam pod tabulkou');
}

// ============================================================
nadpis('EDITOR SEZNAMU — totéž');
// ============================================================
await pripravStruktury();
await stranka.evaluate(() => openListEditor(findEntity('st1'), 0));
await stranka.waitForTimeout(600);
if (await stranka.evaluate(() => !!document.getElementById('le-save'))) {
  await stranka.evaluate(() => {
    const inp = [...document.querySelectorAll('#list-editor-content input, #list-editor-content textarea')]
      .find(i => /polozka jedna/.test(i.value || ''));
    if (inp) { inp.value = 'polozka ZMENENA'; inp.dispatchEvent(new Event('input', { bubbles: true })); }
  });
  await stranka.click('#le-save');
  await stranka.waitForTimeout(800);
  const t = await telo(stranka, 'st1');
  ok(s, t.includes('Kanarek-NAHORE') && t.includes('Kanarek-UPROSTRED') && t.includes('Kanarek-DOLE'),
    'uložení seznamu nechalo všechny sekce', t.slice(0, 200));
  ok(s, t.includes('| radek1 |'), 'a nechalo i tabulku nad seznamem');
} else {
  ok(s, false, 'editor seznamu se neotevřel');
}

// ============================================================
nadpis('HROMADNÉ OPERACE');
// ============================================================
async function pripravHromadne() {
  await nasypej(stranka, [
    { id: 'h1', title: 'Prvni', aspects: ['Note'], body: 'Telo-1', tags: ['spolecny'] },
    { id: 'h2', title: 'Druha', aspects: ['Note'], body: 'Telo-2', tags: ['spolecny'] },
    { id: 'h3', title: 'Treti', aspects: ['Note'], body: 'Telo-3', tags: ['jiny'] }
  ]);
  await stranka.evaluate(() => {
    state.view = 'all'; state.filter = { aspect:'', tag:'', text:'', status:'', attrFilters: [] };
    bulkToggle(true); _bulk.selected = new Set(['h1', 'h2']); render();
  });
  await stranka.waitForTimeout(500);
}

await pripravHromadne();
await stranka.evaluate(() => bulkArchive());
ok(s, await odklikniPotvrzeni(stranka, true), 'hromadná archivace se zeptá na potvrzení');
await stranka.waitForTimeout(600);
const poArchivaci = await stranka.evaluate(() => db.entities.map(e => e.id + ':' + (e.archived ? 'A' : '-')).join(' '));
ok(s, poArchivaci === 'h1:A h2:A h3:-', 'hromadná archivace vzala právě vybrané', poArchivaci);
ok(s, (await telo(stranka, 'h3')) === 'Telo-3', 'nevybraná entita je nedotčená');

await pripravHromadne();
await stranka.evaluate(() => bulkDelete());
ok(s, await odklikniPotvrzeni(stranka, false), 'hromadné mazání se zeptá na potvrzení');
await stranka.waitForTimeout(600);
ok(s, (await stranka.evaluate(() => db.entities.length)) === 3,
  'odmítnuté potvrzení u hromadného mazání nic nesmaže');

await pripravHromadne();
await stranka.evaluate(() => bulkDelete());
await odklikniPotvrzeni(stranka, true);
await stranka.waitForTimeout(900);
const poSmazani = await stranka.evaluate(() => ({
  zbylo: db.entities.map(e => e.id), vKosi: (db.trash || []).length
}));
ok(s, poSmazani.zbylo.length === 1 && poSmazani.zbylo[0] === 'h3',
  'hromadné mazání smazalo právě vybrané', poSmazani);
ok(s, poSmazani.vKosi === 2, 'a obě putovaly do koše (dají se obnovit)', poSmazani);

// ============================================================
nadpis('EXPORT / IMPORT — kolečko nesmí nic ztratit');
// ============================================================
await nasypej(stranka, [
  { id: 'x1', title: 'Bohata entita', aspects: ['Project'],
    body: '# Nadpis\n\nKanarek-BODY s [[Druha]] odkazem.\n\n- [x] hotovy\n- [ ] nehotovy',
    tags: ['tag-jedna', 'tag-dva'],
    attributes: { status: 'active', goal: 'Kanarek-GOAL' },
    comments: [{ id: 'c1', text: 'Kanarek-KOMENTAR', created_at: new Date().toISOString() }] },
  { id: 'x2', title: 'Druha', aspects: ['Note'], body: 'Kanarek-DRUHA' }
]);
await stranka.evaluate(() => {
  const e = findEntity('x1');
  e.links = [{ to: 'x2', type: 'relatedTo', note: 'Kanarek-VAZBA' }];
});

const balicek = await stranka.evaluate(() => JSON.stringify(buildJsonExport('full', {})));
ok(s, balicek && balicek.length > 100, 'export vyrobil balíček');

// smazat všechno a naimportovat zpět
await stranka.evaluate((bal) => {
  db.entities = []; db.trash = [];
  const payload = JSON.parse(bal);
  performImport(payload, 'replace', 'all');
}, balicek);
await stranka.waitForTimeout(800);
const poImportu = await stranka.evaluate(() => {
  const e = db.entities.find(x => x.title === 'Bohata entita');
  if (!e) return null;
  return {
    pocet: db.entities.length,
    telo: e.body, tagy: (e.tags || []).join(','),
    cil: (e.attributes || {}).goal, stav: (e.attributes || {}).status,
    vazby: (e.links || []).map(l => l.note).join(','),
    komentare: (e.comments || []).map(c => c.text).join(',')
  };
});
ok(s, !!poImportu, 'import vrátil entity zpět');
if (poImportu) {
  ok(s, poImportu.pocet === 2, 'obě entity jsou zpátky', poImportu.pocet);
  ok(s, (poImportu.telo || '').includes('Kanarek-BODY'), 'tělo přežilo');
  ok(s, (poImportu.telo || '').includes('- [x] hotovy'), 'i zaškrtnuté úkoly v těle');
  ok(s, poImportu.tagy === 'tag-jedna,tag-dva', 'tagy přežily', poImportu.tagy);
  ok(s, poImportu.cil === 'Kanarek-GOAL', 'textový atribut přežil', poImportu.cil);
  ok(s, poImportu.stav === 'active', 'select atribut přežil', poImportu.stav);
  ok(s, (poImportu.vazby || '').includes('Kanarek-VAZBA'), 'vazba přežila', poImportu.vazby);
  ok(s, (poImportu.komentare || '').includes('Kanarek-KOMENTAR'), 'komentář přežil', poImportu.komentare);
}

// ============================================================
nadpis('PŘEJMENOVÁNÍ — wiki odkazy se přepíšou, obsah neztratí');
// ============================================================
await nasypej(stranka, [
  { id: 'r1', title: 'Puvodni nazev', aspects: ['Note'], body: 'Kanarek-R1' },
  { id: 'r2', title: 'Odkazujici', aspects: ['Note'], body: 'Kanarek-R2 vede na [[Puvodni nazev]] a dost.' }
]);
await stranka.evaluate(() => {
  const e = findEntity('r1'); e.title = 'Novy nazev';
  updateReferencesAfterRename('Puvodni nazev', 'Novy nazev', 'r1');
});
await stranka.waitForTimeout(500);
const poPrejmenovani = await telo(stranka, 'r2');
ok(s, poPrejmenovani.includes('[[Novy nazev]]'), 'wiki odkaz se přepsal', poPrejmenovani);
ok(s, poPrejmenovani.includes('Kanarek-R2') && poPrejmenovani.includes('a dost.'),
  'a zbytek textu zůstal', poPrejmenovani);

// ============================================================
nadpis('DUPLIKACE — originál zůstane');
// ============================================================
await nasypej(stranka, [{ id: 'd1', title: 'Original', aspects: ['Note'], body: 'Kanarek-ORIGINAL', tags: ['t'] }]);
await stranka.evaluate(async () => { await duplicateEntity(findEntity('d1')); });
await stranka.waitForTimeout(900);
const poDuplikaci = await stranka.evaluate(() => ({
  pocet: db.entities.length,
  originalTelo: (db.entities.find(e => e.id === 'd1') || {}).body
}));
ok(s, poDuplikaci.pocet === 2, 'duplikát vznikl', poDuplikaci);
ok(s, poDuplikaci.originalTelo === 'Kanarek-ORIGINAL', 'a originál je nedotčený', poDuplikaci);

await prohlizec.close();
process.exit(uzavri(s));
