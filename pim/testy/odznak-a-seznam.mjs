// 1) Odznak s počtem nedokončených markdownových úkolů u názvu entity.
// 2) Editor seznamu: sbalování podřízených položek a tlačítko „udělat úkol".
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, telo,
         otevriDetail, zapniEditaciSekci, uzavri } from './lib.mjs';

const s = novySoucet('Odznak úkolů a editor seznamu');
const { prohlizec, stranka } = await otevriAplikaci(s);

// ============================================================
nadpis('Odznak u názvu entity');
// ============================================================
await nasypej(stranka, [
  { id: 'a1', title: 'Dva nedokoncene', aspects: ['Note'],
    body: '- [ ] jedna\n- [x] hotovy\n- [ ] dva' },
  { id: 'a2', title: 'Vse hotove', aspects: ['Note'], body: '- [x] hotovy\n- [x] taky' },
  { id: 'a3', title: 'Bez ukolu', aspects: ['Note'], body: 'jen text' },
  { id: 'a4', title: 'Ukoly i komentare', aspects: ['Note'], body: '- [ ] jeden',
    comments: [{ id: 'c1', author: 'a', content: 'x', created_at: new Date().toISOString() }] },
  { id: 'a5', title: 'Ukol v atributu', aspects: ['Project'],
    attributes: { goal: '- [ ] cil jedna\n- [ ] cil dva' } }
]);

const odznak = (id) => stranka.evaluate((id) => {
  const d = document.createElement('div');
  d.innerHTML = getDisplayTitleWithBadges(findEntity(id));
  const u = d.querySelector('.entity-badge-tasks');
  const k = d.querySelector('.entity-badge-comments');
  return {
    ukoly: u ? u.textContent : null,
    komentare: k ? k.textContent : null,
    // pořadí v DOM: úkoly musí být před komentáři
    ukolyPrvni: !!(u && k) ? (u.compareDocumentPosition(k) & Node.DOCUMENT_POSITION_FOLLOWING) > 0 : null,
    titulek: u ? u.getAttribute('title') : null,
    text: d.textContent
  };
}, id);

let o = await odznak('a1');
ok(s, o.ukoly === '☐2', 'dvě nedokončené → ☐2', o);
ok(s, /2 nedokončené/.test(o.titulek || ''), 'a v titulku je to slovy', o.titulek);

o = await odznak('a2');
ok(s, o.ukoly === null, 'všechno hotové → žádný odznak', o);

o = await odznak('a3');
ok(s, o.ukoly === null, 'entita bez úkolů odznak nemá', o);

o = await odznak('a4');
ok(s, o.ukoly === '☐1' && o.komentare === '💬1', 'úkoly i komentáře vedle sebe', o);
ok(s, o.ukolyPrvni === true, 'a úkoly jsou PŘED komentáři', o);

o = await odznak('a5');
ok(s, o.ukoly === '☐2', 'počítají se i úkoly v textovém atributu', o);

o = await odznak('a1');
ok(s, /Dva nedokoncene/.test(o.text), 'název entity v odkazu zůstal', o.text);

nadpis('Odznak se mění se stavem úkolů');
await stranka.evaluate(() => { findEntity('a1').body = '- [x] jedna\n- [x] hotovy\n- [ ] dva'; });
ok(s, (await odznak('a1')).ukoly === '☐1', 'po zaškrtnutí ubude');
await stranka.evaluate(() => { findEntity('a1').body = '- [x] jedna\n- [x] hotovy\n- [x] dva'; });
ok(s, (await odznak('a1')).ukoly === null, 'a když je hotovo vše, odznak zmizí');

nadpis('Odznak se objeví i v seznamu entit');
await stranka.evaluate(() => {
  findEntity('a1').body = '- [ ] neco';
  state.view = 'all';
  state.filter = { aspect: '', tag: '', text: '', status: '', attrFilters: [] };
  render();
});
await stranka.waitForTimeout(500);
ok(s, await stranka.evaluate(() => !!document.querySelector('#all-results .entity-badge-tasks')),
  'v tabulce pohledu Vše je odznak vidět');

// ============================================================
nadpis('Editor seznamu — sbalování');
// ============================================================
const TELO = [
  '# Seznam', '',
  '- prvni uroven A',
  '  - podrizena A1',
  '  - podrizena A2',
  '- prvni uroven B',
  '- prvni uroven C'
].join('\n');

async function otevriSeznam() {
  await stranka.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
  await nasypej(stranka, [{ id: 'l1', title: 'Seznamova', aspects: ['Note'], body: TELO }]);
  await otevriDetail(stranka, 'l1', 'read');
  await zapniEditaciSekci(stranka);
  await stranka.evaluate(() => openListEditor(findEntity('l1'), 0));
  await stranka.waitForTimeout(450);
}
const radky = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#list-editor-content .le-item-row')].map(r => ({
    text: (r.querySelector('.le-text-display') || {}).textContent || '',
    maPrepinac: !!r.querySelector('button[data-le-toggle]'),
    rozbaleno: (r.querySelector('button[data-le-toggle]') || {}).getAttribute
      ? r.querySelector('button[data-le-toggle]').getAttribute('aria-expanded') : null,
    maUkolBtn: !!r.querySelector('button[data-le-ukol]')
  })));
const detiVidet = () => stranka.evaluate(() => {
  const li = document.querySelector('li[data-le-row-li="0"]');
  if (!li) return null;
  const vnoreny = li.querySelector(':scope > ul.le-nested, :scope > ol.le-nested');
  return vnoreny ? vnoreny.offsetParent !== null : null;
});

await otevriSeznam();
let r = await radky();
ok(s, r.length === 5, 'editor ukazuje všech pět položek', r.length);
ok(s, r[0].maPrepinac, 'položka s podřízenými má přepínač', r[0]);
ok(s, !r[1].maPrepinac && !r[3].maPrepinac, 'položka bez podřízených ho nemá', [r[1], r[3]]);
ok(s, r[0].rozbaleno === 'true', 've výchozím stavu je rozbaleno', r[0]);
ok(s, (await detiVidet()) === true, 'a podřízené jsou vidět');

await stranka.click('button[data-le-toggle="0"]');
await stranka.waitForTimeout(400);
ok(s, (await detiVidet()) === false, 'kliknutí podřízené schová');
ok(s, (await radky())[0].rozbaleno === 'false', 'a přepínač to hlásí přes aria-expanded');
ok(s, await stranka.evaluate(() => document.activeElement.dataset.leToggle === '0'),
  'fokus zůstal na přepínači');

await stranka.click('button[data-le-toggle="0"]');
await stranka.waitForTimeout(400);
ok(s, (await detiVidet()) === true, 'druhé kliknutí zase rozbalí');

nadpis('Sbalení se do uloženého markdownu nepromítne');
await otevriSeznam();
await stranka.click('button[data-le-toggle="0"]');
await stranka.waitForTimeout(350);
await stranka.click('#le-save');
await stranka.waitForTimeout(800);
const poUlozeni = await telo(stranka, 'l1');
ok(s, poUlozeni.includes('podrizena A1') && poUlozeni.includes('podrizena A2'),
  'sbalené podřízené položky se uložily taky', poUlozeni);
ok(s, !/_sbaleno/.test(poUlozeni), 'a v markdownu není nic navíc', poUlozeni);

// ============================================================
nadpis('Editor seznamu — udělat úkol');
// ============================================================
await otevriSeznam();
r = await radky();
ok(s, r.every(x => x.maUkolBtn), 'u všech běžných položek je tlačítko ☐ úkol');

await stranka.click('button[data-le-ukol="1"]');
await stranka.waitForTimeout(400);
r = await radky();
ok(s, !r[1].maUkolBtn, 'u položky, která už úkol je, tlačítko zmizí', r[1]);
ok(s, r[0].maUkolBtn && r[2].maUkolBtn, 'u ostatních zůstává', [r[0], r[2]]);

await stranka.click('#le-save');
await stranka.waitForTimeout(800);
const md = await telo(stranka, 'l1');
ok(s, /^ {2}- \[ \] podrizena A1$/m.test(md), 'v markdownu je úkol i se správným odsazením', md);
ok(s, /^- prvni uroven A$/m.test(md), 'ostatní řádky se nezměnily', md);

nadpis('Na už hotový úkol se tlačítko nenabízí');
await stranka.evaluate(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()));
await nasypej(stranka, [{ id: 'l2', title: 'Uz ukoly', aspects: ['Note'],
  body: '# S\n\n- [ ] nehotovy\n- [x] hotovy\n- obycejna' }]);
await otevriDetail(stranka, 'l2', 'read');
await zapniEditaciSekci(stranka);
await stranka.evaluate(() => openListEditor(findEntity('l2'), 0));
await stranka.waitForTimeout(450);
r = await radky();
ok(s, !r[0].maUkolBtn && !r[1].maUkolBtn, 'u [ ] ani [x] se tlačítko nenabízí', [r[0], r[1]]);
ok(s, r[2].maUkolBtn, 'u obyčejné položky ano', r[2]);

await prohlizec.close();
process.exit(uzavri(s));
