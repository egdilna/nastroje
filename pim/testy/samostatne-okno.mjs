// Samostatné okno entity: data se předávají z okna, které ho otevřelo, ne ze sítě;
// obě okna se pak drží v synchronu. A pojistka, která nedovolí nahrát na GitHub
// data z okna, které si je odtamtud nikdy nenačetlo.
//
// Tahle sada musí jet přes http://, ne file:// — soubory mají neprůhledný původ,
// takže by okna navzájem nedosáhla a předání dat by se nedalo ověřit.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { novySoucet, ok, nadpis, uzavri } from './lib.mjs';

const ZDE = path.dirname(fileURLToPath(import.meta.url));
const APLIKACE = path.resolve(ZDE, '..', 'index.html');
const PORT = 8731;
const ID_PARAM = Buffer.from('egdilna/testrepo/pim.json').toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_');

const soucet = novySoucet('Samostatné okno a synchronizace oken');

// Databáze, kterou „má na GitHubu" testovací mock.
const DB_NA_GITHUBU = {
  schemaVersion: 2, title: 'PIM test', description: '',
  created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z',
  entities: [
    { id: 'e-sit', numericId: 1, title: 'ZE-SITE-STAZENO', aspects: ['Note'], body: 'TELO-ZE-SITE',
      tags: [], links: [], attributes: {}, comments: [], attachments: [],
      created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z' }
  ],
  tags: [], savedViews: [], customTemplates: [], customAspects: [],
  ghMeta: { path: 'egdilna/testrepo/pim.json', sha: 'sha-stara', lastSyncAt: null, branch: 'main' }
};

const srv = http.createServer((req, res) => {
  const cesta = req.url.split('?')[0];
  if (cesta === '/index.html' || cesta === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(APLIKACE));
  } else { res.writeHead(404); res.end('nic'); }
});
await new Promise(r => srv.listen(PORT, r));
const ZAKLAD = 'http://localhost:' + PORT + '/index.html';

const prohlizec = await chromium.launch();
const ctx = await prohlizec.newContext({ viewport: { width: 1200, height: 900 } });

// Mock GitHubu. Pamatuje si každý požadavek, ať jde spočítat, co si okna stáhla.
let pozadavky = [];
let souborExistuje = true;
await ctx.route('**/api.github.com/**', async (route) => {
  const req = route.request();
  const url = req.url();
  pozadavky.push({ metoda: req.method(), url });
  if (req.method() === 'GET' && url.includes('/contents/')) {
    if (!souborExistuje) {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not Found' }) });
      return;
    }
    const obsah = Buffer.from(JSON.stringify(DB_NA_GITHUBU), 'utf8').toString('base64');
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ sha: 'sha-stara', size: 100, content: obsah, encoding: 'base64' }) });
    return;
  }
  if (req.method() === 'PUT') {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ content: { sha: 'sha-nova' }, commit: { sha: 'commit-novy' } }) });
    return;
  }
  await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
});

function hlidej(stranka, jmeno) {
  stranka.on('pageerror', e => soucet.chyby.push('pageerror (' + jmeno + '): ' + e.message));
  stranka.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/Failed to load resource|ERR_(TUNNEL|CERT|NAME|INTERNET|CONNECTION)/.test(t)) return;
    soucet.chyby.push('console.error (' + jmeno + '): ' + t.slice(0, 200));
  });
}

const stav = (s) => s.evaluate(() => document.getElementById('status-region').textContent);
const pocetGh = () => pozadavky.length;

// ---------- Hlavní okno ----------
nadpis('Hlavní okno se načte z GitHubu');
const hlavni = await ctx.newPage();
hlidej(hlavni, 'hlavní');
await hlavni.addInitScript(() => { try { localStorage.setItem('pim_gh_token', 'token-test'); } catch (e) {} });
await hlavni.goto(ZAKLAD + '?id=' + ID_PARAM);
await hlavni.waitForTimeout(1800);

ok(soucet, pozadavky.some(p => p.metoda === 'GET' && p.url.includes('/contents/')),
  'hlavní okno si soubor z GitHubu stáhlo');
ok(soucet, await hlavni.evaluate(() => db.entities.length) === 1,
  'hlavní okno má entitu ze sítě');
ok(soucet, await hlavni.evaluate(() => ghDataNactena()) === true,
  'po načtení z GitHubu je pojistka odemčená');

// Doplníme kanárky a entitu, kterou budeme otevírat.
await hlavni.evaluate(() => {
  db.entities.push(newEntity({ id: 'e-hlavni', title: 'HLAVNI-ENTITA', aspects: ['Note'],
    body: 'TELO-HLAVNI\n\nKANAREK-TELO-1' }));
  db.entities.push(newEntity({ id: 'e-kanarek', title: 'KANAREK-ENTITA', aspects: ['Note'],
    body: 'KANAREK-TELO-2' }));
  save();
  setView('detail', { detailId: 'e-hlavni', detailMode: 'read' });
});
await hlavni.waitForTimeout(600);

// ---------- Samostatné okno ----------
nadpis('Samostatné okno bere data z hlavního okna, ne ze sítě');
pozadavky = [];
const [samostatne] = await Promise.all([
  hlavni.waitForEvent('popup'),
  hlavni.click('#btn-open-standalone')
]);
hlidej(samostatne, 'samostatné');
await samostatne.waitForLoadState();
await samostatne.waitForTimeout(2000);

ok(soucet, pocetGh() === 0, 'samostatné okno si ze GitHubu nestáhlo nic', pozadavky);
ok(soucet, (await samostatne.evaluate(() => location.search)).includes('standalone=1'),
  'samostatné okno jede v režimu standalone');
ok(soucet, await samostatne.evaluate(() => db.entities.length) === 3,
  'samostatné okno má všechny tři entity');
ok(soucet, await samostatne.evaluate(() => (findEntity('e-hlavni') || {}).title) === 'HLAVNI-ENTITA',
  'otevřená entita je v samostatném okně k nalezení');
ok(soucet, await samostatne.evaluate(() => state.view === 'detail' && state.detailId === 'e-hlavni'),
  'samostatné okno stojí na detailu té entity');
ok(soucet, (await stav(samostatne)).includes('převzata z hlavního okna'),
  'stavový řádek říká, odkud data jsou', await stav(samostatne));

// Kanárci: co se předáním nemělo dotknout, se nedotklo.
ok(soucet, await samostatne.evaluate(() => (findEntity('e-kanarek') || {}).body) === 'KANAREK-TELO-2',
  'kanárek: druhá entita přišla beze změny');
ok(soucet, await samostatne.evaluate(() => (findEntity('e-hlavni') || {}).body.includes('KANAREK-TELO-1')),
  'kanárek: tělo otevřené entity přišlo celé');
ok(soucet, await samostatne.evaluate(() => (findEntity('e-sit') || {}).body) === 'TELO-ZE-SITE',
  'kanárek: entita ze sítě přišla beze změny');
ok(soucet, await samostatne.evaluate(() => ghDataNactena()) === true,
  'převzetí dat odemkne pojistku i v samostatném okně');
ok(soucet, await samostatne.evaluate(() => (db.ghMeta || {}).sha) === 'sha-stara',
  'samostatné okno zná sha souboru, takže umí uložit');

nadpis('Předává se kopie, ne živý objekt');
await samostatne.evaluate(() => { findEntity('e-kanarek').title = 'ZMENA-JEN-TADY'; });
ok(soucet, await hlavni.evaluate(() => (findEntity('e-kanarek') || {}).title) === 'KANAREK-ENTITA',
  'zápis v samostatném okně neleze přímo do dat hlavního okna');
await samostatne.evaluate(() => { findEntity('e-kanarek').title = 'KANAREK-ENTITA'; });

// ---------- Synchronizace ----------
nadpis('Změna v hlavním okně dojde do samostatného');
await hlavni.evaluate(() => {
  findEntity('e-hlavni').title = 'PREJMENOVANO-V-HLAVNIM';
  save();
});
await samostatne.waitForTimeout(3000);
ok(soucet, await samostatne.evaluate(() => (findEntity('e-hlavni') || {}).title) === 'PREJMENOVANO-V-HLAVNIM',
  'samostatné okno převzalo změnu z hlavního');
ok(soucet, await samostatne.evaluate(() => (findEntity('e-kanarek') || {}).body) === 'KANAREK-TELO-2',
  'kanárek: synchronizace nerozhodila ostatní entity');
ok(soucet, pocetGh() === 0, 'synchronizace nejde přes síť', pozadavky);

nadpis('Změna v samostatném okně dojde do hlavního');
await samostatne.evaluate(() => {
  findEntity('e-kanarek').title = 'PREJMENOVANO-V-SAMOSTATNEM';
  save();
});
await hlavni.waitForTimeout(3000);
ok(soucet, await hlavni.evaluate(() => (findEntity('e-kanarek') || {}).title) === 'PREJMENOVANO-V-SAMOSTATNEM',
  'hlavní okno převzalo změnu ze samostatného');
ok(soucet, await hlavni.evaluate(() => (findEntity('e-hlavni') || {}).title) === 'PREJMENOVANO-V-HLAVNIM',
  'kanárek: zpětná synchronizace nezrušila dřívější změnu');

// ---------- Rozdělaná práce se nepřepíše ----------
nadpis('Okno v editaci si rozdělanou práci nepřepíše');
await samostatne.evaluate(() => setView('detail', { detailId: 'e-hlavni', detailMode: 'edit' }));
await samostatne.waitForTimeout(600);
await samostatne.evaluate(() => {
  const ta = document.getElementById('d-body');
  if (ta) { ta.value = 'ROZDELANY-TEXT'; ta.dispatchEvent(new Event('input', { bubbles: true })); }
});
// Napsání do editoru je samo změna, kterou okno ohlásí. Necháme ji dojet, aby se
// následující změna v hlavním okně nepotkala s ní – dvě změny v jedné sekundě
// jsou kolize, kterou tahle synchronizace neslučuje (vyhrává pozdější).
await samostatne.waitForTimeout(2500);
await hlavni.evaluate(() => { findEntity('e-sit').title = 'ZMENA-BEHEM-EDITACE'; save(); });
await samostatne.waitForTimeout(3000);
ok(soucet, await samostatne.evaluate(() => {
  const ta = document.getElementById('d-body');
  return !!ta && ta.value === 'ROZDELANY-TEXT';
}), 'rozdělaný text v editaci zůstal');
ok(soucet, await samostatne.evaluate(() => (findEntity('e-sit') || {}).title) === 'ZE-SITE-STAZENO',
  'okno v editaci data samo nepřevzalo');
ok(soucet, await samostatne.evaluate(() => !!document.getElementById('crosstab-banner')),
  'místo toho se ukázal pruh o změně v druhém okně');

nadpis('Tlačítko „Převzít data" převezme i z editace');
await samostatne.click('#crosstab-reload');
await samostatne.waitForTimeout(2000);
ok(soucet, await samostatne.evaluate(() => (findEntity('e-sit') || {}).title) === 'ZMENA-BEHEM-EDITACE',
  'po stisku tlačítka se data převzala');
ok(soucet, await samostatne.evaluate(() => !document.getElementById('crosstab-banner')),
  'pruh zmizel');
ok(soucet, pocetGh() === 0, 'ani převzetí tlačítkem nejde přes síť', pozadavky);

// ---------- Bez otevíracího okna se načítá ze sítě ----------
nadpis('Okno bez rodiče (zkopírovaný odkaz) se načte z GitHubu');
pozadavky = [];
const osirele = await ctx.newPage();
hlidej(osirele, 'osiřelé');
await osirele.addInitScript(() => { try { localStorage.setItem('pim_gh_token', 'token-test'); } catch (e) {} });
await osirele.goto(ZAKLAD + '?id=' + ID_PARAM + '&detail=e-sit&standalone=1');
await osirele.waitForTimeout(2000);
ok(soucet, pozadavky.some(p => p.metoda === 'GET' && p.url.includes('/contents/')),
  'bez otevíracího okna se data vzala z GitHubu');
ok(soucet, await osirele.evaluate(() => db.entities.length) === 1,
  'osiřelé okno má data ze souboru na GitHubu');
await osirele.close();

// ---------- Pojistka proti přepsání ----------
nadpis('Prázdné okno po neúspěšném načtení nic nenahraje');
souborExistuje = false;
const prazdne = await ctx.newPage();
hlidej(prazdne, 'prázdné');
await prazdne.addInitScript(() => { try { localStorage.setItem('pim_gh_token', 'token-test'); } catch (e) {} });
await prazdne.goto(ZAKLAD + '?id=' + ID_PARAM);
await prazdne.waitForTimeout(1800);
souborExistuje = true;   // soubor „se vrátil" – okno o tom ale neví
ok(soucet, await prazdne.evaluate(() => db.entities.length) === 0,
  'okno po neúspěšném načtení je prázdné');
ok(soucet, await prazdne.evaluate(() => ghDataNactena()) === false,
  'pojistka je zamčená');

pozadavky = [];
const nahralo = await prazdne.evaluate(async () => await GH.upload({ autosave: true }));
ok(soucet, nahralo === false, 'autosave nahrání odmítl');
ok(soucet, !pozadavky.some(p => p.metoda === 'PUT'), 'žádný PUT na GitHub neproběhl', pozadavky);
ok(soucet, (await stav(prazdne)).includes('nebyl načten'),
  'důvod je vidět v běžném stavovém řádku', await stav(prazdne));

nadpis('Ruční nahrání se zeptá a po zamítnutí nic nenahraje');
pozadavky = [];
prazdne.removeAllListeners('dialog');
prazdne.on('dialog', d => d.dismiss());
const rucni = await prazdne.evaluate(async () => await GH.upload());
ok(soucet, rucni === false, 'ruční nahrání se po zamítnutí nekoná');
ok(soucet, !pozadavky.some(p => p.metoda === 'PUT'), 'ani tady žádný PUT', pozadavky);

nadpis('Po potvrzení přepsání se nahraje');
pozadavky = [];
prazdne.removeAllListeners('dialog');
prazdne.on('dialog', d => d.accept());
await prazdne.evaluate(() => { db.entities.push(newEntity({ id: 'e-nova', title: 'NOVA', aspects: ['Note'] })); });
const poPotvrzeni = await prazdne.evaluate(async () => await GH.upload());
ok(soucet, poPotvrzeni !== false, 'po potvrzení nahrání proběhlo');
ok(soucet, pozadavky.some(p => p.metoda === 'PUT'), 'PUT na GitHub odešel', pozadavky);
await prazdne.close();

nadpis('Když soubor na GitHubu není, pojistka nebrání prvnímu nahrání');
souborExistuje = false;
const prvni = await ctx.newPage();
hlidej(prvni, 'první nahrání');
await prvni.addInitScript(() => { try { localStorage.setItem('pim_gh_token', 'token-test'); } catch (e) {} });
await prvni.goto(ZAKLAD);
await prvni.waitForTimeout(1200);
await prvni.evaluate(() => {
  state.settings.github = { owner: 'egdilna', repo: 'testrepo', path: 'pim.json', branch: 'main', autoLoadOnStart: false };
  db.entities = [newEntity({ id: 'e-prvni', title: 'PRVNI-ULOZENI', aspects: ['Note'] })];
});
pozadavky = [];
prvni.removeAllListeners('dialog');
prvni.on('dialog', d => d.dismiss());
const prvniVysledek = await prvni.evaluate(async () => await GH.upload({ autosave: true }));
ok(soucet, prvniVysledek !== false, 'první nahrání do neexistujícího souboru projde i přes autosave');
ok(soucet, pozadavky.some(p => p.metoda === 'PUT'), 'PUT proběhl', pozadavky);
await prvni.close();
souborExistuje = true;

nadpis('Předání dat neobsahuje odšifrovaný obsah zabezpečené entity');
const predani = await hlavni.evaluate(() => {
  _unlockedSecured['e-hlavni'] = { tajne: 'ODSIFROVANE-TAJEMSTVI' };
  const d = window.__pimDejData();
  const klice = Object.keys(d).sort().join(',');
  const json = JSON.stringify(d);
  delete _unlockedSecured['e-hlavni'];
  return { klice, obsahujeTajemstvi: json.includes('ODSIFROVANE-TAJEMSTVI') };
});
ok(soucet, predani.klice === 'db,projekt', 'předávají se jen data a klíč projektu', predani.klice);
ok(soucet, predani.obsahujeTajemstvi === false,
  'odšifrovaný obsah zabezpečené entity se nepředává');

await prohlizec.close();
srv.close();
process.exit(uzavri(soucet));
