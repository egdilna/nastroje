// Vytvoření entity z označeného textu: návrh názvu je CELÝ první řádek výběru.
// Dřív se usekl na 80 znaků a uživatel ho ručně prodlužoval zpátky.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const soucet = novySoucet('Název z označeného textu');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const DLOUHY = 'Metodika pro posuzování souladu informačních systémů veřejné správy s požadavky zákona o kybernetické bezpečnosti a prováděcích vyhlášek, verze 3';

async function navrh(vyber) {
  return await stranka.evaluate(async (vyber) => {
    const ta = document.getElementById('d-body');
    if (!ta) return { chyba: 'textarea obsahu nenalezena' };
    ta.value = vyber;
    doMdExtract(ta, findEntity('e1'), 0, vyber.length, vyber);
    await new Promise(z => setTimeout(z, 250));
    const inp = document.getElementById('extract-name');
    const hodnota = inp ? inp.value : null;
    const d = document.getElementById('dialog-extract');
    const zrus = document.getElementById('extract-cancel');
    if (zrus) zrus.click(); else if (d) d.close();
    await new Promise(z => setTimeout(z, 150));
    return { hodnota: hodnota, maxlength: inp ? inp.getAttribute('maxlength') : null };
  }, vyber);
}

await nasypej(stranka, [{ id: 'e1', title: 'Zdroj', aspects: ['Note'], body: 'text' }]);
await otevriDetail(stranka, 'e1', 'edit');

nadpis('Dlouhý první řádek se nezkrátí');
let r = await navrh(DLOUHY + '\n\nDalší odstavec výběru.');
ok(soucet, !r.chyba, 'dialog se otevřel', r.chyba);
ok(soucet, r.hodnota === DLOUHY,
  'návrh názvu je celý první řádek (' + DLOUHY.length + ' znaků), neuseknutý', r.hodnota);
ok(soucet, r.hodnota.length > 80, 'a je opravdu delší než dřívější strop 80 znaků', r.hodnota.length);
ok(soucet, !r.maxlength, 'pole názvu nemá maxlength, který by to usekl zpátky', r.maxlength);

nadpis('Nadpis se pořád zbaví mřížek');
r = await navrh('### ' + DLOUHY + '\n\nObsah.');
ok(soucet, r.hodnota === DLOUHY, 'z nadpisu se vezme text bez ###, taky celý', r.hodnota);

nadpis('Krátký výběr beze změny');
r = await navrh('Krátká poznámka\n\ns tělem.');
ok(soucet, r.hodnota === 'Krátká poznámka', 'krátký první řádek zůstává jak byl', r.hodnota);

nadpis('Jednořádkový výběr');
r = await navrh(DLOUHY);
ok(soucet, r.hodnota === DLOUHY, 'výběr bez konce řádku je celý názvem', r.hodnota);

nadpis('Okolní mezery a prázdné řádky nevadí');
r = await navrh('\n\n   ' + DLOUHY + '   \n\ntělo');
ok(soucet, r.hodnota === DLOUHY, 'název je oříznutý jen o mezery, ne o text', r.hodnota);

nadpis('Entita vzniklá z výběru má ten dlouhý název');
const vysledek = await stranka.evaluate(async (dlouhy) => {
  const ta = document.getElementById('d-body');
  const vyber = dlouhy + '\n\nTělo nové entity.';
  ta.value = vyber;
  doMdExtract(ta, findEntity('e1'), 0, vyber.length, vyber);
  await new Promise(z => setTimeout(z, 250));
  document.getElementById('extract-create').click();
  await new Promise(z => setTimeout(z, 500));
  const nova = db.entities.find(x => x.id !== 'e1');
  return nova ? { title: nova.title, body: nova.body } : { chyba: 'entita nevznikla' };
}, DLOUHY);
if (vysledek.chyba) ok(soucet, false, vysledek.chyba);
else {
  ok(soucet, vysledek.title === DLOUHY, 'uložená entita má celý název', vysledek.title);
  ok(soucet, /Tělo nové entity\./.test(vysledek.body), 'a výběr je v jejím obsahu', vysledek.body);
}

await prohlizec.close();
process.exit(uzavri(soucet));
