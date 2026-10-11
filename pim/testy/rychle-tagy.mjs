// Rychlá úprava tagů jedné entity: klávesa L, tlačítko 🏷 Tagy v liště detailu,
// seznam se zaškrtávátky místo textového pole s čárkami.
//
// Hlídá hlavně dvě věci, na kterých to stojí: do dat se nesahá dřív než na
// Uložit, a pořadí seznamu se zaškrtáváním nepřeskládává (jinak by položky
// ujížděly pod kurzorem).
import { novySoucet, ok, nadpis, otevriAplikaci, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Rychlá úprava tagů');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

// Kanárci: entity, kterých se úprava nemá dotknout, a jejich přesné tagy.
async function pripravDb() {
  await stranka.evaluate(() => {
    db.entities = [
      newEntity({ id: 'x', title: 'Hlavní entita', aspects: ['Note'], tags: ['projekt-a', 'urgentni'] }),
      newEntity({ id: 'k1', title: 'KANÁREK-1', aspects: ['Note'], tags: ['smlouva', 'projekt-a', 'porada'] }),
      newEntity({ id: 'k2', title: 'KANÁREK-2', aspects: ['Note'], tags: ['smlouva', 'porada'] }),
      newEntity({ id: 'k3', title: 'KANÁREK-3', aspects: ['Note'], tags: ['smlouva'] })
    ];
    setView('detail', { detailId: 'x', detailMode: 'read' });
  });
  await stranka.waitForTimeout(500);
}
const kanarci = () => stranka.evaluate(() => ['k1', 'k2', 'k3']
  .map(id => id + ':' + (findEntity(id).tags || []).join('|')).join(' '));
const KANARCI = 'k1:smlouva|projekt-a|porada k2:smlouva|porada k3:smlouva';

const stavDialogu = () => stranka.evaluate(() => {
  const d = document.getElementById('quick-tag-dialog');
  if (!d || !d.open) return null;
  const grp = (id) => Array.from(document.querySelectorAll('#' + id + ' .qte-polozka'))
    .map(l => ({ tag: l.dataset.qteTag, zaskrtnuto: l.querySelector('input').checked,
                 skryto: l.classList.contains('qte-skryto'),
                 pocet: l.querySelector('.qte-pocet') ? l.querySelector('.qte-pocet').textContent : '' }));
  return { titulek: document.getElementById('qte-title').textContent,
    prirazene: grp('qte-prirazene'), ostatni: grp('qte-ostatni'),
    stav: document.getElementById('qte-stav').textContent,
    fokus: document.activeElement ? document.activeElement.id : '',
    prazdno: !document.getElementById('qte-prazdno').hidden,
    hlavickaOstatni: document.getElementById('qte-h-ostatni').hidden };
});
const zaskrtni = (tag, hodnota) => stranka.evaluate(({ tag, hodnota }) => {
  const l = Array.from(document.querySelectorAll('.qte-polozka')).find(x => x.dataset.qteTag === tag);
  if (!l) return false;
  const cb = l.querySelector('input');
  cb.checked = hodnota;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}, { tag, hodnota });

// ---------- Tlačítko a klávesa ----------
nadpis('Tlačítko v liště detailu');
await pripravDb();
const tlacitko = await stranka.evaluate(() => {
  const b = document.getElementById('btn-tags');
  return b ? { text: b.textContent.trim(), title: b.title } : null;
});
ok(soucet, !!tlacitko, 'v liště detailu je tlačítko 🏷 Tagy', tlacitko);
ok(soucet, tlacitko && tlacitko.text.includes('(2)'),
  'tlačítko ukazuje počet přiřazených tagů', tlacitko && tlacitko.text);
ok(soucet, tlacitko && /klávesa L/i.test(tlacitko.title),
  'title tlačítka říká, že to jde i klávesou L', tlacitko && tlacitko.title);

nadpis('Klávesa L v detailu (read) otevře dialog');
await stranka.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
await stranka.keyboard.press('l');
await stranka.waitForTimeout(400);
let s = await stavDialogu();
ok(soucet, !!s, 'dialog se otevřel', s);
ok(soucet, s && s.fokus === 'qte-filtr', 'fokus je rovnou ve filtru', s && s.fokus);
ok(soucet, s && s.titulek.includes('Hlavní entita'), 'v titulku je název entity', s && s.titulek);

nadpis('Přiřazené nahoře, ostatní podle četnosti');
ok(soucet, s && s.prirazene.map(p => p.tag).join(',') === 'projekt-a,urgentni',
  'přiřazené tagy jsou v horní skupině', s && s.prirazene);
ok(soucet, s && s.prirazene.every(p => p.zaskrtnuto),
  'a jsou zaškrtnuté', s && s.prirazene);
ok(soucet, s && s.ostatni.map(p => p.tag).join(',') === 'smlouva,porada',
  'ostatní jsou seřazené podle četnosti (smlouva 3×, porada 2×)', s && s.ostatni);
ok(soucet, s && s.ostatni.every(p => !p.zaskrtnuto),
  'a nejsou zaškrtnuté', s && s.ostatni);
ok(soucet, s && s.ostatni[0].pocet === '(3)' && s.ostatni[1].pocet === '(2)',
  'u každého tagu je vidět, kolikrát se v bázi používá', s && s.ostatni);
ok(soucet, s && s.stav === '2 přiřazeno · beze změn',
  'stavový řádek hlásí počet a že se zatím nic nezměnilo', s && s.stav);

// ---------- Filtr ----------
nadpis('Filtr nerozlišuje diakritiku a skrývá prázdné skupiny');
await stranka.fill('#qte-filtr', 'úrg');
await stranka.waitForTimeout(250);
s = await stavDialogu();
ok(soucet, s && s.prirazene.filter(p => !p.skryto).map(p => p.tag).join(',') === 'urgentni',
  '„úrg" najde „urgentni" i bez shody diakritiky', s && s.prirazene);
ok(soucet, s && s.hlavickaOstatni === true,
  'hlavička skupiny bez viditelné položky se schová', s && s.hlavickaOstatni);
await stranka.fill('#qte-filtr', 'xyzneni');
await stranka.waitForTimeout(250);
s = await stavDialogu();
ok(soucet, s && s.prazdno === true,
  'u neexistujícího tagu se nabídne vyrobit nový', s && s.prazdno);

nadpis('Enter přepne jedinou nalezenou položku');
await stranka.fill('#qte-filtr', 'urgent');
await stranka.waitForTimeout(200);
await stranka.keyboard.press('Enter');
await stranka.waitForTimeout(300);
s = await stavDialogu();
ok(soucet, s && s.prirazene.find(p => p.tag === 'urgentni').zaskrtnuto === false,
  'Enter nad jedinou shodou tag odškrtne (jde tak i odebírat)', s && s.prirazene);
ok(soucet, s && s.stav === '1 přiřazeno · −1', 'počítadlo ukazuje −1', s && s.stav);
ok(soucet, await stranka.inputValue('#qte-filtr') === '', 'filtr se po Enteru vyprázdní');

nadpis('Nový tag se přidá zaškrtnutý a normalizovaný');
await stranka.fill('#qte-filtr', 'Nový-TAG');
await stranka.keyboard.press('Enter');
await stranka.waitForTimeout(300);
s = await stavDialogu();
ok(soucet, s && s.prirazene[0].tag === 'nový-tag' && s.prirazene[0].zaskrtnuto,
  'nový tag je nahoře, zaškrtnutý a v malých písmenech', s && s.prirazene);
ok(soucet, s && s.stav === '2 přiřazeno · +1 −1', 'počítadlo ukazuje +1 −1', s && s.stav);

nadpis('Pořadí se zaškrtáváním nepřeskládává');
const poradiPred = (await stavDialogu()).ostatni.map(p => p.tag).join(',');
await zaskrtni('smlouva', true);
await stranka.waitForTimeout(200);
s = await stavDialogu();
ok(soucet, s.ostatni.map(p => p.tag).join(',') === poradiPred,
  'zaškrtnutý tag nevyskočil do horní skupiny — položky neujíždějí pod kurzorem', s.ostatni);

nadpis('Do dat se nesáhlo, dokud se neuložilo');
ok(soucet, (await stranka.evaluate(() => findEntity('x').tags.join(','))) === 'projekt-a,urgentni',
  'entita má pořád původní tagy');
ok(soucet, (await kanarci()) === KANARCI, 'kanárci: ostatní entity nedotčené');

// ---------- Uložení ----------
nadpis('Uložit zapíše a vrátí fokus na tlačítko');
const pred = await stranka.evaluate(() => findEntity('x').updated_at);
await stranka.click('#qte-save');
await stranka.waitForTimeout(600);
const poUlozeni = await stranka.evaluate(() => ({
  tagy: findEntity('x').tags, updated: findEntity('x').updated_at,
  dialog: !!document.getElementById('quick-tag-dialog'),
  fokus: document.activeElement ? document.activeElement.id : '',
  tlacitko: (document.getElementById('btn-tags') || {}).textContent || '' }));
ok(soucet, poUlozeni.tagy.join(',') === 'projekt-a,nový-tag,smlouva',
  'uloží se zaškrtnuté tagy, původní pořadí zůstává a nové jdou na konec', poUlozeni.tagy);
ok(soucet, poUlozeni.updated !== pred, 'entitě se zvedlo updated_at');
ok(soucet, poUlozeni.dialog === false, 'dialog se zavřel a odstranil z DOM');
ok(soucet, poUlozeni.fokus === 'btn-tags', 'fokus se vrátil na tlačítko, ne na <body>', poUlozeni.fokus);
ok(soucet, poUlozeni.tlacitko.includes('(3)'), 'tlačítko ukazuje nový počet', poUlozeni.tlacitko);
ok(soucet, (await kanarci()) === KANARCI, 'kanárci: uložení se dotklo jen téhle entity');

nadpis('Zrušit nechá data přesně tak, jak byla');
await stranka.evaluate(() => openQuickTagEditor('x'));
await stranka.waitForTimeout(400);
await zaskrtni('porada', true);
await zaskrtni('projekt-a', false);
await stranka.waitForTimeout(200);
await stranka.click('#qte-cancel');
await stranka.waitForTimeout(400);
ok(soucet, (await stranka.evaluate(() => findEntity('x').tags.join(','))) === 'projekt-a,nový-tag,smlouva',
  'po Zrušit zůstaly tagy nezměněné');
ok(soucet, (await kanarci()) === KANARCI, 'kanárci po zrušení');

nadpis('Uložení beze změn nezvedne updated_at');
const pred2 = await stranka.evaluate(() => findEntity('x').updated_at);
await stranka.evaluate(() => openQuickTagEditor('x'));
await stranka.waitForTimeout(400);
await stranka.click('#qte-save');
await stranka.waitForTimeout(400);
ok(soucet, (await stranka.evaluate(() => findEntity('x').updated_at)) === pred2,
  'beze změn se do dat nezapisuje vůbec');

nadpis('Escape se ptá, když je rozdělaná práce');
await stranka.evaluate(() => openQuickTagEditor('x'));
await stranka.waitForTimeout(400);
await zaskrtni('porada', true);
await stranka.waitForTimeout(150);
stranka.removeAllListeners('dialog');
stranka.on('dialog', d => d.dismiss());   // odmítnout zahození
await stranka.keyboard.press('Escape');
await stranka.waitForTimeout(400);
ok(soucet, !!(await stavDialogu()), 'po odmítnutí otázky dialog zůstal otevřený');
stranka.removeAllListeners('dialog');
stranka.on('dialog', d => d.accept());    // potvrdit zahození
await stranka.keyboard.press('Escape');
await stranka.waitForTimeout(400);
ok(soucet, (await stavDialogu()) === null, 'po potvrzení se dialog zavřel');
ok(soucet, (await stranka.evaluate(() => findEntity('x').tags.join(','))) === 'projekt-a,nový-tag,smlouva',
  'a změny se zahodily');

nadpis('Escape bez změn se neptá');
await stranka.evaluate(() => openQuickTagEditor('x'));
await stranka.waitForTimeout(400);
let ptalSe = false;
stranka.removeAllListeners('dialog');
stranka.on('dialog', d => { ptalSe = true; d.accept(); });
await stranka.keyboard.press('Escape');
await stranka.waitForTimeout(400);
ok(soucet, (await stavDialogu()) === null && ptalSe === false,
  'zavře se rovnou, bez zbytečné otázky');

nadpis('Klávesa L v edit módu nic neotevírá');
await otevriDetail(stranka, 'x', 'edit');
await stranka.evaluate(() => { const t = document.getElementById('d-body'); if (t) t.focus(); });
await stranka.keyboard.press('l');
await stranka.waitForTimeout(300);
ok(soucet, (await stavDialogu()) === null,
  'v editačním poli se píše písmeno, dialog nenaskočí');

nadpis('Klávesa L nad řádkem tabulky entit');
const zTabulky = await stranka.evaluate(async () => {
  setView('all');
  await new Promise(z => setTimeout(z, 700));
  const tr = document.querySelector('tr[data-row-entity]');
  if (!tr) return '(tabulka bez řádků)';
  tr.focus();
  tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'l', bubbles: true }));
  await new Promise(z => setTimeout(z, 400));
  const d = document.getElementById('quick-tag-dialog');
  return d && d.open ? document.getElementById('qte-title').textContent : '(neotevřelo se)';
});
ok(soucet, /Tagy:/.test(zTabulky), 'i z tabulky entit otevře L týž dialog', zTabulky);

await prohlizec.close();
process.exit(uzavri(soucet));
