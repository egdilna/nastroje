// PŘÍSTUPNOST DIALOGU „VYBRAT ENTITU"
//
// Uživatel se v seznamu pohybuje odečítačem obrazovky a hledá položky po
// písmenech. Aby to fungovalo, musí přístupný název položky ZAČÍNAT názvem
// entity — žádná značka výběru, žádné zaškrtávátko před ním.
//
// Druhá věc: v listboxu znamená aria-selected „vybráno". Nesmí se jím značit
// jen zvýrazněná položka, jinak odečítač hlásí vybráno u všeho, přes co se
// projede šipkami, a skutečný výběr naopak nehlásí vůbec.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const s = novySoucet('Přístupnost výběru entity');
const { prohlizec, stranka } = await otevriAplikaci(s);

await nasypej(stranka, [
  { id: 'v1', title: 'Alfa projekt', aspects: ['Project'] },
  { id: 'v2', title: 'Beta poznámka', aspects: ['Note'] },
  { id: 'v3', title: 'Cyril Novák', aspects: ['Person'] },
  { id: 'v4', title: 'Dalibor Sýkora', aspects: ['Person'] }
]);

async function otevri(multiple, vybrane) {
  await stranka.evaluate(({ multiple, vybrane }) => {
    openRelationPicker({ fieldLabel: 'test', multiple: multiple, currentIds: vybrane || [], onSelect: () => {} });
  }, { multiple, vybrane });
  await stranka.waitForTimeout(450);
}
// Přibližně to, co odečítač přečte: text položky bez skrytých částí.
const pristupneNazvy = () => stranka.evaluate(() => {
  return [...document.querySelectorAll('#rp-list li[role="option"]')].map(li => {
    const kopie = li.cloneNode(true);
    kopie.querySelectorAll('[aria-hidden="true"]').forEach(n => n.remove());
    return kopie.textContent.replace(/\s+/g, ' ').trim();
  });
});
const stavy = () => stranka.evaluate(() =>
  [...document.querySelectorAll('#rp-list li[role="option"]')].map(li => ({
    text: li.textContent.replace(/\s+/g, ' ').trim(),
    vybrano: li.getAttribute('aria-selected'),
    aktivni: li.classList.contains('rp-aktivni')
  })));
const zavri = () => stranka.evaluate(() => document.getElementById('relation-picker').close());

nadpis('Položka začíná názvem entity');
await otevri(false);
const nazvy = await pristupneNazvy();
ok(s, nazvy.length === 4, 'seznam má všechny entity', nazvy);
ok(s, nazvy.every(t => /^[A-ZÁ-Ž]/.test(t)), 'každá položka začíná písmenem názvu, ne značkou', nazvy);
ok(s, nazvy.some(t => t.startsWith('Alfa projekt')), 'konkrétně „Alfa projekt…"', nazvy);
ok(s, nazvy.some(t => t.startsWith('Cyril Novák')), 'a „Cyril Novák…"', nazvy);
ok(s, !nazvy.some(t => /[○●☐☑]/.test(t)), 'v přístupném názvu není žádná značka výběru', nazvy);

nadpis('Značka zůstává vidět');
ok(s, await stranka.evaluate(() =>
  [...document.querySelectorAll('#rp-list li[role="option"]')].every(li => {
    const z = li.querySelector('.rp-znacka');
    return z && z.getAttribute('aria-hidden') === 'true' && /[○●☐☑]/.test(z.textContent);
  })), 'značka je v elementu skrytém pro odečítač');

nadpis('aria-selected znamená vybráno, ne zvýrazněno');
let st = await stavy();
ok(s, st.every(x => x.vybrano === 'false'), 'bez výběru není nic označené jako vybrané', st.map(x => x.vybrano));
ok(s, st[0].aktivni && st.slice(1).every(x => !x.aktivni), 'zvýrazněná je první položka');

await stranka.keyboard.press('ArrowDown');
await stranka.waitForTimeout(300);
st = await stavy();
ok(s, st.every(x => x.vybrano === 'false'), 'po šipce dolů pořád nic není „vybráno"', st.map(x => x.vybrano));
ok(s, st[1].aktivni, 'ale zvýraznění se posunulo');
ok(s, await stranka.evaluate(() => document.getElementById('rp-list').getAttribute('aria-activedescendant')) === 'rp-opt-1',
  'a aria-activedescendant ukazuje na ni');

nadpis('Skutečný výběr se hlásí');
await zavri();
await otevri(true, ['v3']);
st = await stavy();
const cyril = st.find(x => x.text.includes('Cyril'));
ok(s, cyril && cyril.vybrano === 'true', 'předvybraná entita má aria-selected=true', cyril);
ok(s, st.filter(x => x.vybrano === 'true').length === 1, 'a je označená právě jedna', st.map(x => x.vybrano));
const nazvyMulti = await pristupneNazvy();
ok(s, nazvyMulti.every(t => /^[A-ZÁ-Ž]/.test(t)), 'i ve vícenásobném výběru začíná název entitou', nazvyMulti);
ok(s, await stranka.evaluate(() => !document.querySelector('#rp-list input')),
  've výběru už není falešné zaškrtávátko (vlastní název položky)');

nadpis('Hlášení počtu je česky');
await zavri();
await otevri(false);
await stranka.fill('#rp-search', 'Cyril');
await stranka.waitForTimeout(450);
ok(s, (await stranka.evaluate(() => document.getElementById('rp-status').textContent)) === 'Nalezena 1 entita',
  'jedna entita se ohlásí správně', await stranka.evaluate(() => document.getElementById('rp-status').textContent));
await stranka.fill('#rp-search', 'a');
await stranka.waitForTimeout(450);
const hlaska = await stranka.evaluate(() => document.getElementById('rp-status').textContent);
ok(s, /^Nalezen[ya] \d+ entit/.test(hlaska), 'víc entit taky', hlaska);

nadpis('Role a provázání zůstaly v pořádku');
ok(s, await stranka.evaluate(() => document.getElementById('rp-list').getAttribute('role')) === 'listbox',
  'seznam má roli listbox');
ok(s, await stranka.evaluate(() =>
  [...document.querySelectorAll('#rp-list li[role="option"]')].every(li => li.id && li.id.startsWith('rp-opt-'))),
  'každá položka má id pro aria-activedescendant');
ok(s, await stranka.evaluate(() => {
  const l = document.querySelector('label[for="rp-search"]');
  return !!l && l.textContent.trim().length > 0;
}), 'pole hledání má popisek');

nadpis('Výběr klávesnicí pořád funguje');
// Jednovýběr: Enter rovnou potvrdí a zavře dialog.
await zavri();
await stranka.evaluate(() => {
  window.__vybrano = null;
  openRelationPicker({ fieldLabel: 'test', multiple: false, onSelect: (ids) => { window.__vybrano = ids; } });
});
await stranka.waitForTimeout(450);
const prvniNazev = (await pristupneNazvy())[1];
await stranka.keyboard.press('ArrowDown');
await stranka.keyboard.press('Enter');
await stranka.waitForTimeout(500);
const vysledek = await stranka.evaluate(() => ({
  vybrano: window.__vybrano,
  otevreno: document.getElementById('relation-picker').open
}));
ok(s, Array.isArray(vysledek.vybrano) && vysledek.vybrano.length === 1,
  'Enter v jednovýběru potvrdí právě jednu entitu', vysledek);
ok(s, !vysledek.otevreno, 'a dialog se zavře', vysledek);
ok(s, vysledek.vybrano && prvniNazev.startsWith(
  await stranka.evaluate((id) => getDisplayTitle(findEntity(id)), vysledek.vybrano[0])),
  'a je to ta, na které bylo zvýraznění', { prvniNazev, vysledek });

// Vícenásobný výběr: Enter přepíná a stav se hlásí přes aria-selected.
await otevri(true);
await stranka.keyboard.press('ArrowDown');
await stranka.keyboard.press('Enter');
await stranka.waitForTimeout(450);
st = await stavy();
ok(s, st.filter(x => x.vybrano === 'true').length === 1,
  'Enter ve vícevýběru položku označí', st.map(x => x.text + '=' + x.vybrano));
ok(s, await stranka.evaluate(() => document.getElementById('relation-picker').open),
  'a dialog zůstane otevřený');

await zavri();
await prohlizec.close();
process.exit(uzavri(s));
