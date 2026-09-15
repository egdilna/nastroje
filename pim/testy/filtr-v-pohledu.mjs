
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
  const mk=(id,t,tag,telo)=>({id,title:t,aspects:['Note'],tags:[tag],links:[],body:telo||'',
    attributes:{},attachments:[],comments:[],created_at:now,updated_at:now,confidence:'high'});
  db.entities.length=0;
  db.entities.push(mk('a','Schůzka s právníkem','porada'));
  db.entities.push(mk('bb','Schůzka s klientem','porada'));
  db.entities.push(mk('c','Zápis z porady','porada','text o právníkovi'));
  db.entities.push(mk('d','Mimo pohled','jine'));
  db.savedViews = [{ id:'v1', name:'Porady', icon:'📋', filters:{ tag:'porada', archived:false } }];

  state.view='savedView'; state.savedViewId='v1'; render();
  await new Promise(z=>setTimeout(z,400));

  const nazvy = () => Array.from(document.querySelectorAll('#view-results tbody tr'))
    .map(tr => tr.textContent.replace(/\s+/g,' ').trim().slice(0,30));
  const inp = () => document.getElementById('view-filter-text');

  out.poleJe = !!inp();
  out.naZacatku = { pocet: nazvy().length, text: document.getElementById('view-count').textContent };
  out.mimoPohledNeni = !nazvy().some(x => /Mimo pohled/.test(x));

  // filtrovat
  inp().value = 'schůzka'; inp().dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,250));
  out.poFiltru = { pocet: nazvy().length, nazvy: nazvy(), text: document.getElementById('view-count').textContent };

  // hledá i v těle, ne jen v názvu
  inp().value = 'právník'; inp().dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,250));
  out.hledaVTele = nazvy();

  // fokus zůstává v poli
  inp().focus();
  inp().value = 'klient'; inp().dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,250));
  out.fokusZustal = document.activeElement && document.activeElement.id === 'view-filter-text';
  out.poKlient = nazvy();

  // nic nenalezeno
  inp().value = 'xyzzy'; inp().dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,250));
  out.prazdno = (document.querySelector('#view-results .empty')||{}).textContent;

  // vyprázdnění vrátí vše
  inp().value = ''; inp().dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,250));
  out.poVyprazdneni = { pocet: nazvy().length, text: document.getElementById('view-count').textContent };

  // text přežije odchod a návrat do pohledu
  inp().value = 'klient'; inp().dispatchEvent(new Event('input'));
  await new Promise(z=>setTimeout(z,250));
  state.view='all'; render(); await new Promise(z=>setTimeout(z,300));
  state.view='savedView'; render(); await new Promise(z=>setTimeout(z,400));
  out.poNavratu = { hodnota: inp().value, pocet: nazvy().length };

  // řazení po filtrování dál funguje
  const th = document.querySelector('#view-results th[data-sort], #view-results th button, #view-results thead th');
  out.maHlavicku = !!th;
  return out;
});
Object.entries(r).forEach(([k,v])=>console.log(String(k).padEnd(16),'→',JSON.stringify(v)));
console.log('---');
const ok = [
  ['pole pro hledání je nahoře', r.poleJe === true],
  ['bez filtru jsou 3 entity pohledu', r.naZacatku.pocet === 3 && /Nalezeno 3 entit\./.test(r.naZacatku.text)],
  ['entita mimo pohled se nezobrazí', r.mimoPohledNeni === true],
  ['filtr zúží na 2', r.poFiltru.pocet === 2 && r.poFiltru.nazvy.every(x=>/Schůzka/.test(x))],
  ['počet hlásí, že je filtrováno', /\(filtrováno\)/.test(r.poFiltru.text)],
  ['hledá i v těle entity', r.hledaVTele.length === 2 && r.hledaVTele.some(x=>/Zápis z porady/.test(x))],
  ['psaní neztrácí kurzor', r.fokusZustal === true],
  ['filtr zůstává uvnitř pohledu', r.poKlient.length === 1 && /klientem/.test(r.poKlient[0])],
  ['prázdný výsledek má hlášku', /nic neodpovídá/.test(r.prazdno||'')],
  ['vyprázdnění vrátí vše', r.poVyprazdneni.pocet === 3 && !/filtrováno/.test(r.poVyprazdneni.text)],
  ['text přežije návrat do pohledu', r.poNavratu.hodnota === 'klient' && r.poNavratu.pocet === 1],
  ['tabulka má hlavičku k řazení', r.maHlavicku === true],
];
ok.forEach(([n,v])=>console.log((v?'✓':'✗')+' '+n));
console.log('chyby:', errs.length?errs:'žádné');
await b.close();
process.exit(ok.every(x=>x[1]) && !errs.length ? 0 : 1);
