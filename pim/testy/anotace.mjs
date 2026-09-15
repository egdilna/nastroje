
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { CESTA_APLIKACE } from './lib.mjs';
const b = await chromium.launch();
const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(CESTA_APLIKACE);
await p.waitForTimeout(1200);

const r = await p.evaluate(async () => {
  const out = {};
  const now = new Date().toISOString();
  db.entities.length = 0;
  db.entities.push({ id:'e1', title:'Zákon', aspects:['Note'], tags:[], links:[],
    body:'# Nadpis (>viz odstavec (2) zákona)\n\nBěžný text (>prostá poznámka) dál.\n\n- bod (>k § 5 (odst. 1))',
    attributes:{}, attachments:[], comments:[], created_at:now, updated_at:now, confidence:'high' });
  const e = db.entities[0];

  state.view='detail'; state.detailId='e1'; state.detailMode='read'; render();
  await new Promise(z=>setTimeout(z,500));

  const telo = document.getElementById('body-rendered');
  out.teloText = telo.textContent.replace(/\s+/g,' ').trim();
  out.doslovneVTele = /\(>/.test(telo.textContent);
  out.znacek = telo.querySelectorAll('a.annotation-ref').length;
  out.nadpisJeNadpis = !!telo.querySelector('h1');
  out.nadpisText = telo.querySelector('h1') ? telo.querySelector('h1').textContent.replace(/\s+/g,' ').trim() : null;

  // sekce Anotace
  const sekce = Array.from(document.querySelectorAll('details.section-collapsible'))
    .find(d => d.querySelector('summary') && /Anotace/.test(d.querySelector('summary').textContent));
  out.sekceJe = !!sekce;
  out.sekceText = sekce ? sekce.textContent.replace(/\s+/g,' ').trim() : null;

  // export anotace nepřenáší a nesmí nechat závorky
  const exp = expandMarkdownIncludes(e.body, { markIncluded:false, entity:e, stripAnnotations:true });
  out.export = exp.replace(/\s+/g,' ').trim();
  return out;
});
Object.entries(r).forEach(([k,v])=>console.log(String(k).padEnd(18),'→',JSON.stringify(v)));
console.log('---');
const ok = [
  ['v těle nezůstalo nic doslova', r.doslovneVTele === false],
  ['vykreslily se tři značky', r.znacek === 3],
  ['nadpis je opravdu nadpis', r.nadpisJeNadpis === true && /^Nadpis/.test(r.nadpisText)],
  ['sekce Anotace existuje', r.sekceJe === true],
  ['anotace se závorkou je v seznamu celá', /viz odstavec \(2\) zákona/.test(r.sekceText||'')],
  ['i ta s paragrafem', /k § 5 \(odst\. 1\)/.test(r.sekceText||'')],
  ['prostá anotace taky', /prostá poznámka/.test(r.sekceText||'')],
  ['export anotace vynechá', !/viz odstavec/.test(r.export) && !/\(>/.test(r.export) && /Nadpis/.test(r.export)],
];
ok.forEach(([n,v])=>console.log((v?'✓':'✗')+' '+n));
console.log('chyby:', errs.length?errs:'žádné');
await b.close();
process.exit(ok.every(x=>x[1]) && !errs.length ? 0 : 1);
