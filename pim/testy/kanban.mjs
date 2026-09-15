import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { CESTA_APLIKACE } from './lib.mjs';
const SCR = (await import('node:os')).tmpdir();
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1100 } });
const chyby=[]; p.on('pageerror', e => chyby.push('PAGEERROR: '+e.message));
await p.goto(CESTA_APLIKACE);
await p.waitForTimeout(1500);
await p.evaluate(() => { loadSampleData(); render(); });
await p.waitForTimeout(600);
const proj = await p.evaluate(() => db.entities.find(e => (e.aspects||[]).includes('Project')).id);
await p.evaluate((id) => setView('detail', { detailId: id }), proj);
await p.waitForTimeout(800);
function ok(c,d){ console.log((c?'✓ ':'✗ SELHALO: ')+d); if(!c) process.exitCode=1; }

const stav = async () => p.evaluate(() => [...document.querySelectorAll('.kanban-col')].map(el => {
  const r = el.getBoundingClientRect();
  return { nadpis: el.querySelector('h4').textContent, h: Math.round(r.h || r.height),
           karet: el.querySelectorAll('.kanban-card').length };
}));

let s = await stav();
console.log('  výchozí:', s.map(x => x.nadpis + ' [' + x.h + 'px]').join(' | '));
ok(s.length === 3, 've výchozím stavu je prázdný sloupec „Čeká (0)" schovaný');
ok(!s.some(x => x.karet === 0), 'žádný zobrazený sloupec není prázdný');
ok(await p.evaluate(() => document.getElementById('kanban-skryt-prazdne').checked), 'zaškrtávátko je zaškrtnuté');
await p.locator('.kanban-cols').screenshot({ path: SCR + '/kanban-po.png' });

// odškrtnutí ukáže prázdné
await p.uncheck('#kanban-skryt-prazdne');
await p.waitForTimeout(600);
s = await stav();
console.log('  odškrtnuto:', s.map(x => x.nadpis + ' [' + x.h + 'px]').join(' | '));
ok(s.length === 4, 'po odškrtnutí jsou vidět všechny sloupce');
const prazdny = s.find(x => x.karet === 0);
const nejvyssi = Math.max(...s.map(x => x.h));
console.log('  prázdný sloupec:', prazdny.h + 'px, nejvyšší sloupec:', nejvyssi + 'px');
ok(prazdny.h < nejvyssi, 'prázdný sloupec se už nenatahuje na výšku nejvyššího');
ok(prazdny.h < 60, 'prázdný sloupec je kompaktní (jen nadpis)');
await p.locator('.kanban-cols').screenshot({ path: SCR + '/kanban-vse.png' });

// volba přežije překreslení i odchod
await p.evaluate(() => { setView('dashboard'); });
await p.waitForTimeout(400);
await p.evaluate((id) => setView('detail', { detailId: id }), proj);
await p.waitForTimeout(700);
ok(!(await p.evaluate(() => document.getElementById('kanban-skryt-prazdne').checked)), 'volba se pamatuje');
ok((await stav()).length === 4, 'a po návratu jsou sloupce pořád všechny');

// zpět na výchozí a kontrola prohlížeče
await p.check('#kanban-skryt-prazdne');
await p.waitForTimeout(600);
ok((await stav()).length === 3, 'zaškrtnutí zase prázdné schová');

const html = await p.evaluate(() => buildStaticViewerHtml());
const fs = await import('node:fs');
fs.writeFileSync(SCR + '/viewer-kanban.html', html);
const v = await b.newPage();
const vChyby=[]; v.on('pageerror', e => vChyby.push('viewer: '+e.message));
await v.goto('file://' + SCR + '/viewer-kanban.html');
await v.waitForTimeout(1200);
await v.evaluate(() => { const pr = db.entities.find(e => (e.aspects||[]).includes('Project')); setView('detail', { detailId: pr.id }); });
await v.waitForTimeout(800);
const vs = await v.evaluate(() => [...document.querySelectorAll('.kanban-col')].map(el => ({
  nadpis: el.querySelector('h4').textContent, karet: el.querySelectorAll('.kanban-card').length })));
console.log('  prohlížeč:', vs.map(x => x.nadpis).join(' | '));
ok(vs.length > 0 && !vs.some(x => x.karet === 0), 'prohlížeč prázdné sloupce nevykresluje');
console.log(chyby.concat(vChyby).length ? chyby.concat(vChyby).join('\n') : 'ŽÁDNÉ CHYBY');
await b.close();
