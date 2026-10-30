// PŘÍLOHA SE DÁ PŘIDAT I Z REŽIMU ČTENÍ.
//
// Dřív vedla jediná cesta přes editaci entity: otevřít edit, přetáhnout soubor
// do dropzony, uložit. V sekci Přílohy je proto tlačítko „📎 Přidat přílohu"
// a v paletě týž příkaz (ten i pro entitu, která zatím žádnou přílohu nemá —
// bez příloh se celá sekce nevykresluje, takže by tlačítko nebylo kde ukázat).
//
// Nahrávání jde **touž cestou** jako z editace (`nahrajSouboryDoEntity` →
// `promptAttachmentName` → `attachFile`). Jediný rozdíl je, že se v režimu čtení
// hned ukládá: v editaci na přidání navazuje „Uložit entitu", tady ne.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Příloha z režimu čtení');
const { prohlizec, stranka } = await otevriAplikaci(s);

// GitHub se tváří jako nakonfigurovaný, ale nic neodchází — upload je podvržený.
// Jen tak jde změřit, že se nahrání na GitHub opravdu naplánuje.
async function pripravDb() {
  await stranka.evaluate(async () => {
    GH.isConfigured = () => true;
    GH.getToken = () => 'token';
    window._uploadVolan = 0;
    GH.upload = async () => {
      window._uploadVolan++;
      _ghNeodeslaneZmeny = false;   // jako po skutečném nahrání, jinak se plánuje dokola
      return true;
    };
    state.settings.autosaveGhSeconds = 1;
    if (!_autosaveGhEnabled) toggleAutosaveGh();
    db.entities = [
      newEntity({ id: 'e1', title: 'Smlouva', aspects: ['Document'], body: 'TELO-SMLOUVY' }),
      newEntity({ id: 'kan', title: 'KANÁREK', aspects: ['Note'], body: 'KANAREK-BODY' })
    ];
    await attachFile(findEntity('e1'), new File(['prvni'], 'prvni.txt', { type: 'text/plain' }));
    setView('detail', { detailId: 'e1', detailMode: 'read' });
  });
  await stranka.waitForTimeout(500);
}
const kanarek = () => stranka.evaluate(() => {
  const k = findEntity('kan');
  return k.body + '|' + ((k.attachments || []).length);
});

// Projde celou cestou „klik na tlačítko → výběr souboru → pojmenování".
async function nahraj(selektor, soubor, potvrditNazev) {
  const [chooser] = await Promise.all([
    stranka.waitForEvent('filechooser'),
    stranka.click(selektor)
  ]);
  await chooser.setFiles(soubor);
  await stranka.waitForTimeout(400);
  if (potvrditNazev) {
    await stranka.click('#attach-name-dialog #an-ok');
    await stranka.waitForTimeout(500);
  }
}

await pripravDb();

nadpis('Tlačítko je v sekci Přílohy, jen když tam ta sekce je');
const pohled = await stranka.evaluate(() => {
  const btn = document.getElementById('att-read-add');
  const sum = [...document.querySelectorAll('details.section-collapsible > summary')]
    .map(x => x.textContent).filter(t => /Přílohy/.test(t));
  return {
    tlacitko: !!btn,
    popisek: btn ? btn.textContent : null,
    vSekci: btn ? !!btn.closest('details.section-collapsible') : false,
    predSeznamem: btn ? !!(btn.closest('.btn-group').nextElementSibling || {}).classList : false,
    summary: sum,
    polozek: document.querySelectorAll('.attachment-item').length,
    // v režimu čtení se nemaže ani neodebírá
    odebrat: document.querySelectorAll('button[data-att-remove]').length
  };
});
ok(s, pohled.tlacitko && pohled.popisek === '📎 Přidat přílohu',
  'u entity s přílohou je v režimu čtení tlačítko na přidání', pohled);
ok(s, pohled.vSekci && pohled.predSeznamem,
  'je uvnitř sekce Přílohy, nad seznamem', pohled);
ok(s, pohled.summary.join('') === 'Přílohy (1)', 'sekce zná počet příloh', pohled);
ok(s, pohled.odebrat === 0,
  'ale odebírat se z režimu čtení dál nedá — přidání je jediná nová akce', pohled);

await stranka.evaluate(() => setView('detail', { detailId: 'kan', detailMode: 'read' }));
await stranka.waitForTimeout(300);
const bezPriloh = await stranka.evaluate(() => ({
  tlacitko: !!document.getElementById('att-read-add'),
  sekce: [...document.querySelectorAll('summary')].some(x => /Přílohy/.test(x.textContent))
}));
ok(s, !bezPriloh.tlacitko && !bezPriloh.sekce,
  'u entity bez příloh se sekce ani tlačítko nevykreslí (beze změny proti dřívějšku)', bezPriloh);

nadpis('Nahrání z režimu čtení');
await stranka.evaluate(() => { setView('detail', { detailId: 'e1', detailMode: 'read' }); window._uploadVolan = 0; });
await stranka.waitForTimeout(1700);   // ať doběhne případný starší naplánovaný upload
await stranka.evaluate(() => { window._uploadVolan = 0; });
await nahraj('#att-read-add', { name: 'druha.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') }, true);
const poNahrani = await stranka.evaluate(() => ({
  prilohy: (findEntity('e1').attachments || []).map(a => a.name + '/' + a.storage),
  summary: [...document.querySelectorAll('summary')].filter(x => /Přílohy/.test(x.textContent)).map(x => x.textContent),
  polozek: document.querySelectorAll('.attachment-item').length,
  fokus: document.activeElement ? document.activeElement.id : null,
  zbyleVstupy: document.querySelectorAll('input[type="file"]').length,
  naplanovanyUpload: _autosaveGhTimer !== null
}));
ok(s, poNahrani.prilohy.length === 2 && /druha\.pdf/.test(poNahrani.prilohy[1]),
  'příloha se přidala do entity', poNahrani.prilohy);
ok(s, poNahrani.prilohy[1].endsWith('/pending-github'),
  'a dostala stav „čeká na nahrání" jako z editace (GitHub je nakonfigurovaný)', poNahrani.prilohy);
ok(s, poNahrani.summary.join('') === 'Přílohy (2)' && poNahrani.polozek === 2,
  'pohled se překreslil i s počtem', poNahrani);
ok(s, poNahrani.fokus === 'att-read-add',
  'fokus se vrátil na tlačítko — překreslení by ho jinak shodilo na <body>', poNahrani);
ok(s, poNahrani.zbyleVstupy === 0,
  'dočasné pole pro výběr souboru po sobě uklidilo', poNahrani);
ok(s, poNahrani.naplanovanyUpload,
  'a nahrání na GitHub je naplánované: v režimu čtení už nic dalšího neuloží', poNahrani);
await stranka.waitForTimeout(1600);
ok(s, (await stranka.evaluate(() => window._uploadVolan)) >= 1,
  'autosave opravdu proběhl', await stranka.evaluate(() => window._uploadVolan));

nadpis('Zrušení pojmenování nic nepřidá');
const pred = await stranka.evaluate(() => findEntity('e1').attachments.length);
await nahraj('#att-read-add', { name: 'treti.txt', mimeType: 'text/plain', buffer: Buffer.from('t') }, false);
await stranka.click('#attach-name-dialog #an-cancel');
await stranka.waitForTimeout(400);
ok(s, (await stranka.evaluate(() => findEntity('e1').attachments.length)) === pred,
  'po „Zrušit nahrání" příloh nepřibylo', pred);

nadpis('Příkaz v paletě zvládne i entitu bez příloh');
const prikaz = await stranka.evaluate(() => {
  setView('detail', { detailId: 'kan', detailMode: 'read' });
  const p = paletaSestavPrikazy().find(x => x.id === 'ent-priloha');
  return p ? { label: p.label, kategorie: p.kategorie, hint: p.hint } : null;
});
ok(s, prikaz && prikaz.label === '📎 Přidat přílohu' && prikaz.kategorie === 'Entita',
  'paleta příkaz zná a nabízí ho u entity v detailu', prikaz);
ok(s, prikaz && prikaz.hint === 'KANÁREK',
  'a míří na tu entitu, která je zrovna otevřená', prikaz);

await stranka.waitForTimeout(300);
const [ch2] = await Promise.all([
  stranka.waitForEvent('filechooser'),
  stranka.evaluate(() => { pridejPrilohuZeCteni(findEntity('kan')); })
]);
await ch2.setFiles({ name: 'prvni-kanarka.txt', mimeType: 'text/plain', buffer: Buffer.from('k') });
await stranka.waitForTimeout(700);
const poPalete = await stranka.evaluate(() => ({
  prilohy: (findEntity('kan').attachments || []).map(a => a.name),
  dialogBy: !!document.getElementById('attach-name-dialog'),
  tlacitko: !!document.getElementById('att-read-add'),
  telo: findEntity('kan').body
}));
ok(s, poPalete.prilohy.join('') === 'prvni-kanarka.txt',
  'z palety jde přidat první přílohu entitě, která žádnou neměla', poPalete);
ok(s, !poPalete.dialogBy,
  'a pojmenování se neptá, když není z čeho vybírat (beze změny proti editaci)', poPalete);
ok(s, poPalete.tlacitko,
  'po přidání se sekce Přílohy objeví i s tlačítkem', poPalete);
ok(s, poPalete.telo === 'KANAREK-BODY', 'tělo entity se nezměnilo');

nadpis('Editace jede touž cestou a autosave si tam dál neplánuje');
await stranka.evaluate(() => { window._uploadVolan = 0; setView('detail', { detailId: 'e1', detailMode: 'edit' }); });
await stranka.waitForTimeout(500);
await stranka.setInputFiles('#d-file-input', { name: 'z-editace.txt', mimeType: 'text/plain', buffer: Buffer.from('ee') });
await stranka.waitForTimeout(400);
const maDialog = await stranka.evaluate(() => !!document.getElementById('attach-name-dialog'));
if (maDialog) { await stranka.click('#attach-name-dialog #an-ok'); await stranka.waitForTimeout(600); }
const poEditaci = await stranka.evaluate(() => ({
  prilohy: (findEntity('e1').attachments || []).map(a => a.name),
  vSeznamu: [...document.querySelectorAll('#d-attachments .attachment-item .name')].map(x => x.textContent),
  naplanovano: _autosaveGhTimer !== null
}));
ok(s, maDialog, 'i z editace se ptá na pojmenování — je to táž funkce');
ok(s, poEditaci.prilohy.indexOf('z-editace.txt') >= 0 && poEditaci.vSeznamu.indexOf('z-editace.txt') >= 0,
  'dropzona v editaci dál funguje a seznam se překreslil', poEditaci);
ok(s, poEditaci.naplanovano === false,
  'v edit modu se nahrání na GitHub neplánuje — navazuje na něj „Uložit entitu"', poEditaci);

nadpis('Do šablony prohlížeče tlačítko nepatří');
ok(s, await stranka.evaluate(() => STATIC_VIEWER_TEMPLATE.indexOf('att-read-add') < 0),
  'offline prohlížeč needituje, takže v jeho šabloně tlačítko není');

nadpis('Kanárek');
ok(s, (await kanarek()) === 'KANAREK-BODY|1',
  'druhá entita má jen to, co jsme jí sami přidali', await kanarek());

await prohlizec.close();
process.exit(uzavri(s));
