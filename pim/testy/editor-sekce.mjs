import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { CESTA_APLIKACE } from './lib.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const chyby=[]; p.on('pageerror', e => chyby.push('PAGEERROR: '+e.message));
await p.goto(CESTA_APLIKACE);
await p.waitForTimeout(1500);
function ok(c,d){ console.log((c?'✓ ':'✗ SELHALO: ')+d); if(!c) process.exitCode=1; }

const TELO = '# První sekce\n\nText jedna.\n\n## Druhá sekce\n\nTady je {++vložený++} text.\n\n- [x] Hotový\n- [ ] Nehotový\n\n## Třetí sekce\n\nText tři.';
const priprav = async () => {
  await p.evaluate((telo) => {
    db.entities = [newEntity({ id:'e1', title:'T', aspects:['Note'], body: telo })];
    state.view='detail'; state.detailId='e1'; state.detailMode='read';
    state.sectionEditMode = true; state._secEditIdx = null;
    state.cmReview = null; state.spellCheck = null; state.mdLint = null;
    render();
  }, TELO);
  await p.waitForTimeout(600);
  await p.evaluate(() => openSectionEditor(findEntity('e1'), 1));
  await p.waitForTimeout(400);
};
const telo = () => p.evaluate(() => findEntity('e1').body);
const ta = () => p.evaluate(() => { const t = document.getElementById('sec-edit-ta'); return t ? t.value : null; });
const vSekci = () => p.evaluate(() => !!state.sectionEditMode && !!document.getElementById('sec-edit-ta'));

console.log('=== REVIZE: přijmout a vrátit se ===');
await priprav();
await p.click('.section-edit-wrapper button.md-revize');
await p.waitForTimeout(600);
await p.evaluate(() => [...document.querySelectorAll('#cmr-doc button[data-cm-act="accept"]')].forEach(x => x.click()));
await p.waitForTimeout(500);
await p.click('#cmr-back');
await p.waitForTimeout(800);
ok(await vSekci(), 'po návratu jsme v editoru sekce');
ok(!(await ta()).includes('{++'), 'revize jsou přijaté v textarea');
// a teď to uložit do entity
await p.click('#sec-edit-save');
await p.waitForTimeout(900);
const t1 = await telo();
console.log('  tělo:', JSON.stringify(t1));
ok(!t1.includes('{++') && t1.includes('vložený'), 'uložení sekce zapsalo přijatou revizi do těla');
ok(t1.includes('První sekce') && t1.includes('Třetí sekce'), 'ostatní sekce zůstaly nedotčené');

console.log('=== REVIZE: Esc/zrušení nevrátí rozbitý stav ===');
await priprav();
await p.click('.section-edit-wrapper button.md-revize');
await p.waitForTimeout(600);
await p.evaluate(() => closeCmReview(false));
await p.waitForTimeout(800);
ok(await vSekci(), 'po zavření bez uložení jsme zpátky v editoru sekce');
ok((await ta()).includes('{++'), 'a text sekce je původní');

console.log('=== LINT: neuloží sekci přes celé tělo ===');
await priprav();
await p.evaluate(() => openMdLint(findEntity('e1'), 'sec-edit-ta', 'body', 'sekce'));
await p.waitForTimeout(700);
await p.click('#lint-save');
await p.waitForTimeout(800);
const t2 = await telo();
ok(t2 === TELO, 'tělo entity zůstalo celé (lint sekci sám neukládá)');
ok(await vSekci(), 'a jsme zpátky v editoru sekce');
console.log('  textarea:', JSON.stringify((await ta()).slice(0, 40)));
ok((await ta()).startsWith('## Druhá sekce'), 'v textarea je text ze lintu');

console.log('=== LINT: zrušení ===');
await priprav();
await p.evaluate(() => openMdLint(findEntity('e1'), 'sec-edit-ta', 'body', 'sekce'));
await p.waitForTimeout(600);
await p.click('#lint-cancel');
await p.waitForTimeout(800);
ok(await vSekci(), 'po zrušení lintu jsme zpátky v editoru sekce');
ok((await telo()) === TELO, 'tělo beze změny');

console.log('=== KOREKTOR: návrat bez API ===');
await priprav();
await p.evaluate(() => openSpellCheck(findEntity('e1'), 'sec-edit-ta', 'body', 'sekce'));
await p.waitForTimeout(700);
ok(await p.evaluate(() => !!state.spellCheck), 'korektor se otevřel');
await p.evaluate(() => closeSpellCheck(true));
await p.waitForTimeout(800);
ok(await vSekci(), 'po návratu z korektoru jsme v editoru sekce');
ok((await telo()) === TELO, 'korektor sám tělo nepřepsal');

console.log('=== KONTROLA: nástroje nad celým tělem fungují dál ===');
await p.evaluate(() => {
  db.entities = [newEntity({ id:'e2', title:'T2', aspects:['Note'], body: 'Text s {++revizí++}.' })];
  state.view='detail'; state.detailId='e2'; state.detailMode='edit'; state._secEditIdx = null; render();
});
await p.waitForTimeout(700);
await p.evaluate(() => openCmReview(findEntity('e2'), 'd-body', 'body', 'Obsah'));
await p.waitForTimeout(600);
await p.evaluate(() => [...document.querySelectorAll('#cmr-doc button[data-cm-act="accept"]')].forEach(x => x.click()));
await p.waitForTimeout(400);
await p.click('#cmr-back');
await p.waitForTimeout(800);
const bodyTa = await p.evaluate(() => { const t = document.getElementById('d-body'); return t ? t.value : null; });
console.log('  d-body:', JSON.stringify(bodyTa));
ok(bodyTa && !bodyTa.includes('{++'), 'revize nad celým tělem se pořád vrací do d-body');
ok(await p.evaluate(() => state.detailMode === 'edit' && !state.sectionEditMode), 'a nespustí se editace sekcí');

// lint nad celým tělem pořád ukládá
await p.evaluate(() => openMdLint(findEntity('e2'), 'd-body', 'body', 'Obsah'));
await p.waitForTimeout(700);
await p.evaluate(() => { state.mdLint.workingText = 'Upravené tělo.'; render(); });
await p.waitForTimeout(400);
await p.click('#lint-save');
await p.waitForTimeout(800);
ok((await p.evaluate(() => findEntity('e2').body)) === 'Upravené tělo.', 'lint nad celým tělem ukládá dál do entity');

console.log(chyby.length ? chyby.join('\n') : 'ŽÁDNÉ CHYBY');
await b.close();
