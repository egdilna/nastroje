
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
  db.entities.push({id:'e1',title:'Entita',aspects:['Note'],tags:[],links:[],body:'Text',
    attributes:{},attachments:[],comments:[],created_at:now,updated_at:now,confidence:'high'});
  db.entities.push({id:'e2',title:'Druhá',aspects:['Note'],tags:[],links:[],body:'Text',
    attributes:{},attachments:[],comments:[],created_at:now,updated_at:now,confidence:'high'});
  const stisk = (k) => document.dispatchEvent(new KeyboardEvent('keydown',
    { key:k, bubbles:true, cancelable:true }));

  // accesskeye na tlačítkách
  AI.setKey('K');
  state.view='detail'; state.detailId='e1'; state.detailMode='read'; render();
  await new Promise(z=>setTimeout(z,400));
  const exp = document.getElementById('btn-entity-export');
  const ai = document.getElementById('btn-ai-body');
  out.exportAccesskey = exp ? exp.getAttribute('accesskey') : null;
  out.aiAccesskey = ai ? ai.getAttribute('accesskey') : null;
  out.exportTitle = exp ? exp.getAttribute('title') : null;

  // x v detailu (read) otevře export
  stisk('x');
  await new Promise(z=>setTimeout(z,400));
  out.exportOtevreny = document.getElementById('dialog-entity-export').open === true;
  document.getElementById('dialog-entity-export').close();
  await new Promise(z=>setTimeout(z,150));

  // x v edit módu nic nedělá
  state.detailMode='edit'; render(); await new Promise(z=>setTimeout(z,400));
  stisk('x'); await new Promise(z=>setTimeout(z,300));
  out.vEditNic = document.getElementById('dialog-entity-export').open === false;

  // x v pohledu Vše dál přepíná hromadný výběr
  state.view='all'; state.detailMode='read'; _bulk.active=false; render();
  await new Promise(z=>setTimeout(z,400));
  stisk('x'); await new Promise(z=>setTimeout(z,300));
  out.vSeznamuVyber = _bulk.active === true;
  out.vSeznamuNeexport = document.getElementById('dialog-entity-export').open === false;
  bulkToggle(false);

  // bez klíče tlačítko AI není, takže ani jeho accesskey
  AI.setKey('');
  state.view='detail'; render(); await new Promise(z=>setTimeout(z,400));
  out.bezKliceAi = !document.getElementById('btn-ai-body');

  // žádný accesskey není použitý dvakrát
  const klavesy = Array.from(document.querySelectorAll('[accesskey]')).map(e=>e.getAttribute('accesskey'));
  out.accesskeye = klavesy.sort();
  out.duplicity = klavesy.filter((k,i)=>klavesy.indexOf(k)!==i);
  return out;
});
Object.entries(r).forEach(([k,v])=>console.log(String(k).padEnd(18),'→',JSON.stringify(v)));
console.log('---');
const ok = [
  ['Export má accesskey x', r.exportAccesskey === 'x'],
  ['tlačítko AI má accesskey g', r.aiAccesskey === 'g'],
  ['title zmiňuje zkratku', /Alt\+Shift\+X/.test(r.exportTitle||'')],
  ['x v detailu otevře Export / tisk', r.exportOtevreny === true],
  ['x v edit módu nic nedělá', r.vEditNic === true],
  ['x v seznamu dál přepíná výběr', r.vSeznamuVyber === true && r.vSeznamuNeexport === true],
  ['bez klíče tlačítko AI není', r.bezKliceAi === true],
  ['žádný accesskey není dvakrát', r.duplicity.length === 0],
];
ok.forEach(([n,v])=>console.log((v?'✓':'✗')+' '+n));
console.log('chyby:', errs.length?errs:'žádné');
await b.close();
process.exit(ok.every(x=>x[1]) && !errs.length ? 0 : 1);
