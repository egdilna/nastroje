
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
  db.entities.push({ id:'e1', title:'Úkoly', aspects:['Note'], tags:[], links:[],
    body:'- [ ] první\n- [x] hotový\n- [ ] třetí\n- [ ] čtvrtý',
    attributes:{}, attachments:[], comments:[], created_at:now, updated_at:now, confidence:'high' });
  db.entities.push({ id:'e2', title:'Jiná', aspects:['Note'], tags:[], links:[],
    body:'- [ ] jiný\n- [x] jiný hotový',
    attributes:{}, attachments:[], comments:[], created_at:now, updated_at:now, confidence:'high' });

  const telo = () => document.getElementById('body-rendered');
  const tl = () => document.getElementById('btn-hide-done-body');
  const skryto = () => telo().classList.contains('hide-done-tasks');
  const videt = () => Array.from(telo().querySelectorAll('li.task-item'))
    .filter(li => getComputedStyle(li).display !== 'none').length;

  state.view='detail'; state.detailId='e1'; state.detailMode='read'; render();
  await new Promise(z=>setTimeout(z,400));
  out.naZacatku = { skryto: skryto(), videt: videt(), popisek: tl().textContent, aria: tl().getAttribute('aria-pressed') };

  // zapnout skrývání
  tl().click();
  await new Promise(z=>setTimeout(z,250));
  out.poZapnuti = { skryto: skryto(), videt: videt(), popisek: tl().textContent, aria: tl().getAttribute('aria-pressed') };

  // zaškrtnout další úkol → dojde k překreslení
  const box = Array.from(telo().querySelectorAll('input[type="checkbox"]')).find(c => !c.checked);
  box.click();
  await new Promise(z=>setTimeout(z,500));
  out.poZaskrtnuti = { skryto: skryto(), videt: videt(), popisek: tl().textContent,
                       aria: tl().getAttribute('aria-pressed'),
                       telo: (db.entities.find(x=>x.id==='e1').body.match(/\[x\]/g)||[]).length };

  // vypnout skrývání
  tl().click();
  await new Promise(z=>setTimeout(z,250));
  out.poVypnuti = { skryto: skryto(), videt: videt(), popisek: tl().textContent };

  // znovu zapnout a přepnout na jinou entitu – nastavení se nepřenáší
  tl().click(); await new Promise(z=>setTimeout(z,250));
  state.detailId='e2'; render(); await new Promise(z=>setTimeout(z,400));
  out.jinaEntita = { skryto: skryto(), popisek: tl().textContent };
  // a zpět na první – tam zůstalo zapnuté
  state.detailId='e1'; render(); await new Promise(z=>setTimeout(z,400));
  out.zpetNaPrvni = { skryto: skryto(), popisek: tl().textContent };
  return out;
});
Object.entries(r).forEach(([k,v])=>console.log(String(k).padEnd(14),'→',JSON.stringify(v)));
console.log('---');
const ok = [
  ['na začátku se nic neskrývá', r.naZacatku.skryto === false && r.naZacatku.videt === 4
      && /Skrýt/.test(r.naZacatku.popisek) && r.naZacatku.aria === 'false'],
  ['zapnutí skryje hotový úkol', r.poZapnuti.skryto === true && r.poZapnuti.videt === 3
      && /Zobrazit/.test(r.poZapnuti.popisek) && r.poZapnuti.aria === 'true'],
  ['zaškrtnutí se zapsalo do těla', r.poZaskrtnuti.telo === 2],
  ['po zaškrtnutí zůstává skryto', r.poZaskrtnuti.skryto === true],
  ['a nový hotový zmizí taky', r.poZaskrtnuti.videt === 2],
  ['tlačítko drží stav i po překreslení', /Zobrazit/.test(r.poZaskrtnuti.popisek) && r.poZaskrtnuti.aria === 'true'],
  ['vypnutí zase ukáže vše', r.poVypnuti.skryto === false && r.poVypnuti.videt === 4],
  ['jiná entita není ovlivněná', r.jinaEntita.skryto === false && /Skrýt/.test(r.jinaEntita.popisek)],
  ['návrat k první drží nastavení', r.zpetNaPrvni.skryto === true && /Zobrazit/.test(r.zpetNaPrvni.popisek)],
];
ok.forEach(([n,v])=>console.log((v?'✓':'✗')+' '+n));
console.log('chyby:', errs.length?errs:'žádné');
await b.close();
process.exit(ok.every(x=>x[1]) && !errs.length ? 0 : 1);
