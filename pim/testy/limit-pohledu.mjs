
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
  for (let i = 1; i <= 620; i++) {
    db.entities.push({ id:'e'+i, title:'Entita '+String(i).padStart(4,'0'), aspects:['Note'],
      tags:['pohled'], links:[], body: (i % 7 === 0 ? 'zvláštní slovo' : 'běžný text'),
      attributes:{}, attachments:[], comments:[], created_at:now, updated_at:now, confidence:'high' });
  }
  db.savedViews = [{ id:'v1', name:'Velký pohled', icon:'📋', filters:{ tag:'pohled', archived:false } }];

  state.view='savedView'; state.savedViewId='v1'; render();
  await new Promise(z=>setTimeout(z,600));

  const radky = () => document.querySelectorAll('#view-results tbody tr').length;
  const sel = () => document.getElementById('view-limit');
  const pocet = () => document.getElementById('view-count').textContent;

  out.selectJe = !!sel();
  out.moznosti = sel() ? Array.from(sel().options).map(o => o.value + ':' + o.textContent) : null;
  out.vychozi = sel() ? sel().value : null;
  out.radkuNaZacatku = radky();
  out.pocetNaZacatku = pocet();

  const nastav = async (v) => { sel().value = v; sel().dispatchEvent(new Event('change'));
    await new Promise(z=>setTimeout(z,600)); };

  await nastav('500'); out.pri500 = radky();
  await nastav('1000'); out.pri1000 = { radku: radky(), pocet: pocet() };
  await nastav('0');   out.priVsem = { radku: radky(), pocet: pocet() };
  await nastav('100'); out.zpetNa100 = radky();

  // limit se uplatní i na filtrovaný výsledek
  const inp = document.getElementById('view-filter-text');
  inp.value = 'zvláštní'; inp.dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,600));
  out.filtrovano = { radku: radky(), pocet: pocet() };   // 620/7 = 88 → vejde se do 100
  inp.value = ''; inp.dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,600));

  // volba přežije odchod a návrat
  await nastav('500');
  state.view='all'; render(); await new Promise(z=>setTimeout(z,400));
  state.view='savedView'; render(); await new Promise(z=>setTimeout(z,600));
  out.poNavratu = { hodnota: sel().value, radku: radky() };

  // řazení se počítá z celku, ne jen z oříznutého
  await nastav('100');
  const nazvy = () => Array.from(document.querySelectorAll('#view-results tbody tr td:nth-child(1)'))
    .map(td => td.textContent.trim());
  out.prvniPriDesc = nazvy()[0];
  return out;
});
Object.entries(r).forEach(([k,v])=>console.log(String(k).padEnd(16),'→',JSON.stringify(v)));
console.log('---');
const ok = [
  ['select je v pohledu', r.selectJe === true],
  ['možnosti 100/300/500/1000/2000/vše',
    JSON.stringify(r.moznosti) === JSON.stringify(['100:100','300:300','500:500','1000:1000','2000:2000','0:vše'])],
  ['výchozí je 100', r.vychozi === '100' && r.radkuNaZacatku === 100],
  ['počet hlásí celek i ořez',
    /Nalezeno 620 entit\./.test(r.pocetNaZacatku) && /Zobrazeno prvních 100/.test(r.pocetNaZacatku)],
  ['500 zobrazí 500', r.pri500 === 500],
  ['1000 zobrazí všech 620 a neořezává', r.pri1000.radku === 620 && !/Zobrazeno prvních/.test(r.pri1000.pocet)],
  ['„vše" zobrazí všech 620', r.priVsem.radku === 620 && !/Zobrazeno prvních/.test(r.priVsem.pocet)],
  ['zpět na 100 zase ořízne', r.zpetNa100 === 100],
  ['limit platí i na filtrovaný výsledek', r.filtrovano.radku === 88 && /Nalezeno 88 entit \(filtrováno\)/.test(r.filtrovano.pocet)],
  ['volba přežije návrat do pohledu', r.poNavratu.hodnota === '500' && r.poNavratu.radku === 500],
  ['řazení se počítá z celku', /Entita 0620/.test(r.prvniPriDesc) || /Entita 0001/.test(r.prvniPriDesc)],
];
ok.forEach(([n,v])=>console.log((v?'✓':'✗')+' '+n));
console.log('chyby:', errs.length?errs:'žádné');
await b.close();
process.exit(ok.every(x=>x[1]) && !errs.length ? 0 : 1);
