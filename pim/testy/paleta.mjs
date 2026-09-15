import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { CESTA_APLIKACE } from './lib.mjs';
const b = await chromium.launch();
const p = await b.newPage();
const chyby = [];
p.on('pageerror', e => chyby.push('PAGEERROR: ' + e.message));
await p.goto(CESTA_APLIKACE);
await p.waitForTimeout(1500);

await p.evaluate(() => {
  const aspekty = ['Note', 'Task', 'Project', 'Person'];
  db.entities = [];
  for (let i = 0; i < 1200; i++) {
    db.entities.push(newEntity({ id: 'e' + i, title: 'Entita ' + String(i).padStart(4, '0'),
      aspects: [aspekty[i % 4]], body: 'text ' + i, tags: ['alfa'] }));
  }
  db.entities.push(newEntity({ id: 'zvl', title: 'Úkoly na zahradě', aspects: ['Task'], tags: ['zahrada'] }));
  db.savedViews = [{ id: 'v1', name: 'Můj pohled', icon: '⭐', filters: { aspect: 'Task' } }];
  state.view = 'dashboard'; render();
});
await p.waitForTimeout(400);

const otevrena = () => p.evaluate(() => { const d = document.getElementById('dialog-palette'); return !!(d && d.open); });
const polozky = () => p.evaluate(() => [...document.querySelectorAll('#pal-list .pal-item .pal-label')].map(e => e.textContent));
const skupiny = () => p.evaluate(() => [...document.querySelectorAll('#pal-list .pal-skupina')].map(e => e.textContent));
const vybrany = () => p.evaluate(() => { const b = document.querySelector('#pal-list .pal-item[aria-selected="true"]'); return b ? b.textContent.trim() : null; });

function ok(podm, popis) { console.log((podm ? '✓ ' : '✗ SELHALO: ') + popis); if (!podm) process.exitCode = 1; }

// --- otevírání ---
await p.keyboard.press('F1');
await p.waitForTimeout(400);
ok(await otevrena(), 'F1 otevře paletu');
ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'pal-input'), 'fokus je v poli palety');

console.log('  skupiny při prázdném dotazu:', (await skupiny()).join(' | '));
const prazdne = await polozky();
console.log('  položek:', prazdne.length, '| první tři:', prazdne.slice(0, 3).join(' / '));
ok((await skupiny()).includes('Nedávno změněné'), 'prázdná paleta nabízí nedávno změněné entity');

await p.keyboard.press('Escape');
await p.waitForTimeout(300);
ok(!(await otevrena()), 'Esc zavře paletu');

await p.keyboard.press('Shift+F1');
await p.waitForTimeout(300);
ok(await p.evaluate(() => { const d = document.getElementById('dialog-help'); return !!(d && d.open); }), 'Shift+F1 otevře nápovědu');
await p.keyboard.press('Escape');
await p.waitForTimeout(300);

await p.keyboard.press('Control+Shift+P');
await p.waitForTimeout(400);
ok(await otevrena(), 'Ctrl+Shift+P otevře paletu');
await p.keyboard.press('Escape');
await p.waitForTimeout(300);

await p.click('#btn-palette');
await p.waitForTimeout(400);
ok(await otevrena(), 'tlačítko ⌘ Příkazy otevře paletu');

// --- hledání ---
await p.fill('#pal-input', 'ukoly');
await p.waitForTimeout(300);
const r1 = await polozky();
console.log('  „ukoly" →', r1.slice(0, 4).join(' / '));
ok(r1.some(t => t.includes('Úkoly')), 'hledání ignoruje diakritiku (ukoly → Úkoly)');

await p.fill('#pal-input', 'posledn');
await p.waitForTimeout(300);
ok((await polozky()).some(t => t.includes('Posledních 100 změněných')), 'příkaz Posledních 100 změněných je v paletě');

await p.fill('#pal-input', '>entita');
await p.waitForTimeout(300);
ok(!(await skupiny()).includes('Entity') && !(await skupiny()).includes('Nedávno změněné'), '> hledá jen v příkazech');

await p.fill('#pal-input', '@Entita 0007');
await p.waitForTimeout(300);
const r2 = await polozky();
console.log('  „@Entita 0007" →', r2.slice(0, 3).join(' / '));
ok(r2.length > 0 && r2[0].includes('0007'), '@ najde konkrétní entitu');

await p.fill('#pal-input', '#zahrad');
await p.waitForTimeout(300);
ok((await polozky()).some(t => t.includes('zahrada')), '# najde tag');

// --- limit vykreslení ---
await p.fill('#pal-input', '@Entita');
await p.waitForTimeout(400);
const pocetVykreslenych = (await polozky()).length;
const hlaskaVic = await p.evaluate(() => { const e = document.querySelector('.pal-vic'); return e ? e.textContent : null; });
console.log('  vykreslených položek při 1201 shodách:', pocetVykreslenych, '|', hlaskaVic);
ok(pocetVykreslenych <= 50, 'paleta vykreslí nejvýš 50 položek');
ok(!!hlaskaVic, 'paleta hlásí, kolik dalších výsledků je');

// --- klávesnice a spuštění ---
await p.fill('#pal-input', 'posledn');
await p.waitForTimeout(300);
const prvni = await vybrany();
await p.keyboard.press('ArrowDown');
await p.waitForTimeout(200);
ok((await vybrany()) !== prvni || (await polozky()).length === 1, 'šipka dolů posune výběr');
await p.keyboard.press('ArrowUp');
await p.waitForTimeout(200);
ok((await vybrany()) === prvni, 'šipka nahoru se vrátí');

await p.keyboard.press('Enter');
await p.waitForTimeout(700);
ok(!(await otevrena()), 'Enter zavře paletu');
const stav = await p.evaluate(() => ({ view: state.view, sort: state._allSort, limit: state._allLimit,
  radky: document.querySelectorAll('#all-results tbody tr').length }));
console.log('  po spuštění:', JSON.stringify(stav));
ok(stav.view === 'all' && stav.sort.key === 'updated' && stav.sort.dir === 'desc' && stav.limit === 100,
   'Posledních 100 změněných = pohled Vše, podle času, limit 100');
ok(stav.radky === 100, 'vykreslí se přesně 100 řádků');

// --- naposledy použité (MRU) ---
await p.keyboard.press('F1');
await p.waitForTimeout(400);
console.log('  skupiny po použití příkazu:', (await skupiny()).join(' | '));
ok((await skupiny()).includes('Naposledy použité'), 'použitý příkaz se objeví v Naposledy použité');
await p.keyboard.press('Escape');
await p.waitForTimeout(300);

// --- kontextové příkazy v detailu ---
await p.evaluate(() => setView('detail', { detailId: 'e5' }));
await p.waitForTimeout(500);
await p.keyboard.press('F1');
await p.waitForTimeout(400);
await p.fill('#pal-input', '>');
await p.waitForTimeout(300);
const vDetailu = await polozky();
console.log('  příkazů v detailu:', vDetailu.length);
ok((await skupiny()).includes('Entita'), 'v detailu se nabídnou akce nad entitou');
await p.fill('#pal-input', 'archivovat');
await p.waitForTimeout(300);
ok((await polozky()).some(t => t.includes('Archivovat')), 'akce Archivovat je v paletě');
await p.keyboard.press('Enter');
await p.waitForTimeout(600);
ok(await p.evaluate(() => findEntity('e5').archived === true), 'Archivovat z palety opravdu archivuje');

// --- kontextové příkazy v seznamu ---
await p.evaluate(() => setView('all'));
await p.waitForTimeout(500);
await p.keyboard.press('F1');
await p.waitForTimeout(300);
await p.fill('#pal-input', 'zobrazit 300');
await p.waitForTimeout(300);
ok((await polozky()).some(t => t.includes('Zobrazit 300')), 'v seznamu je příkaz na počet řádků');
await p.keyboard.press('Enter');
await p.waitForTimeout(700);
ok(await p.evaluate(() => state._allLimit === 300 && document.querySelectorAll('#all-results tbody tr').length === 300),
   'příkaz nastaví limit na 300 a vykreslí 300 řádků');

// --- skok na entitu ---
await p.keyboard.press('F1');
await p.waitForTimeout(300);
await p.fill('#pal-input', '@Entita 0042');
await p.waitForTimeout(300);
await p.keyboard.press('Enter');
await p.waitForTimeout(600);
ok(await p.evaluate(() => state.view === 'detail' && state.detailId === 'e42'), 'Enter na entitě otevře její detail');

// --- fokus se vrací ---
await p.evaluate(() => document.getElementById('btn-palette').focus());
await p.keyboard.press('F1');
await p.waitForTimeout(300);
await p.keyboard.press('Escape');
await p.waitForTimeout(300);
ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'btn-palette'), 'po zavření se fokus vrátí na tlačítko');

console.log(chyby.length ? chyby.join('\n') : 'ŽÁDNÉ CHYBY');
await b.close();
