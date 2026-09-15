
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
  // 250 entit, ať se projeví ořez seznamu na 200
  for (let i = 1; i <= 250; i++) {
    db.entities.push({ id:'e'+i, title:'Entita '+String(i).padStart(3,'0'), aspects:['Note'],
      tags:[], links:[], body:'x', attributes:{}, attachments:[], comments:[],
      created_at:now, updated_at:now, confidence:'high' });
  }
  // vybereme dvě „na začátku" a jednu až za hranicí 200
  const vyber = ['e2','e5','e240'];
  _bulk.active = true; _bulk.selected = new Set(vyber);
  state.view = 'all'; render();
  await new Promise(z=>setTimeout(z,400));

  const btn = document.getElementById('bulk-export');
  out.tlacitkoJe = !!btn;
  out.popisek = btn ? btn.textContent : null;
  btn.click();
  await new Promise(z=>setTimeout(z,400));

  const d = document.getElementById('export-dialog');
  out.dialogOtevreny = d.open === true;
  out.rozsah = (document.querySelector('input[name="exp-scope"]:checked')||{}).value;
  out.oblastVidet = document.getElementById('exp-selected-area').style.display === 'block';
  out.pocitadlo = document.getElementById('exp-sel-count').textContent;
  const zaskrtnute = () => Array.from(document.querySelectorAll('input[name="exp-eid"]:checked')).map(c=>c.value);
  out.zaskrtnutePoOtevreni = zaskrtnute().sort();

  // zachytit stažení místo skutečného souboru
  let stazeno = null;
  const puvodni = window.downloadJsonExport;
  window.downloadJsonExport = (scope, o) => { stazeno = { scope, o }; };

  // filtrovat tak, aby zmizely všechny vybrané → v DOM nezůstane nic zaškrtnutého
  const hledat = document.getElementById('exp-search');
  hledat.value = 'Entita 100'; hledat.dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,200));
  out.zaskrtnutePoFiltru = zaskrtnute();
  out.pocitadloPoFiltru = document.getElementById('exp-sel-count').textContent;

  document.getElementById('exp-go').click();
  await new Promise(z=>setTimeout(z,300));
  out.stazeno = stazeno ? { scope: stazeno.scope, ids: stazeno.o.entityIds.slice().sort() } : null;
  window.downloadJsonExport = puvodni;

  // odškrtnutí v seznamu se propíše do množiny
  d.close();
  openExportDialog({ predvybrane: ['e2','e5'] });
  await new Promise(z=>setTimeout(z,300));
  const cb = document.querySelector('input[name="exp-eid"][value="e2"]');
  cb.checked = false; cb.dispatchEvent(new Event('change'));
  await new Promise(z=>setTimeout(z,100));
  out.poOdskrtnuti = document.getElementById('exp-sel-count').textContent;
  document.getElementById('exp-sel-none').click();
  await new Promise(z=>setTimeout(z,150));
  out.poZruseni = document.getElementById('exp-sel-count').textContent;
  document.getElementById('export-dialog').close();

  // bez předvýběru zůstane výchozí rozsah „celá databáze"
  openExportDialog();
  await new Promise(z=>setTimeout(z,300));
  out.rozsahBezVyberu = (document.querySelector('input[name="exp-scope"]:checked')||{}).value;
  document.getElementById('export-dialog').close();
  return out;
});
Object.entries(r).forEach(([k,v])=>console.log(String(k).padEnd(22),'→',JSON.stringify(v)));
console.log('---');
const ok = [
  ['tlačítko je v liště', r.tlacitkoJe === true && r.popisek === '📤 Exportovat'],
  ['otevře dialog exportu', r.dialogOtevreny === true],
  ['rozsah je „vybrané ručně"', r.rozsah === 'selected'],
  ['oblast výběru je rovnou vidět', r.oblastVidet === true],
  ['počitadlo hlásí 3 entity', /Vybráno: 3 entit/.test(r.pocitadlo)],
  ['zaškrtnuté jsou přesně vybrané', JSON.stringify(r.zaskrtnutePoOtevreni) === JSON.stringify(['e2','e240','e5'])],
  ['po filtru v DOM nic zaškrtnutého není', r.zaskrtnutePoFiltru.length === 0],
  ['ale počitadlo drží 3', /Vybráno: 3 entit/.test(r.pocitadloPoFiltru)],
  ['export pošle všechny 3 včetně e240', r.stazeno && r.stazeno.scope === 'selected'
      && JSON.stringify(r.stazeno.ids) === JSON.stringify(['e2','e240','e5'])],
  ['odškrtnutí se propíše', /Vybráno: 1 entit/.test(r.poOdskrtnuti)],
  ['zrušit výběr funguje', /Vybráno: 0 entit/.test(r.poZruseni)],
  ['bez předvýběru je rozsah celá databáze', r.rozsahBezVyberu === 'full'],
];
ok.forEach(([n,v])=>console.log((v?'✓':'✗')+' '+n));
console.log('chyby:', errs.length?errs:'žádné');
await b.close();
process.exit(ok.every(x=>x[1]) && !errs.length ? 0 : 1);
