// Markdownové úkoly v komentářích: zaškrtávátko musí jít zaškrtnout a musí se
// zapsat do TOHO komentáře — ne do těla entity a ne do jiného komentáře.
//
// Kanárci: tělo entity, druhý komentář a nezasažené úkoly musí zůstat do znaku
// stejné. Přesně tohle se dřív rozjelo u inline výběru `(!a/|b!)`: v komentáři
// se dal přepnout, ale zápis šel bez zdroje a přepsal tělo entity.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Úkoly v komentářích');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const TELO = 'Kanarek-TELO s vyberem (!alfa/|beta!).\n\n- [ ] ukol v tele\n- [x] hotovy v tele';
const KOM1 = '- [ ] Kanarek-K1-prvni\n- [x] Kanarek-K1-druhy\n- [ ] Kanarek-K1-treti\n\nVyber (!jedna/|dva!).';
const KOM2 = '- [ ] Kanarek-K2-prvni\n- [ ] Kanarek-K2-druhy';

async function pripravEntitu() {
  await nasypej(stranka, [{ id: 'e1', title: 'S komentari', aspects: ['Note'], body: TELO }]);
  await stranka.evaluate(({ k1, k2 }) => {
    const e = findEntity('e1');
    const t = new Date().toISOString();
    e.comments = [
      { id: 'c1', author: 'Já', content: k1, created_at: t, updated_at: t },
      { id: 'c2', author: 'Ty', content: k2, created_at: t, updated_at: t }
    ];
  }, { k1: KOM1, k2: KOM2 });
  await otevriDetail(stranka, 'e1');
}

const stav = () => stranka.evaluate(() => {
  const e = findEntity('e1');
  return { telo: e.body, k1: e.comments[0].content, k2: e.comments[1].content,
    k1Upraven: e.comments[0].updated_at !== e.comments[0].created_at,
    k2Upraven: e.comments[1].updated_at !== e.comments[1].created_at };
});

nadpis('Zaškrtávátka v komentáři jsou aktivní a vědí, odkud jsou');
await pripravEntitu();
const prvky = await stranka.evaluate(() => {
  const kom = document.querySelector('#comment-c1 .comment-content');
  return {
    checkboxy: Array.from(kom.querySelectorAll('input[type=checkbox]')).map(cb =>
      ({ disabled: cb.disabled, idx: cb.dataset.mdTask, zdroj: cb.dataset.mdTaskSource })),
    select: (() => { const s = kom.querySelector('select.inline-md-select');
      return s ? { idx: s.dataset.mdInlineSelect, zdroj: s.dataset.mdSource } : null; })()
  };
});
ok(soucet, prvky.checkboxy.length === 3 && prvky.checkboxy.every(c => c.disabled === false),
  'všechna tři zaškrtávátka v komentáři jsou aktivní', prvky.checkboxy);
ok(soucet, prvky.checkboxy.every(c => c.zdroj === 'comment:c1'),
  'zaškrtávátka vědí, že zdrojem je komentář c1', prvky.checkboxy);
ok(soucet, prvky.checkboxy.map(c => c.idx).join(',') === '0,1,2',
  'indexy úkolů se počítají v rámci komentáře od nuly', prvky.checkboxy);
ok(soucet, prvky.select && prvky.select.zdroj === 'comment:c1',
  'inline výběr v komentáři míří taky do komentáře (dřív zapisoval do těla)', prvky.select);

nadpis('Zaškrtnutí změní ten správný úkol v tom správném komentáři');
async function klikni(komentar, poradi) {
  await stranka.evaluate(({ komentar, poradi }) => {
    const cb = document.querySelectorAll('#comment-' + komentar + ' .comment-content input[type=checkbox]')[poradi];
    cb.checked = !cb.checked;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
  }, { komentar, poradi });
  await stranka.waitForTimeout(450);
}

await pripravEntitu();
await klikni('c1', 0);
let s = await stav();
ok(soucet, s.k1 === KOM1.replace('- [ ] Kanarek-K1-prvni', '- [x] Kanarek-K1-prvni'),
  'první úkol komentáře se zaškrtl', s.k1);
ok(soucet, s.telo === TELO, 'tělo entity se nezměnilo (kanárek)', s.telo);
ok(soucet, s.k2 === KOM2, 'druhý komentář se nezměnil (kanárek)', s.k2);
ok(soucet, s.k1Upraven === true, 'komentář se označil jako upravený');
ok(soucet, s.k2Upraven === false, 'druhý komentář upravený není');

await pripravEntitu();
await klikni('c1', 1);
s = await stav();
ok(soucet, s.k1 === KOM1.replace('- [x] Kanarek-K1-druhy', '- [ ] Kanarek-K1-druhy'),
  'hotový úkol se dá odškrtnout zpátky', s.k1);
ok(soucet, s.telo === TELO && s.k2 === KOM2, 'okolní texty beze změny (kanárek)');

await pripravEntitu();
await klikni('c2', 1);
s = await stav();
ok(soucet, s.k2 === KOM2.replace('- [ ] Kanarek-K2-druhy', '- [x] Kanarek-K2-druhy'),
  'úkol v DRUHÉM komentáři se trefil správně (indexy se nepletou)', s.k2);
ok(soucet, s.k1 === KOM1, 'první komentář se nezměnil (kanárek)', s.k1);
ok(soucet, s.telo === TELO, 'tělo entity se nezměnilo (kanárek)', s.telo);

nadpis('Úkol v těle entity pořád funguje a komentářů se nedotkne');
await pripravEntitu();
await stranka.evaluate(() => {
  const cb = document.querySelectorAll('#body-rendered input[type=checkbox][data-md-task]')[0];
  cb.checked = true;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
});
await stranka.waitForTimeout(450);
s = await stav();
ok(soucet, s.telo === TELO.replace('- [ ] ukol v tele', '- [x] ukol v tele'),
  'úkol v těle se zaškrtl', s.telo);
ok(soucet, s.k1 === KOM1 && s.k2 === KOM2, 'komentáře se nezměnily (kanárek)');

nadpis('Inline výběr v komentáři zapisuje do komentáře');
await pripravEntitu();
await stranka.evaluate(() => {
  const sel = document.querySelector('#comment-c1 .comment-content select.inline-md-select');
  sel.value = '0';
  sel.dispatchEvent(new Event('change', { bubbles: true }));
});
await stranka.waitForTimeout(400);
s = await stav();
ok(soucet, s.k1.indexOf('(!|jedna/dva!)') >= 0, 'výběr se přepsal v komentáři', s.k1);
ok(soucet, s.telo === TELO, 'tělo entity zůstalo nedotčené — dřív se přepisovalo ono', s.telo);

nadpis('→ Entita z úkolu v komentáři');
await pripravEntitu();
const konverze = await stranka.evaluate(async () => {
  const btn = document.querySelector('#comment-c1 .comment-content button.task-convert-btn');
  if (!btn) return { chyba: 'tlačítko není' };
  btn.click();
  await new Promise(z => setTimeout(z, 500));
  const e = findEntity('e1');
  const novy = db.entities.find(x => x.title === 'Kanarek-K1-prvni');
  return { komentar: e.comments[0].content, telo: e.body,
    novaEntita: !!novy, aspekt: novy ? (novy.aspects || []).join(',') : null,
    vazba: novy ? (novy.links || []).some(l => l.to === 'e1' && l.type === 'partOf') : null };
});
ok(soucet, konverze.novaEntita && konverze.aspekt === 'Task',
  'z úkolu v komentáři vznikla entita s aspektem Úkol', konverze);
ok(soucet, konverze.vazba === true, 'a je propojená vazbou „je součástí"', konverze);
ok(soucet, /\[ \] \[\[Kanarek-K1-prvni\]\]/.test(konverze.komentar || ''),
  'v komentáři zůstal wiki odkaz na místě úkolu', konverze.komentar);
ok(soucet, konverze.telo === TELO, 'tělo entity se nezměnilo (kanárek)', konverze.telo);

nadpis('Editační režim: vlastní komentáře jdou zaškrtnout, okolní ne');
await pripravEntitu();
await otevriDetail(stranka, 'e1', 'edit');
const vEditaci = await stranka.evaluate(async () => {
  const cb = document.querySelector('#d-comments #comment-c1 input[type=checkbox][data-md-task]');
  if (!cb) return { chyba: 'v editaci není aktivní zaškrtávátko vlastního komentáře' };
  cb.checked = true;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(z => setTimeout(z, 400));
  return { zdroj: cb.dataset.mdTaskSource, komentar: findEntity('e1').comments[0].content, telo: findEntity('e1').body };
});
ok(soucet, !vEditaci.chyba && vEditaci.zdroj === 'comment:c1',
  'v editaci entity je úkol ve vlastním komentáři aktivní', vEditaci);
ok(soucet, /- \[x\] Kanarek-K1-prvni/.test(vEditaci.komentar || ''),
  'a zaškrtnutí se zapsalo do komentáře', vEditaci.komentar);
ok(soucet, vEditaci.telo === TELO, 'tělo entity se ani v editaci nezměnilo (kanárek)', vEditaci.telo);

// Komentáře okolních entit patří jiné entitě — vypisují se jako prostý text,
// takže tam zaškrtávátko není vůbec a nejde omylem zapsat do cizího komentáře.
await nasypej(stranka, [
  { id: 'a1', title: 'Hlavni', aspects: ['Note'], body: 'text' },
  { id: 'a2', title: 'Sousedni', aspects: ['Note'], body: 'text' }
]);
await stranka.evaluate(() => {
  const t = new Date().toISOString();
  findEntity('a2').comments = [{ id: 'cx', author: 'X', content: '- [ ] cizi ukol', created_at: t, updated_at: t }];
  findEntity('a2').links = [{ to: 'a1', type: 'partOf', note: '' }];
});
await otevriDetail(stranka, 'a1', 'edit');
const cizi = await stranka.evaluate(() => {
  const obal = document.getElementById('d-related-comments');
  if (!obal) return { obal: false };
  return { obal: true,
    aktivni: obal.querySelectorAll('input[type=checkbox][data-md-task]').length,
    jeTam: /cizi ukol/.test(obal.textContent) };
});
ok(soucet, cizi.obal && cizi.jeTam, 'sekce Komentáře v okolí entity se vypsala', cizi);
ok(soucet, cizi.aktivni === 0,
  'v komentářích okolních entit se nic zaškrtnout nedá (patří jiné entitě)', cizi);

await prohlizec.close();
process.exit(uzavri(soucet));
