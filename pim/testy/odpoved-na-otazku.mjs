// Vytvoření odpovědi z detailu otázky: odpověď má zdědit tagy otázky
// a všechny projekty, jichž je otázka součástí. Bez toho odpověď vypadne
// ze všech filtrů a pohledů, ve kterých otázka je.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Odpověď na otázku');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

async function priprav() {
  await nasypej(stranka, [
    { id: 'pa', title: 'Projekt A', aspects: ['Project'], tags: ['projektovy'] },
    { id: 'pb', title: 'Projekt B', aspects: ['Project'], tags: ['jiny'] },
    { id: 'parch', title: 'Projekt archiv', aspects: ['Project'], archived: true },
    { id: 'q', title: 'Jak na to', aspects: ['Question'], tags: ['pravo', 'gdpr'],
      links: [
        { to: 'pa', type: 'partOf', note: '' },
        { to: 'pb', type: 'partOf', note: '' },
        { to: 'parch', type: 'partOf', note: '' }
      ] },
    { id: 'kanarek', title: 'Kanarek', aspects: ['Note'], tags: ['kanarek-tag'] }
  ]);
  await otevriDetail(stranka, 'q');
}

// Projde dialogem na název odpovědi a vrátí nově vzniklou entitu.
const vytvorOdpoved = (nazev) => stranka.evaluate(async (nazev) => {
  openCreateAnswerDialog(findEntity('q'));
  await new Promise(z => setTimeout(z, 250));
  const inp = document.querySelector('#dialog-prompt input, #dialog-prompt textarea');
  if (!inp) return { chyba: 'dialog se neotevřel' };
  inp.value = nazev;
  const ok = document.querySelector('#dialog-prompt button.primary, #prompt-ok');
  if (!ok) return { chyba: 'tlačítko potvrzení nenalezeno' };
  ok.click();
  await new Promise(z => setTimeout(z, 500));
  const e = db.entities.find(x => x.title === nazev);
  if (!e) return { chyba: 'odpověď nevznikla' };
  return {
    aspekty: (e.aspects || []).join(','),
    tags: (e.tags || []).join(','),
    vazby: (e.links || []).map(l => l.type + '→' + l.to).sort().join(','),
    attr: e.attributes
  };
}, nazev);

nadpis('Odpověď zdědí tagy i projekty otázky');
await priprav();
const o = await vytvorOdpoved('Takhle na to');
if (o.chyba) ok(soucet, false, o.chyba);
else {
  ok(soucet, o.aspekty === 'Answer', 'vznikla entita s aspektem Odpověď', o);
  ok(soucet, o.tags === 'pravo,gdpr', 'má všechny tagy otázky', o.tags);
  ok(soucet, o.vazby === 'answers→q,partOf→pa,partOf→pb',
    'má vazbu na otázku i na oba její projekty', o.vazby);
  ok(soucet, !o.vazby.includes('parch'),
    'archivovaný projekt se nedědí', o.vazby);
  ok(soucet, !!o.attr.answered_at, 'datum zodpovězení zůstalo doplněné', o.attr);
}

nadpis('Zdroj ani okolí se nemění');
const po = await stranka.evaluate(() => {
  const q = findEntity('q'), k = db.entities.find(x => x.title === 'Kanarek');
  return {
    otazkaTags: (q.tags || []).join(','),
    otazkaVazby: (q.links || []).map(l => l.type + '→' + l.to).join(','),
    kanarek: (k.tags || []).join(',')
  };
});
ok(soucet, po.otazkaTags === 'pravo,gdpr', 'otázka má pořád své tagy (kanárek)', po);
ok(soucet, po.otazkaVazby === 'partOf→pa,partOf→pb,partOf→parch',
  'a své vazby beze změny (kanárek)', po);
ok(soucet, po.kanarek === 'kanarek-tag', 'nesouvisející entita beze změny (kanárek)', po);

nadpis('Otázka bez tagů a bez projektů');
await nasypej(stranka, [{ id: 'q', title: 'Holá otázka', aspects: ['Question'], tags: [] }]);
await otevriDetail(stranka, 'q');
const o2 = await vytvorOdpoved('Holá odpověď');
if (o2.chyba) ok(soucet, false, o2.chyba);
else {
  ok(soucet, o2.tags === '', 'odpověď nemá žádné tagy', o2);
  ok(soucet, o2.vazby === 'answers→q', 'a jen vazbu na otázku', o2.vazby);
}

nadpis('Duplicitní partOf nevznikne');
await nasypej(stranka, [
  { id: 'pa', title: 'Projekt A', aspects: ['Project'] },
  { id: 'q', title: 'Otazka dvakrat', aspects: ['Question'], tags: ['x', 'x'],
    links: [{ to: 'pa', type: 'partOf', note: '' }, { to: 'pa', type: 'partOf', note: '' }] }
]);
await otevriDetail(stranka, 'q');
const o3 = await vytvorOdpoved('Odpoved bez duplicit');
if (o3.chyba) ok(soucet, false, o3.chyba);
else {
  ok(soucet, o3.vazby === 'answers→q,partOf→pa',
    'projekt uvedený v otázce dvakrát dá jednu vazbu', o3.vazby);
  ok(soucet, o3.tags === 'x', 'a duplicitní tag jeden tag', o3.tags);
}

await prohlizec.close();
process.exit(uzavri(soucet));
