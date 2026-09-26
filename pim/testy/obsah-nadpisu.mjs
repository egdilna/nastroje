// Sekce „Nadpisy" v detailu entity: sbalený, klikatelný obsah dokumentu (TOC).
//
// Staví se z DOM až po setupAnnotations, protože nadpisy tam dostávají id
// p-block-N. Kdyby se pořadí obrátilo, anotace by id přepsala a odkazy
// v obsahu by nikam nevedly — právě na to jsou tu kontroly cílů.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Obsah nadpisů (TOC)');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const TELO = [
  '# Úvod', '', 'Text úvodu.', '',
  '## Příčiny', '', 'Text.', '',
  '### Podrobnosti', '', 'Text.', '',
  '## Příčiny', '', 'Stejný nadpis podruhé.', '',
  '# Závěr', '', 'Konec.'
].join('\n');

await nasypej(stranka, [
  { id: 'e1', title: 'Dokument', aspects: ['Note'], body: TELO },
  { id: 'e2', title: 'Jeden nadpis', aspects: ['Note'], body: '# Jediný\n\nText.' },
  { id: 'e3', title: 'Bez nadpisu', aspects: ['Note'], body: 'Jen text bez nadpisů.' },
  { id: 'src', title: 'Vlozena', aspects: ['Note'], body: '## Nadpis z transkluze\n\nText.' },
  { id: 'e4', title: 'S transkluzi', aspects: ['Note'], body: '# Vlastní\n\n{{include:Vlozena}}\n\nDál.' }
]);

nadpis('Sekce je nad Obsahem a defaultně sbalená');
await otevriDetail(stranka, 'e1');
const zaklad = await stranka.evaluate(() => {
  const sekce = document.getElementById('section-toc');
  const obsah = document.getElementById('section-body');
  return {
    je: !!sekce,
    sbalena: sekce ? !sekce.open : null,
    summary: sekce ? sekce.querySelector('summary').textContent.trim() : null,
    nadObsahem: (sekce && obsah)
      ? !!(sekce.compareDocumentPosition(obsah) & Node.DOCUMENT_POSITION_FOLLOWING) : null,
    nav: !!document.querySelector('#toc-nadpisy nav, nav#toc-nadpisy'),
    ariaLabel: (document.getElementById('toc-nadpisy') || {}).getAttribute
      ? document.getElementById('toc-nadpisy').getAttribute('aria-label') : null
  };
});
ok(soucet, zaklad.je, 'sekce Nadpisy je v detailu');
ok(soucet, zaklad.sbalena === true, 'je sbalená (details bez open)');
ok(soucet, zaklad.summary === 'Nadpisy', 'jmenuje se Nadpisy', zaklad.summary);
ok(soucet, zaklad.nadObsahem === true, 'stojí nad sekcí Obsah', zaklad);
ok(soucet, zaklad.ariaLabel === 'Nadpisy obsahu', 'nav má popisek pro odečítač', zaklad.ariaLabel);

nadpis('Položky: všechny nadpisy, ve správném pořadí a odsazení');
const polozky = await stranka.evaluate(() => {
  return Array.from(document.querySelectorAll('#toc-nadpisy a')).map(a => ({
    text: a.textContent,
    cil: a.getAttribute('href'),
    uroven: a.closest('li').className,
    cilExistuje: !!document.getElementById(a.getAttribute('href').slice(1))
  }));
});
ok(soucet, polozky.length === 5, 'obsahuje všech pět nadpisů', polozky.map(p => p.text));
ok(soucet, polozky.map(p => p.text).join('|') === 'Úvod|Příčiny|Podrobnosti|Příčiny|Závěr',
  'nadpisy jsou v pořadí dokumentu', polozky.map(p => p.text));
ok(soucet, polozky.map(p => p.uroven).join('|') === 'toc-uroven-0|toc-uroven-1|toc-uroven-2|toc-uroven-1|toc-uroven-0',
  'odsazení odpovídá úrovni nadpisu', polozky.map(p => p.uroven));
ok(soucet, polozky.every(p => p.cilExistuje),
  'každý odkaz míří na existující prvek (anotace mu id nepřepsaly)', polozky);
ok(soucet, new Set(polozky.map(p => p.cil)).size === polozky.length,
  'dva stejné nadpisy mají různé cíle', polozky.map(p => p.cil));

nadpis('Klik skočí na ten správný nadpis');
const skok = await stranka.evaluate(async () => {
  const odkazy = Array.from(document.querySelectorAll('#toc-nadpisy a'));
  const druhePriciny = odkazy[3];
  const cilId = druhePriciny.getAttribute('href').slice(1);
  druhePriciny.click();
  await new Promise(z => setTimeout(z, 200));
  const cil = document.getElementById(cilId);
  return { tag: cil.tagName, text: cil.textContent.trim(), predchozi: cil.previousElementSibling ? cil.previousElementSibling.textContent.trim() : null };
});
ok(soucet, skok.tag === 'H2' && skok.text === 'Příčiny',
  'klik na druhé „Příčiny" vede na nadpis druhé úrovně', skok);
ok(soucet, skok.predchozi === 'Stejný nadpis podruhé.' || /Podrobnosti|Text\./.test(skok.predchozi || ''),
  'a je to ten druhý výskyt, ne první', skok);

nadpis('Málo nadpisů = sekce se nezobrazuje');
await otevriDetail(stranka, 'e2');
const jeden = await stranka.evaluate(() => !!document.getElementById('section-toc'));
ok(soucet, jeden === false, 'jediný nadpis obsah nedělá');
await otevriDetail(stranka, 'e3');
const zadny = await stranka.evaluate(() => !!document.getElementById('section-toc'));
ok(soucet, zadny === false, 'text bez nadpisů obsah nedělá');

nadpis('Nadpisy z transkluze jsou taky vidět');
await otevriDetail(stranka, 'e4');
const trans = await stranka.evaluate(() =>
  Array.from(document.querySelectorAll('#toc-nadpisy a')).map(a => a.textContent));
ok(soucet, trans.join('|') === 'Vlastní|Nadpis z transkluze',
  'obsah ukazuje i nadpis z vložené entity — je na obrazovce', trans);

nadpis('Anotační značky se do popisku nepletou');
await nasypej(stranka, [{ id: 'e5', title: 'S anotaci', aspects: ['Note'],
  body: '# Nadpis s anotaci (>poznamka)\n\nText.\n\n## Druhy\n\nText.' }]);
await otevriDetail(stranka, 'e5');
const popisky = await stranka.evaluate(() =>
  Array.from(document.querySelectorAll('#toc-nadpisy a')).map(a => a.textContent));
ok(soucet, popisky[0] === 'Nadpis s anotaci',
  'popisek je čistý text nadpisu bez značky anotace', popisky);

await prohlizec.close();
process.exit(uzavri(soucet));
