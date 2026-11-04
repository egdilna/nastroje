// BALÍČKY S PŘÍLOHAMI: OFFLINE PROHLÍŽEČ A PŘENOS ENTIT MEZI PIMY.
//
// Obojí stojí na jedné cestě `attachments/<att.id>/<název>` — tu používá i sync
// na GitHub a ZIP záloha. `att.id` je UUID, takže se dvě přílohy se stejným
// jménem nepřepíšou a opakovaný import téhož balíčku nic nezdvojí.
//
// Prohlížeč se ověřuje **na rozbaleném archivu z disku**, ne jen nad řetězcem:
// na file:// jsou fetch i XHR zakázané, takže odkaz na soubor musí být obyčejný
// relativní href a obrázek obyčejný src. Jinak by to „vypadalo hotově" a přitom
// by příjemci nešlo otevřít nic.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const s = novySoucet('Balíčky s přílohami');
const { prohlizec, stranka } = await otevriAplikaci(s);
const PRACOVNI = fs.mkdtempSync(path.join(os.tmpdir(), 'pim-balicky-'));

// Průhledný PNG 10×10 — jediná příloha, u které jde ověřit, že se opravdu načetla.
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC';

async function pripravDb() {
  await stranka.evaluate(async (png) => {
    db.entities = [
      newEntity({ id: 'e1', title: 'Smlouva ABC', aspects: ['Document'], body: 'TELO-SMLOUVY' }),
      newEntity({ id: 'e2', title: 'Tajné', aspects: ['Secured'], body: 'TELO-TAJNE' }),
      newEntity({ id: 'kan', title: 'KANÁREK', aspects: ['Note'], body: 'KANAREK-BODY' })
    ];
    const bin = atob(png);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    await attachFile(findEntity('e1'), new File([arr], 'náhled obrázku.png', { type: 'image/png' }));
    await attachFile(findEntity('e1'), new File(['obsah pdf'], 'smlouva v2.pdf', { type: 'application/pdf' }));
    await attachFile(findEntity('e2'), new File(['tajnost'], 'tajny.txt', { type: 'text/plain' }));
    render();
  }, PNG_B64);
  await stranka.waitForTimeout(300);
}
const kanarek = () => stranka.evaluate(() => {
  const k = findEntity('kan');
  return k.body + '|' + ((k.attachments || []).length);
});

// Stáhne, co akce vyrobí, a vrátí cestu k souboru na disku.
async function stahni(akce, jmeno) {
  const [dl] = await Promise.all([
    stranka.waitForEvent('download', { timeout: 30000 }),
    stranka.evaluate(akce)
  ]);
  const cil = path.join(PRACOVNI, jmeno);
  await dl.saveAs(cil);
  return cil;
}

await pripravDb();

nadpis('Cesta přílohy vzniká na jednom místě');
const cesty = await stranka.evaluate(() => {
  const att = findEntity('e1').attachments[0];
  state.settings.github = Object.assign({}, state.settings.github, { path: 'data/pim.json' });
  const sGh = attachmentGhPath(att);
  state.settings.github = Object.assign({}, state.settings.github, { path: 'pim.json' });
  return { cesta: cestaPrilohy(att), sGh: sGh, bezAdresare: attachmentGhPath(att), id: att.id };
});
ok(s, cesty.cesta === 'attachments/' + cesty.id + '/náhled obrázku.png',
  'attachments/<id>/<název> — id dopředu, čitelné jméno vzadu', cesty);
ok(s, cesty.sGh === 'data/' + cesty.cesta,
  'GitHub si před tutéž cestu jen předřadí adresář repozitáře', cesty);
ok(s, cesty.bezAdresare === cesty.cesta,
  'bez adresáře v repozitáři je cesta na GitHubu totožná', cesty);

nadpis('Bajty přílohy se najdou, ať leží kdekoli');
const bajty = await stranka.evaluate(async () => {
  const att = findEntity('e1').attachments[1];        // smlouva v2.pdf, v IndexedDB
  const zIdb = await ziskejBajtyPrilohy(att);
  const embedded = { id: 'att-embed', name: 'vlozena.txt', type: 'text/plain', size: 5, storage: 'embedded', data: btoa('ahoj!') };
  const zEmbed = await ziskejBajtyPrilohy(embedded);
  const odkaz = { id: 'att-ref', name: 'x', storage: 'reference', ref: 'https://x' };
  const zOdkazu = await ziskejBajtyPrilohy(odkaz);
  const nikde = { id: 'att-nikde', name: 'ztracena.txt', storage: 'indexeddb' };
  const zNiceho = await ziskejBajtyPrilohy(nikde);
  const dec = new TextDecoder();
  return {
    idb: zIdb.data ? dec.decode(zIdb.data) : ('chyba: ' + zIdb.chyba),
    embed: zEmbed.data ? dec.decode(zEmbed.data) : ('chyba: ' + zEmbed.chyba),
    odkazChyba: zOdkazu.chyba || null,
    nicChyba: zNiceho.chyba || null
  };
});
ok(s, bajty.idb === 'obsah pdf', 'příloha z IndexedDB', bajty);
ok(s, bajty.embed === 'ahoj!',
  'i stará příloha vložená v datech (base64) — tu dřív ZIP záloha tiše přeskakovala', bajty);
ok(s, bajty.odkazChyba && /odkaz/.test(bajty.odkazChyba),
  'externí odkaz se zabalit nedá a řekne se proč', bajty);
ok(s, bajty.nicChyba && /chybí/.test(bajty.nicChyba),
  'chybějící soubor se hlásí jako chyba, ne jako prázdno', bajty);

nadpis('Příloha jen na GitHubu se dotáhne, ne přeskočí');
const zGh = await stranka.evaluate(async () => {
  GH.isConfigured = () => true;
  GH.getToken = () => 'token';
  let stazeno = 0;
  GH.downloadAttachment = async () => { stazeno++; return new Blob(['z GitHubu'], { type: 'text/plain' }); };
  const att = { id: 'att-gh', name: 'vzdalena.txt', type: 'text/plain', storage: 'github', ghPath: 'attachments/att-gh/vzdalena.txt' };
  const prvni = await ziskejBajtyPrilohy(att);
  const druhy = await ziskejBajtyPrilohy(att);     // podruhé už z místní cache
  return { obsah: new TextDecoder().decode(prvni.data), stazeno,
    druhyObsah: druhy.data ? new TextDecoder().decode(druhy.data) : null };
});
ok(s, zGh.obsah === 'z GitHubu', 'soubor, který je jen na GitHubu, se stáhne', zGh);
ok(s, zGh.stazeno === 1 && zGh.druhyObsah === 'z GitHubu',
  'a uloží se do místní cache, takže podruhé se nestahuje znovu', zGh);
await stranka.evaluate(() => { GH.isConfigured = () => false; });

nadpis('Offline prohlížeč: ZIP s HTML a soubory vedle něj');
const zipProhlizec = await stahni(
  () => downloadStaticViewer({ sPrilohami: true, enabledTabs: ['all'], overrideTitle: 'Test prohlížeč' }),
  'prohlizec.zip');
const rozbaleno = path.join(PRACOVNI, 'rozbaleno');
fs.mkdirSync(rozbaleno, { recursive: true });
execFileSync('unzip', ['-o', '-q', zipProhlizec, '-d', rozbaleno]);
const souboryVZipu = execFileSync('unzip', ['-Z1', zipProhlizec]).toString().trim().split('\n').sort();
ok(s, souboryVZipu.some(f => f.endsWith('.html')), 'v archivu je HTML prohlížeče', souboryVZipu);
ok(s, souboryVZipu.filter(f => f.startsWith('attachments/')).length === 2,
  'a dva soubory příloh — soubor zabezpečené entity mezi nimi není', souboryVZipu);
ok(s, souboryVZipu.some(f => /ČTI-MĚ/.test(f)),
  'archiv říká, že se má rozbalit celý', souboryVZipu);
ok(s, souboryVZipu.every(f => !/tajny\.txt$/.test(f)),
  'soubor zabezpečené entity v archivu opravdu není (šifrují se jen atributy)', souboryVZipu);

const htmlJmeno = fs.readdirSync(rozbaleno).find(f => f.endsWith('.html'));
const stranka2 = await stranka.context().newPage();
const chybyProhlizece = [];
stranka2.on('pageerror', e => chybyProhlizece.push(e.message));
await stranka2.goto('file://' + path.join(rozbaleno, htmlJmeno));
await stranka2.waitForTimeout(900);
ok(s, chybyProhlizece.length === 0, 'prohlížeč se načetl bez chyby', chybyProhlizece);
// Pozor: `document.body.textContent` obsahuje i text uvnitř <script>, takže
// hledat tam chybovou hlášku nejde — celý kód prohlížeče je v body. Ptáme se
// proto nadpisu, který ta chybová stránka vypisuje.
ok(s, await stranka2.evaluate(() => {
  const h1 = document.querySelector('h1');
  return !(h1 && /Chyba načtení dat/.test(h1.textContent)) && document.querySelectorAll('a[data-entity]').length > 0;
}), 'a nespadl ani na zabezpečené entitě (v prohlížeči není nic odemčené)');

await stranka2.evaluate(() => {
  const a = [...document.querySelectorAll('a[data-entity]')].find(x => /Smlouva/.test(x.textContent));
  if (a) a.click();
});
await stranka2.waitForTimeout(600);
const vProhlizeci = await stranka2.evaluate(() => {
  const img = document.querySelector('.attachment-preview');
  return {
    nadpis: (document.querySelector('h1') || {}).textContent,
    odkazy: [...document.querySelectorAll('.attachment-item a[href]')].map(a => a.getAttribute('href')),
    stahovaci: [...document.querySelectorAll('a.att-stahnout')].map(a => a.getAttribute('download')),
    imgSrc: img ? img.getAttribute('src') : null,
    imgSirka: img ? img.naturalWidth : null,
    blobUrl: [...document.querySelectorAll('[src^="blob:"]')].length
  };
});
ok(s, vProhlizeci.nadpis === 'Smlouva ABC', 'detail entity se otevřel', vProhlizeci);
ok(s, vProhlizeci.odkazy.length > 0 && vProhlizeci.odkazy.every(h => h.indexOf('attachments/') === 0),
  'odkazy na přílohy jsou relativní, vedle HTML', vProhlizeci.odkazy);
ok(s, vProhlizeci.stahovaci.length === 2 && vProhlizeci.stahovaci.indexOf('smlouva v2.pdf') >= 0,
  'tlačítko Stáhnout je odkaz na soubor s původním názvem', vProhlizeci.stahovaci);
ok(s, vProhlizeci.imgSirka === 10,
  'obrázek se z relativní cesty opravdu načetl — na file:// by fetch neprošel', vProhlizeci);
ok(s, vProhlizeci.blobUrl === 0,
  'a nic nejde přes blob URL, protože na file:// by to nešlo', vProhlizeci);

nadpis('Prohlížeč bez příloh to řekne, místo tlačítka, které zahlásí chybu');
const bezPriloh = await stranka.evaluate(() => {
  const html = buildStaticViewerHtml({ enabledTabs: ['all'] });
  return {
    maCestu: /"cesta":/.test(html),
    zahrnuty: /"attachmentsIncluded":false/.test(html),
    rikaTo: html.indexOf('soubor není součástí tohoto exportu') > 0
  };
});
ok(s, !bezPriloh.maCestu && bezPriloh.zahrnuty,
  'bez zaškrtnutí se do dat žádná cesta nezapíše', bezPriloh);
ok(s, bezPriloh.rikaTo, 'prohlížeč má text pro přílohu, jejíž soubor v exportu není', bezPriloh);

nadpis('Přenos entit: balíček s JSONem i soubory');
const balicek = await stahni(() => downloadZipExport('selected', { entityIds: ['e1'] }), 'balicek.zip');
const b64 = fs.readFileSync(balicek).toString('base64');
const prenos = await stranka.evaluate(async (b64) => {
  const bin = atob(b64); const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const entries = await parseZipStore(u8.buffer);
  const json = JSON.parse(new TextDecoder().decode(entries.find(e => e.name === 'pim-export.json').data));
  const soubory = {};
  entries.forEach(e => { if (e.name.indexOf('attachments/') === 0) soubory[e.name] = e.data; });
  return {
    jmena: entries.map(e => e.name),
    entit: json.db.entities.length,
    zipPath: (json.db.entities[0].attachments || []).map(a => a._zipPath),
    bezGhStop: JSON.stringify(json).indexOf('ghPath') < 0,
    souboru: Object.keys(soubory).length
  };
}, b64);
ok(s, prenos.jmena.indexOf('pim-export.json') >= 0 && prenos.souboru === 2,
  'balíček má pim-export.json a soubory příloh', prenos);
ok(s, prenos.entit === 1, 'a jen vybranou entitu', prenos);
ok(s, prenos.zipPath.every(c => c && c.indexOf('attachments/') === 0),
  'každá zabalená příloha nese svou cestu v balíčku (_zipPath)', prenos.zipPath);
ok(s, prenos.bezGhStop, 'v balíčku nejsou stopy po cizím repozitáři', prenos);

nadpis('Import do druhého PIM: přílohy se obnoví a nic se nezdvojí');
const importy = await stranka.evaluate(async (b64) => {
  const bin = atob(b64); const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const entries = await parseZipStore(u8.buffer);
  const json = JSON.parse(new TextDecoder().decode(entries.find(e => e.name === 'pim-export.json').data));
  const soubory = {};
  entries.forEach(e => { if (e.name.indexOf('attachments/') === 0) soubory[e.name] = e.data; });

  // „čistý" druhý PIM: žádné entity, žádné bloby
  for (const att of (findEntity('e1').attachments || [])) await deleteFileBlob(att.id);
  const kanarekTelo = findEntity('kan').body;
  db.entities = [newEntity({ id: 'kan', title: 'KANÁREK', aspects: ['Note'], body: kanarekTelo })];

  const log1 = await performImport(json, 'skip', 'entities', { soubory });
  const e1 = findEntity('e1');
  const blob0 = await getFileBlob(e1.attachments[0].id);
  const log2 = await performImport(json, 'skip', 'entities', { soubory });
  const entitPoDruhem = db.entities.length;     // musí se změřit TEĎ, ne až po dalším importu
  const log3 = await performImport(json, 'new-id', 'entities', { soubory });
  const novy = db.entities.find(x => /importováno/.test(x.title || ''));
  const blobNovy = novy ? await getFileBlob(novy.attachments[0].id) : null;
  return {
    log1: { added: log1.added, obnoveno: log1.prilohObnoveno, chybi: log1.prilohChybi },
    prilohy: e1.attachments.length,
    stavy: e1.attachments.map(a => a.storage),
    obsahPrvni: blob0 ? (await blob0.text()).slice(0, 4) : null,
    log2: { added: log2.added, skipped: log2.skipped },
    entitPoDruhem: entitPoDruhem,
    log3: { renamed: log3.renamed, obnoveno: log3.prilohObnoveno },
    noveIdPrilohy: novy ? (novy.attachments[0].id !== e1.attachments[0].id) : null,
    novyBlobJeTam: !!blobNovy,
    kanarek: findEntity('kan').body
  };
}, b64);
ok(s, importy.log1.added === 1 && importy.log1.obnoveno === 2 && importy.log1.chybi === 0,
  'první import přidal entitu a obnovil oba soubory', importy.log1);
ok(s, importy.obsahPrvni !== null, 'a blob je opravdu v IndexedDB', importy);
ok(s, importy.stavy.every(x => x === 'indexeddb' || x === 'pending-github'),
  'přílohy mají stav podle cílového PIM, ne podle zdrojového', importy.stavy);
ok(s, importy.log2.added === 0 && importy.log2.skipped === 1 && importy.entitPoDruhem === 2,
  'opakovaný import téhož balíčku nic nepřidá — identita je att.id i id entity', importy);
ok(s, importy.log3.renamed === 1 && importy.log3.obnoveno === 2,
  'strategie „nové ID" soubory obnoví taky', importy.log3);
ok(s, importy.noveIdPrilohy && importy.novyBlobJeTam,
  'a to pod NOVÝM id přílohy — jinak by blob ležel pod id, které nikdo nemá', importy);
ok(s, importy.kanarek === 'KANAREK-BODY', 'entita mimo balíček zůstala nedotčená');

nadpis('Balíček bez souborů: příloha to o sobě řekne');
const bezSouboru = await stranka.evaluate(async (b64) => {
  const bin = atob(b64); const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const entries = await parseZipStore(u8.buffer);
  const json = JSON.parse(new TextDecoder().decode(entries.find(e => e.name === 'pim-export.json').data));
  for (const e of db.entities) for (const att of (e.attachments || [])) await deleteFileBlob(att.id);
  db.entities = [];
  const log = await performImport(json, 'skip', 'entities', {});
  const e1 = findEntity('e1');
  return {
    chybi: log.prilohChybi,
    stavy: e1.attachments.map(a => a.storage),
    popisek: attachmentStatusLabel(e1.attachments[0]),
    bezZipPath: e1.attachments.every(a => a._zipPath === undefined)
  };
}, b64);
ok(s, bezSouboru.chybi === 2 && bezSouboru.stavy.every(x => x === 'missing'),
  'bez souborů dostane příloha stav „chybí", ne vymyšlené „pending"', bezSouboru);
ok(s, /chybí/i.test(bezSouboru.popisek),
  'a uživateli se to napíše srozumitelně, ne jako holý kód stavu', bezSouboru.popisek);
ok(s, bezSouboru.bezZipPath, 'pomocná značka _zipPath v datech nezůstane', bezSouboru);

nadpis('ZIP záloha celé báze jede touž cestou');
await pripravDb();
const zaloha = await stahni(() => exportToZip(), 'zaloha.zip');
const vZaloze = execFileSync('unzip', ['-Z1', zaloha]).toString().trim().split('\n').sort();
ok(s, vZaloze.indexOf('pim.json') >= 0, 'záloha má pim.json', vZaloze);
ok(s, vZaloze.filter(f => f.startsWith('attachments/')).length === 3,
  'a všechny tři přílohy včetně té od zabezpečené entity — záloha je pro vlastníka, ne pro cizího', vZaloze);

nadpis('Kanárek');
ok(s, (await kanarek()) === 'KANAREK-BODY|0', 'entita mimo hru zůstala bez příloh', await kanarek());

try { fs.rmSync(PRACOVNI, { recursive: true, force: true }); } catch (e) {}
await prohlizec.close();
process.exit(uzavri(s));
