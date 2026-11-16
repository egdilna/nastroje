// GitLab jako úložiště báze i cíl atributů glpath / glpngpath.
//
// Opravdový GitLab tu není, takže se simuluje na úrovni sítě (Playwright `route`):
// aplikace volá skutečné adresy `https://<server>/api/v4/…`, posílá skutečné
// hlavičky a dostává odpovědi ve tvaru GitLab API v4. Simulace drží repozitáře
// v paměti, kontroluje token podle serveru (PRIVATE-TOKEN) a chová se jako GitLab
// při zápisu: `create` na existující soubor a `update` s nesedícím
// `last_commit_id` vrací 400.
//
// Hlídá:
//  - rozklad cest (glpath, adresa z prohlížeče, ?id=) a cestu tam a zpět,
//  - nastavení přes formulář (služba, server, skupina s podskupinou, token per server),
//  - nahrání, načtení, pojistku proti přepsání, sloučení při cizím zápisu,
//    kontrolu cizích commitů, přílohy (nahrání, stažení, smazání),
//  - ?id= na GitLab (s tokenem i přes onboarding dialog bez tokenu),
//  - glpath / glpngpath nezávisle na tom, kde leží báze (báze na GitHubu),
//  - že GitHub cesta zůstala, jak byla (ghpath jde na api.github.com s GitHub tokenem).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { novySoucet, ok, nadpis, CESTA_APLIKACE, uzavri } from './lib.mjs';

const s = novySoucet('GitLab');

// ---------- simulovaný GitLab ----------
const TOKENY = { 'gitlab.test': 'tok-test', 'gitlab.com': 'tok-com' };
const projekty = {};   // 'host|projekt' → { vychozi, vetve: { vetev: { soubory: {cesta: {b64, commit}} } }, commity: [] }
const volani = [];
let cisloCommitu = 0;
let bezObsahuNad = Infinity;   // simulace velkého souboru: Files API vrátí prázdný content

function projekt(host, cesta, vychozi = 'main') {
  const k = host + '|' + cesta;
  if (!projekty[k]) projekty[k] = { vychozi, vetve: {}, commity: [] };
  return projekty[k];
}
function vetev(p, v) {
  if (!p.vetve[v]) p.vetve[v] = { soubory: {} };
  return p.vetve[v];
}
function cizíCommit(host, proj, v, cesta, text, autor = 'Cizí') {
  const p = projekt(host, proj);
  const id = 'c' + (++cisloCommitu).toString(16).padStart(8, '0');
  vetev(p, v).soubory[cesta] = { b64: Buffer.from(text, 'utf8').toString('base64'), commit: id };
  p.commity.unshift({ id, vetev: v, cesty: [cesta], autor });
  return id;
}
function textSouboru(host, proj, v, cesta) {
  const f = projekty[host + '|' + proj]?.vetve[v]?.soubory[cesta];
  return f ? Buffer.from(f.b64, 'base64').toString('utf8') : null;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'PRIVATE-TOKEN, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};
const json = (route, status, body) => route.fulfill({ status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

async function obsluha(route) {
  const req = route.request();
  const url = new URL(req.url());
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
  const host = url.host;
  volani.push(req.method() + ' ' + host + url.pathname);
  if ((req.headers()['private-token'] || '') !== TOKENY[host]) return json(route, 401, { message: '401 Unauthorized' });
  // Cesta přichází zakódovaná: /api/v4/projects/<enc projekt>[/repository/…]
  const m = url.pathname.match(/^\/api\/v4\/projects\/([^/]+)(\/.*)?$/);
  if (!m) return json(route, 404, { message: '404 Not Found' });
  const proj = decodeURIComponent(m[1]);
  const zbytek = m[2] || '';
  const p = projekty[host + '|' + proj];
  if (!p) return json(route, 404, { message: '404 Project Not Found' });
  if (!zbytek) return json(route, 200, { id: 1, path_with_namespace: proj, default_branch: p.vychozi });

  const mf = zbytek.match(/^\/repository\/files\/([^/]+)(\/raw)?$/);
  if (mf && req.method() === 'GET') {
    const cesta = decodeURIComponent(mf[1]);
    const ref = url.searchParams.get('ref');
    const f = p.vetve[ref]?.soubory[cesta];
    if (!f) return json(route, 404, { message: '404 File Not Found' });
    if (mf[2]) return route.fulfill({ status: 200, headers: { ...CORS, 'Content-Type': 'application/octet-stream' }, body: Buffer.from(f.b64, 'base64') });
    const velikost = Buffer.from(f.b64, 'base64').length;
    return json(route, 200, {
      file_name: cesta.split('/').pop(), file_path: cesta, size: velikost, encoding: 'base64',
      content: velikost > bezObsahuNad ? '' : f.b64, ref, blob_id: 'blob-' + f.commit, last_commit_id: f.commit
    });
  }
  if (zbytek === '/repository/commits' && req.method() === 'POST') {
    const b = JSON.parse(req.postData() || '{}');
    const v = vetev(p, b.branch);
    for (const a of b.actions) {
      const f = v.soubory[a.file_path];
      if (a.action === 'create' && f) return json(route, 400, { message: 'A file with this name already exists' });
      if ((a.action === 'update' || a.action === 'delete') && !f) return json(route, 400, { message: "A file with this name doesn't exist" });
      if (a.last_commit_id && f && a.last_commit_id !== f.commit) return json(route, 400, { message: 'You are attempting to update a file that has changed since you started editing it.' });
    }
    const id = 'c' + (++cisloCommitu).toString(16).padStart(8, '0');
    for (const a of b.actions) {
      if (a.action === 'delete') delete v.soubory[a.file_path];
      else v.soubory[a.file_path] = { b64: a.encoding === 'base64' ? a.content : Buffer.from(a.content).toString('base64'), commit: id };
    }
    p.commity.unshift({ id, vetev: b.branch, cesty: b.actions.map(a => a.file_path), zprava: b.commit_message });
    return json(route, 201, { id, short_id: id.slice(0, 8), title: b.commit_message });
  }
  if (zbytek === '/repository/commits' && req.method() === 'GET') {
    const v = url.searchParams.get('ref_name'), cesta = url.searchParams.get('path');
    const l = p.commity.filter(c => c.vetev === v && (!cesta || c.cesty.includes(cesta)));
    return json(route, 200, l.slice(0, Number(url.searchParams.get('per_page') || 20)).map(c => ({ id: c.id, author_name: c.autor || 'PIM' })));
  }
  return json(route, 404, { message: '404 Not Found' });
}

// GitHub se tu jen hlídá, že ho GitLab nezměnil: ghpath musí jít na api.github.com.
const ghVolani = [];
async function obsluhaGithub(route) {
  const req = route.request();
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { ...CORS, 'Access-Control-Allow-Headers': '*' } });
  ghVolani.push({ metoda: req.method(), cesta: new URL(req.url()).pathname, auth: req.headers()['authorization'] || '' });
  if (req.method() === 'GET') return json(route, 404, { message: 'Not Found' });
  return json(route, 201, { content: { sha: 'gh-sha' }, commit: { sha: 'gh-commit' } });
}

// ---------- prohlížeč ----------
const prohlizec = await chromium.launch();
const kontext = await prohlizec.newContext({ viewport: { width: 1280, height: 1000 } });
await kontext.route(/^https:\/\/(gitlab\.test|gitlab\.com)\//, obsluha);
await kontext.route(/^https:\/\/api\.github\.com\//, obsluhaGithub);
await kontext.route(/^https:\/\/www\.plantuml\.com\//, r => r.fulfill({ status: 200, headers: { ...CORS, 'Content-Type': 'image/png' }, body: Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]) }));

async function novaStranka(adresa = CESTA_APLIKACE) {
  const st = await kontext.newPage();
  st.on('pageerror', e => s.chyby.push('pageerror: ' + e.message));
  st.on('dialog', d => d.accept());
  await st.goto(adresa);
  await st.waitForTimeout(1200);
  return st;
}

let st = await novaStranka();

nadpis('Rozklad cest');
const rozklad = await st.evaluate(() => ({
  zkratka: parseGlPath('skupina/projekt/-/web/index.md'),
  server: parseGlPath('git.firma.cz/a/b/c/-/dir/x.md'),
  adresa: parseGlPath('https://git.firma.cz:8443/a/b/-/blob/vyvoj/docs/%C4%8Dl%C3%A1nek.md?ref_type=heads'),
  http: parseGlPath('http://localhost:8080/a/b/-/x.json'),
  spatne: [parseGlPath('projekt/-/x.md'), parseGlPath('a/b/-/'), parseGlPath('a/b/x.md')]
}));
ok(s, rozklad.zkratka && rozklad.zkratka.host === 'gitlab.com' && rozklad.zkratka.projekt === 'skupina/projekt' && rozklad.zkratka.path === 'web/index.md',
  'bez serveru = gitlab.com', rozklad.zkratka);
ok(s, rozklad.server.host === 'git.firma.cz' && rozklad.server.projekt === 'a/b/c' && rozklad.server.path === 'dir/x.md',
  'vlastní server a víceúrovňový jmenný prostor', rozklad.server);
ok(s, rozklad.adresa.host === 'git.firma.cz:8443' && rozklad.adresa.vetev === 'vyvoj' && rozklad.adresa.path === 'docs/článek.md',
  'adresa z prohlížeče: port, větev z /-/blob/, dekódovaná diakritika, bez query', rozklad.adresa);
ok(s, rozklad.http.schema === 'http' && rozklad.http.host === 'localhost:8080', 'http a localhost', rozklad.http);
ok(s, rozklad.spatne.every(x => x === null), 'neúplné cesty se odmítnou', rozklad.spatne);

const tamZpet = await st.evaluate(() => {
  const g = { provider: 'gitlab', host: 'gitlab.test', owner: 'skup/pod', repo: 'proj', path: 'data/pím.json', branch: '' };
  const raw = ghCestaRepa(g);
  const id = ghIdZCesty(raw);
  let dek = atob(id.replace(/-/g, '+').replace(/_/g, '/'));
  dek = decodeURIComponent(escape(dek));
  const zaloha = JSON.parse(JSON.stringify(state.settings.github));
  ghNastavZCesty(dek);
  const po = JSON.parse(JSON.stringify(state.settings.github));
  ghNastavZCesty('vlastnik/repo/pim.json');
  const gh = JSON.parse(JSON.stringify(state.settings.github));
  state.settings.github = zaloha;
  return { raw, po, gh };
});
ok(s, tamZpet.raw === 'gitlab.test/skup/pod/proj/-/data/pím.json', 'cesta pro ?id=', tamZpet.raw);
ok(s, tamZpet.po.provider === 'gitlab' && tamZpet.po.host === 'gitlab.test' && tamZpet.po.owner === 'skup/pod' &&
  tamZpet.po.repo === 'proj' && tamZpet.po.path === 'data/pím.json', '?id= tam a zpět (včetně diakritiky)', tamZpet.po);
ok(s, tamZpet.gh.provider === 'github' && tamZpet.gh.owner === 'vlastnik' && tamZpet.gh.branch === 'main',
  'GitHubová cesta přepne zpět na GitHub', tamZpet.gh);

nadpis('Nastavení přes formulář');
projekt('gitlab.test', 'skup/pod/proj', 'main');
await st.evaluate(() => setView('settings'));
await st.waitForTimeout(400);
await st.selectOption('#gh-provider', 'gitlab');
ok(s, await st.isVisible('#gh-host'), 'po volbě GitLabu se ukáže pole Server');
ok(s, /Skupina/.test(await st.textContent('#gh-owner-label')), 'popisky se přepnou na skupinu a projekt');
await st.fill('#gh-adresa', 'https://gitlab.test/skup/pod/proj/-/blob/main/data/pim.json');
await st.click('#gh-adresa-btn');
await st.waitForTimeout(200);
const vyplneno = await st.evaluate(() => ['gh-host', 'gh-owner', 'gh-repo', 'gh-branch', 'gh-path'].map(i => document.getElementById(i).value));
ok(s, vyplneno.join('|') === 'gitlab.test|skup/pod|proj|main|data/pim.json', 'Vyplnit z adresy rozloží adresu GitLabu', vyplneno);
await st.fill('#gh-token', 'tok-test');
await st.click('#gh-save-btn');
await st.waitForTimeout(300);
const ulozeno = await st.evaluate(() => ({
  g: state.settings.github, tokeny: glTokeny(), ghToken: localStorage.getItem('pim_gh_token'),
  nastaveni: JSON.parse(localStorage.getItem('pim_settings_v1') || '{}').github
}));
ok(s, ulozeno.g.provider === 'gitlab' && ulozeno.g.host === 'gitlab.test' && ulozeno.g.owner === 'skup/pod', 'nastavení uloženo', ulozeno.g);
ok(s, ulozeno.tokeny['gitlab.test'] === 'tok-test' && !ulozeno.ghToken, 'token jde do mapy GitLab tokenů, ne do GitHub tokenu', ulozeno);
ok(s, ulozeno.nastaveni && ulozeno.nastaveni.provider === 'gitlab', 'a přežije reload (pim_settings_v1)');
ok(s, JSON.stringify(ulozeno.nastaveni).indexOf('tok-test') < 0, 'token v nastavení není');
const seznamTokenu = await st.textContent('#gl-tok-seznam');
ok(s, /gitlab\.test/.test(seznamTokenu), 'server je v seznamu GitLab tokenů');

nadpis('První nahrání (soubor neexistuje) a načtení');
const nahrani = await st.evaluate(async () => {
  db.entities = [newEntity({ id: 'a', title: 'Alfa', aspects: ['Note'], body: 'první' })];
  save();
  const okNahrani = await GH.upload();
  return { okNahrani, sha: db.ghMeta.sha, path: db.ghMeta.path, neodeslane: _ghNeodeslaneZmeny };
});
const naServeru = JSON.parse(textSouboru('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json') || 'null');
ok(s, nahrani.okNahrani && naServeru && naServeru.entities.length === 1 && naServeru.entities[0].title === 'Alfa', 'soubor založen na GitLabu', nahrani);
const commitSouboru = projekty['gitlab.test|skup/pod/proj'].vetve.main.soubory['data/pim.json'].commit;
ok(s, nahrani.sha === commitSouboru, 'ghMeta.sha = last_commit_id souboru', { sha: nahrani.sha, commitSouboru });
ok(s, nahrani.path === 'gitlab.test/skup/pod/proj/-/blob/main/data/pim.json' && nahrani.neodeslane === false, 'metadata a příznak odeslání', nahrani);
ok(s, !naServeru.ghMeta || JSON.stringify(naServeru).indexOf('tok-test') < 0, 'token se do dat nedostal');

// Cizí commit, pak čisté načtení
const cizi1 = JSON.parse(JSON.stringify(naServeru));
cizi1.entities.push({ ...cizi1.entities[0], id: 'b', numericId: 2, title: 'Beta od kolegy' });
cizíCommit('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json', JSON.stringify(cizi1));
const nacteni = await st.evaluate(async () => {
  const r = await GH.downloadAndLoad(true);
  return { r, n: db.entities.map(e => e.title).sort().join(','), sha: db.ghMeta.sha, nacteno: ghDataNactena() };
});
ok(s, nacteni.r && nacteni.n === 'Alfa,Beta od kolegy' && nacteni.nacteno, 'načtení z GitLabu', nacteni);

nadpis('Souběh: kolega uložil mezitím → sloučit a uložit znovu');
const cizi2 = JSON.parse(textSouboru('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json'));
cizi2.entities.push({ ...cizi2.entities[0], id: 'c', numericId: 3, title: 'Gama od kolegy' });
cizíCommit('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json', JSON.stringify(cizi2));
const soubeh = await st.evaluate(async () => {
  db.entities.push(newEntity({ id: 'm', title: 'Moje nová', aspects: ['Note'] }));
  save();
  const r = await GH.upload();
  return { r, n: db.entities.map(e => e.title).sort().join(',') };
});
const poSoubehu = JSON.parse(textSouboru('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json'));
ok(s, soubeh.r, 'uložení po sloučení prošlo', soubeh);
ok(s, poSoubehu.entities.map(e => e.title).sort().join(',') === 'Alfa,Beta od kolegy,Gama od kolegy,Moje nová',
  'na GitLabu je moje i cizí práce — nic se nepřepsalo', poSoubehu.entities.map(e => e.title));

nadpis('Ochrana: zápis s nesedícím last_commit_id GitLab odmítne');
const ochrana = await st.evaluate(async () => {
  try { await glZapisSoubor(ghCil(), 'data/pim.json', GH._utf8ToB64('{}'), 'test', 'c-stary'); return 'prošlo'; }
  catch (e) { return e.status; }
});
ok(s, ochrana === 409, 'starý commit → 409 (konflikt), ne tiché přepsání', ochrana);
ok(s, JSON.parse(textSouboru('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json')).entities.length === 4, 'soubor zůstal netknutý');

nadpis('Kontrola cizích commitů: změna přiteče sama');
const cizi3 = JSON.parse(textSouboru('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json'));
cizi3.entities.find(e => e.id === 'a').body = 'upravil kolega';
cizíCommit('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json', JSON.stringify(cizi3));
const kontrola = await st.evaluate(async () => {
  const r = await zkontrolujVzdalene();
  return { r, telo: findEntity('a').body, znamy: _ghZnamyCommit, sha: db.ghMeta.sha };
});
ok(s, kontrola.r && kontrola.telo === 'upravil kolega', 'cizí commit se poznal a sloučil', kontrola);
ok(s, kontrola.sha === projekty['gitlab.test|skup/pod/proj'].vetve.main.soubory['data/pim.json'].commit, 'a sha se posunula');

nadpis('Velký soubor: Files API bez obsahu → dotáhne se raw');
bezObsahuNad = 10;
volani.length = 0;
const velky = await st.evaluate(async () => { const r = await GH.downloadAndLoad(true); return { r, n: db.entities.length }; });
ok(s, velky.r && velky.n === 4 && volani.some(v => /\/raw$/.test(v)), 'obsah přišel přes /raw', { velky, volani });
bezObsahuNad = Infinity;

nadpis('Přílohy');
const prilohy = await st.evaluate(async () => {
  const e = findEntity('a');
  const blob = new Blob([new Uint8Array([1, 2, 3, 250, 251])], { type: 'application/octet-stream' });
  const att = { id: 'att-1', name: 'data.bin', type: 'application/octet-stream', size: 5, storage: 'pending-github', added_at: nowIso() };
  await putFileBlob(att.id, blob);
  e.attachments = [att];
  save();
  const r = await GH.upload();
  const stav = { r, storage: att.storage, ghPath: att.ghPath, chyba: att.uploadError || null };
  const stazeno = await GH.downloadAttachment(att);
  stav.bajty = Array.from(new Uint8Array(await stazeno.arrayBuffer())).join(',');
  stav.url = ghWebUrlSouboru(att.ghPath);
  return stav;
});
const prilohaNaServeru = projekty['gitlab.test|skup/pod/proj'].vetve.main.soubory['data/attachments/att-1/data.bin'];
ok(s, prilohy.r && prilohy.storage === 'github' && prilohy.ghPath === 'data/attachments/att-1/data.bin' && prilohaNaServeru,
  'příloha nahraná vedle báze', prilohy);
ok(s, prilohy.bajty === '1,2,3,250,251', 'stažení přílohy vrátí stejné bajty (binárně, ne jako text)', prilohy.bajty);
ok(s, prilohy.url === 'https://gitlab.test/skup/pod/proj/-/blob/main/data/attachments/att-1/data.bin', 'webový odkaz na přílohu', prilohy.url);
const overeni = await st.evaluate(async () => { await GH.verifyAllAttachments(); return findEntity('a').attachments[0].storage; });
ok(s, overeni === 'github', 'ověření příloh na GitLabu');
const smazani = await st.evaluate(async () => {
  const e = findEntity('a');
  db.ghMeta.pendingDeletes = [{ path: e.attachments[0].ghPath, sha: e.attachments[0].ghSha, name: 'data.bin' }];
  e.attachments = [];
  save();
  const r = await GH.upload();
  return { r, zbyva: db.ghMeta.pendingDeletes.length };
});
ok(s, smazani.r && smazani.zbyva === 0 && !projekty['gitlab.test|skup/pod/proj'].vetve.main.soubory['data/attachments/att-1/data.bin'],
  'odložené smazání přílohy proběhne', smazani);

nadpis('Pojistka: nenačtená data nepřepíšou soubor na GitLabu');
await st.close();
st = await novaStranka();
const pojistka = await st.evaluate(async () => {
  db.entities = [newEntity({ id: 'x', title: 'Prázdné okno' })];
  const r = await GH.upload({ autosave: true });
  return { r, nacteno: ghDataNactena(), status: document.getElementById('status-region').textContent };
});
ok(s, pojistka.r === false && pojistka.nacteno === false, 'autosave nenačteného okna se zastaví', pojistka.r);
ok(s, JSON.parse(textSouboru('gitlab.test', 'skup/pod/proj', 'main', 'data/pim.json')).entities.length === 4, 'data na GitLabu zůstala celá');
ok(s, /GitLab/.test(pojistka.status), 'důvod je ve stavovém řádku a mluví o GitLabu');

nadpis('Odkaz ?id= na GitLab');
await st.close();
const idOdkaz = Buffer.from('gitlab.test/skup/pod/proj/-/data/pim.json', 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
st = await novaStranka(CESTA_APLIKACE + '?id=' + idOdkaz);
const zOdkazu = await st.evaluate(() => ({ n: db.entities.length, g: state.settings.github, nacteno: ghDataNactena(), url: location.search }));
ok(s, zOdkazu.n === 4 && zOdkazu.g.provider === 'gitlab' && zOdkazu.g.owner === 'skup/pod' && zOdkazu.nacteno,
  '?id= s tokenem načte bázi z GitLabu', zOdkazu);
ok(s, zOdkazu.url.indexOf('id=') >= 0, 'adresa drží ?id=');
const odkazEntity = await st.evaluate(() => buildEntityShareLink(findEntity('a')));
const idZOdkazu = new URL(odkazEntity).searchParams.get('id');
ok(s, Buffer.from(idZOdkazu.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8').startsWith('gitlab.test/skup/pod/proj/-/'),
  'sdílecí odkaz entity míří na GitLab', odkazEntity);

// Bez tokenu: onboarding dialog, po zadání tokenu načte.
await st.evaluate(() => localStorage.removeItem('pim_gl_tokens'));
await st.close();
st = await novaStranka(CESTA_APLIKACE + '?id=' + idOdkaz);
const dialog = await st.evaluate(() => {
  const d = document.getElementById('gh-token-onboard-dialog');
  return d ? { open: d.open, text: d.textContent } : null;
});
ok(s, dialog && dialog.open && /GitLab/.test(dialog.text) && /gitlab\.test/.test(dialog.text), 'bez tokenu se nabídne dialog pro GitLab token serveru', dialog);
await st.fill('#ghob-token', 'spatny');
const jmeno = await st.$('#ghob-name');
if (jmeno) await jmeno.fill('Tester');
await st.click('#ghob-ok');
await st.waitForTimeout(800);
const poSpatnem = await st.evaluate(() => ({ open: document.getElementById('gh-token-onboard-dialog')?.open, err: document.getElementById('ghob-err')?.textContent }));
ok(s, poSpatnem.open && /odmítnut/.test(poSpatnem.err || ''), 'špatný token: dialog zůstane otevřený s vysvětlením', poSpatnem);
await st.fill('#ghob-token', 'tok-test');
await st.click('#ghob-ok');
await st.waitForTimeout(1000);
const poDobrem = await st.evaluate(() => ({ n: db.entities.length, tok: glToken('gitlab.test'), d: !!document.getElementById('gh-token-onboard-dialog') }));
ok(s, poDobrem.n === 4 && poDobrem.tok === 'tok-test' && !poDobrem.d, 'správný token: uloží se k serveru a báze se načte', poDobrem);

nadpis('glpath / glpngpath — báze na GitHubu, tělo entity na GitLab');
projekt('gitlab.com', 'web/stranky', 'main');
projekt('gitlab.test', 'jina/proj', 'main');
await st.close();
st = await novaStranka();
await st.evaluate(() => {
  state.settings.github = { provider: 'github', host: '', owner: 'o', repo: 'r', path: 'pim.json', branch: 'main', autoLoadOnStart: false };
  GH._ghSetToken('gh-token-123');
  glSetToken('gitlab.com', 'tok-com');
  glSetToken('gitlab.test', 'tok-test');
  db.entities = [
    newEntity({ id: 'w', title: 'Web', aspects: ['Note'], body: '# Nadpis\n\nText ((#)). {{include:Vložená}}', attributes: {
      glpath: 'web/stranky/-/obsah/web.md', ghpath: 'o/r/web.md' } }),
    newEntity({ id: 'v', title: 'Vložená', aspects: ['Note'], body: 'vložený text' }),
    newEntity({ id: 'w2', title: 'Větev', aspects: ['Note'], body: 'na dev', attributes: {
      glpath: 'https://gitlab.test/jina/proj/-/blob/dev/x/y.md' } })
  ];
  render();
});
await st.evaluate(() => setView('detail', { detailId: 'w', detailMode: 'read' }));
await st.waitForTimeout(500);
ok(s, await st.$('#btn-gl-push') !== null && await st.$('#btn-gh-push') !== null, 'detail má tlačítko Uložit na GitLab vedle Uložit na GitHub');
volani.length = 0;
await st.click('#btn-gl-push');
await st.waitForTimeout(800);
const webMd = textSouboru('gitlab.com', 'web/stranky', 'main', 'obsah/web.md');
ok(s, webMd !== null && /Text 1\./.test(webMd) && /vložený text/.test(webMd) && !/\{\{include/.test(webMd),
  'na gitlab.com je rozexpandované tělo (čítač, include)', webMd);
await st.click('#btn-gl-push');
await st.waitForTimeout(800);
ok(s, projekty['gitlab.com|web/stranky'].commity.length === 2, 'druhé uložení soubor přepíše (update), nespadne na „už existuje"');
ghVolani.length = 0;
await st.click('#btn-gh-push');
await st.waitForTimeout(800);
const put = ghVolani.find(v => v.metoda === 'PUT');
ok(s, put && put.cesta === '/repos/o/r/contents/web.md' && put.auth === 'Bearer gh-token-123', 'ghpath dál jde na GitHub s GitHub tokenem', ghVolani);
// Větev z adresy a jiný server
await st.evaluate(() => setView('detail', { detailId: 'w2', detailMode: 'read' }));
await st.waitForTimeout(400);
await st.click('#btn-gl-push');
await st.waitForTimeout(800);
ok(s, textSouboru('gitlab.test', 'jina/proj', 'dev', 'x/y.md') === 'na dev', 'glpath s adresou …/-/blob/dev/… zapíše do větve dev na jiném serveru');
// Chybějící token serveru
const bezTokenu = await st.evaluate(async () => {
  glSetToken('gitlab.test', '');
  let hlaska = '';
  const puvodni = window.alertMsg;
  window.alertMsg = (m) => { hlaska = m; };
  try { await pushEntityToGitlab(findEntity('w2')); } finally { window.alertMsg = puvodni; }
  glSetToken('gitlab.test', 'tok-test');
  return hlaska;
});
ok(s, /token/.test(bezTokenu) && /gitlab\.test/.test(bezTokenu), 'bez tokenu serveru srozumitelná hláška', bezTokenu);
// glpngpath
const png = await st.evaluate(async () => {
  const d = newEntity({ id: 'd', title: 'Diagram', aspects: ['Diagram'], attributes: { source: '@startuml\nA -> B\n@enduml', encoded: 'SoWkIImgAStDuNBAJrBGjLDmpCbCJbMmKiX8pSd9vt98pKi1IW80', glpngpath: 'web/stranky/-/img/d.png' } });
  db.entities.push(d);
  await pushDiagramPngToGitlab(d);
  return true;
});
const pngNaServeru = projekty['gitlab.com|web/stranky'].vetve.main.soubory['img/d.png'];
ok(s, png && pngNaServeru && Buffer.from(pngNaServeru.b64, 'base64')[1] === 0x50, 'glpngpath uloží PNG binárně');
await st.evaluate(() => setView('detail', { detailId: 'd', detailMode: 'read' }));
await st.waitForTimeout(600);
ok(s, await st.$('#diag-gl-push-png') !== null, 'diagram má tlačítko Uložit PNG na GitLab');

nadpis('Tvrdé načtení nesmaže GitLab tokeny');
await st.evaluate(() => {
  state.settings.github = { provider: 'gitlab', host: 'gitlab.test', owner: 'skup/pod', repo: 'proj', path: 'data/pim.json', branch: '', autoLoadOnStart: false };
  saveSettingsLocal();
  localStorage.setItem('pim_neco_jineho', 'x');
});
const navigace = st.waitForNavigation({ timeout: 10000 }).catch(() => null);
const tvrde = await st.evaluate(() => ghHardReload());
await navigace;
await st.waitForTimeout(1500);
const poTvrdem = await st.evaluate(() => ({ tok: glToken('gitlab.test'), gh: localStorage.getItem('pim_gh_token'), jine: localStorage.getItem('pim_neco_jineho') }));
ok(s, tvrde === true && poTvrdem.tok === 'tok-test' && poTvrdem.gh === 'gh-token-123' && poTvrdem.jine === null,
  'po tvrdém načtení z GitLabu zůstaly tokeny GitHubu i GitLabu, ostatní pim_ klíče pryč', { tvrde, poTvrdem });

await prohlizec.close();
process.exit(uzavri(s));
