// Umístění inline anotací: anotace musí skončit přesně u toho odstavce,
// na kterém uživatel klepnul na „+ Anotace".
//
// Proč tolik případů: anotace se do textu zapisují podle INDEXU ODSTAVCE,
// který se bere z pořadí potomků #body-rendered. Stačilo, aby renderer
// vyrobil o dva prázdné <p> víc (blok kódu v <p> prohlížeč rozdělí), a všechny
// anotace za tím blokem se lepily o dva odstavce vedle — tiše, bez varování.
// Druhá polovina chyby byla v zápisu: cílový řádek se hledal podle textu
// a brala se POSLEDNÍ shoda, takže u dvou stejných odstavců trefila druhý
// a u nenalezeného textu spadla anotace na konec dokumentu.
import {
  novySoucet, ok, nadpis, otevriAplikaci, nasypej, telo, uzavri
} from './lib.mjs';

const soucet = novySoucet('Umístění inline anotací');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

// Každý odstavec má unikátní značku (kanárek) — po vložení anotace musí všechny
// přežít a anotace smí být právě jedna, právě na svém řádku.
const TELO = [
  'Kanarek jedna.', '',
  '```', 'kod kanarek', '```', '',
  'Kanarek dva.', '',
  '## Kanarek nadpis', '',
  '- Kanarek seznam A', '- Kanarek seznam B', '',
  '> Kanarek citace', '',
  '| h1 | h2 |', '| --- | --- |', '| Kanarek bunka | druha |', '',
  'Kanarek stejny.', '',
  'Kanarek stejny.', '',
  '---', '',
  'Kanarek posledni.'
].join('\n');

async function pripravEntitu() {
  await nasypej(stranka, [{ id: 'e1', title: 'Anotovana', aspects: ['Note'], body: TELO }]);
  await stranka.evaluate(() => {
    state.view = 'detail'; state.detailId = 'e1'; state.detailMode = 'read';
    state.annotationMode = true; render();
  });
  await stranka.waitForTimeout(500);
}

// Klepne na „+ Anotace" u bloku, jehož text se rovná `hledany`, a uloží anotaci.
async function anotuj(hledany, obsah) {
  return await stranka.evaluate(async ({ hledany, obsah }) => {
    const be = document.getElementById('body-rendered');
    const cil = Array.from(be.querySelectorAll('[data-paragraph-index]'))
      .find(el => (el.textContent || '').replace(/\+ Anotace/g, '').trim() === hledany);
    if (!cil) return { chyba: 'blok nenalezen' };
    const btn = cil.querySelector('button.paragraph-anno-add-btn');
    if (!btn) return { chyba: 'blok bez tlačítka' };
    btn.click();
    await new Promise(z => setTimeout(z, 200));
    const pole = document.getElementById('anno-content');
    if (!pole) return { chyba: 'dialog se neotevřel' };
    pole.value = obsah;
    document.getElementById('anno-save').click();
    await new Promise(z => setTimeout(z, 300));
    return { odstavec: Number(cil.getAttribute('data-paragraph-index')) };
  }, { hledany, obsah });
}

// Na kterém řádku anotace skončila a kolik jich v těle je.
function kdeJe(body, obsah) {
  const radky = body.split('\n');
  const vyskyty = [];
  radky.forEach((r, i) => { if (r.indexOf('(>' + obsah + ')') >= 0) vyskyty.push(i); });
  return { radek: vyskyty.length ? vyskyty[0] : -1, pocet: vyskyty.length, radky };
}

nadpis('Odstavce zdroje a bloky v DOM se musí počítat stejně');
await pripravEntitu();
const srovnani = await stranka.evaluate(() => {
  const e = findEntity('e1');
  const rozsahy = extractBodyParagraphRanges(e.body);
  const be = document.getElementById('body-rendered');
  return {
    rozsahu: rozsahy.length,
    ankru: be.querySelectorAll('[data-paragraph-index]').length,
    prazdnychP: Array.from(be.querySelectorAll('p')).filter(p => !(p.textContent || '').replace(/\+ Anotace/g, '').trim()).length,
    indexy: Array.from(be.querySelectorAll('[data-paragraph-index]')).map(el => Number(el.getAttribute('data-paragraph-index')))
  };
});
ok(soucet, srovnani.rozsahu === srovnani.ankru,
  'počet odstavců zdroje = počet anotovatelných bloků v DOM', srovnani);
ok(soucet, srovnani.prazdnychP === 0,
  'render nevyrábí prázdné <p> (blok kódu v <p> prohlížeč rozdělí a indexy se posunou)', srovnani.prazdnychP);
ok(soucet, srovnani.indexy.join(',') === srovnani.indexy.map((_, i) => i).join(','),
  'indexy odstavců jdou po sobě od nuly bez děr', srovnani.indexy);

nadpis('Anotace skončí na řádku toho odstavce, na kterém se klepnulo');
const PRIPADY = [
  ['Kanarek jedna.', 'ANO-JEDNA', 'Kanarek jedna.'],
  ['Kanarek dva.', 'ANO-DVA', 'Kanarek dva.'],
  ['Kanarek nadpis', 'ANO-NADPIS', '## Kanarek nadpis'],
  ['Kanarek seznam B', 'ANO-SEZNAM', '- Kanarek seznam B'],
  ['Kanarek citace', 'ANO-CITACE', '> Kanarek citace'],
  ['Kanarek posledni.', 'ANO-POSLEDNI', 'Kanarek posledni.']
];
for (const [blok, obsah, ocekavanyRadek] of PRIPADY) {
  await pripravEntitu();
  const r = await anotuj(blok, obsah);
  if (r.chyba) { ok(soucet, false, 'anotace u „' + blok + '": ' + r.chyba); continue; }
  const body = await telo(stranka, 'e1');
  const k = kdeJe(body, obsah);
  const cistyRadek = k.radek >= 0 ? k.radky[k.radek].replace(/\s*\(>[^)]*\)/g, '') : null;
  ok(soucet, k.pocet === 1 && cistyRadek === ocekavanyRadek,
    'anotace u „' + blok + '" je právě jednou a na svém řádku',
    { odstavec: r.odstavec, radek: k.radek, text: k.radky[k.radek] });
  // Kanárci: nic jiného se nesmělo změnit
  const zbytek = body.replace(/\s*\(>[^)]*\)/g, '');
  ok(soucet, zbytek === TELO, 'text mimo anotaci u „' + blok + '" zůstal do znaku stejný');
}

nadpis('Dva stejné odstavce: anotace jde k tomu, na který se klepnulo');
await pripravEntitu();
const stejne = await stranka.evaluate(async () => {
  const be = document.getElementById('body-rendered');
  const bloky = Array.from(be.querySelectorAll('[data-paragraph-index]'))
    .filter(el => (el.textContent || '').replace(/\+ Anotace/g, '').trim() === 'Kanarek stejny.');
  if (bloky.length !== 2) return { chyba: 'stejných odstavců není dvojice: ' + bloky.length };
  bloky[0].querySelector('button.paragraph-anno-add-btn').click();
  await new Promise(z => setTimeout(z, 200));
  document.getElementById('anno-content').value = 'ANO-PRVNI-ZE-DVOU';
  document.getElementById('anno-save').click();
  await new Promise(z => setTimeout(z, 300));
  return { ok: true };
});
if (stejne.chyba) ok(soucet, false, stejne.chyba);
else {
  const body = await telo(stranka, 'e1');
  const radky = body.split('\n');
  const prvni = radky.findIndex(r => r.indexOf('Kanarek stejny.') >= 0);
  const kde = kdeJe(body, 'ANO-PRVNI-ZE-DVOU');
  ok(soucet, kde.radek === prvni,
    'anotace na PRVNÍM ze dvou shodných odstavců zůstala u prvního (dřív spadla na druhý)',
    { radek: kde.radek, prvni: prvni });
}

nadpis('Anotace nesmí rozbít Markdown');
await pripravEntitu();
const vTabulce = await anotuj('Kanarek bunkadruha', 'ANO-TABULKA');
if (vTabulce.chyba) {
  // Text <tr> se skládá bez mezer — zkusit variantu s mezerou
  const r2 = await anotuj('Kanarek bunka druha', 'ANO-TABULKA');
  ok(soucet, !r2.chyba, 'řádek tabulky se dá anotovat', r2.chyba);
} else ok(soucet, true, 'řádek tabulky se dá anotovat');
{
  const body = await telo(stranka, 'e1');
  const k = kdeJe(body, 'ANO-TABULKA');
  ok(soucet, k.radek >= 0 && /^\|.*\|\s*$/.test(k.radky[k.radek]),
    'anotace v tabulce jde do buňky, řádek zůstal řádkem tabulky', k.radky[k.radek]);
  const jeTabulka = await stranka.evaluate(() => {
    state.view = 'detail'; state.detailId = 'e1'; state.detailMode = 'read'; render();
    const be = document.getElementById('body-rendered');
    return { tabulek: be.querySelectorAll('table').length, radku: be.querySelectorAll('tbody tr').length };
  });
  ok(soucet, jeTabulka.tabulek === 1 && jeTabulka.radku === 1,
    'tabulka se po anotaci pořád vykresluje jako tabulka', jeTabulka);
}

nadpis('Bloky, které anotaci neunesou, ji nenabízejí');
await pripravEntitu();
const nabidka = await stranka.evaluate(() => {
  const be = document.getElementById('body-rendered');
  return Array.from(be.querySelectorAll('[data-paragraph-index]')).map(el => ({
    tag: el.tagName.toLowerCase(),
    tlacitko: !!el.querySelector('button.paragraph-anno-add-btn')
  }));
});
const pre = nabidka.find(x => x.tag === 'pre');
const hr = nabidka.find(x => x.tag === 'hr');
ok(soucet, pre && pre.tlacitko === false, 'blok kódu nenabízí „+ Anotace" (ohradník by anotaci neunesl)', pre);
ok(soucet, hr && hr.tlacitko === false, 'vodorovná linka nenabízí „+ Anotace"', hr);
ok(soucet, nabidka.filter(x => x.tlacitko).length === nabidka.length - 2,
  'všechny ostatní bloky „+ Anotace" nabízejí', nabidka);

nadpis('Přečtení anotace zpátky ukazuje na stejný odstavec');
await pripravEntitu();
await anotuj('Kanarek posledni.', 'ANO-ZPATKY');
const zpatky = await stranka.evaluate(() => {
  const e = findEntity('e1');
  const inl = extractInlineAnnotations(e.body);
  const rozsahy = extractBodyParagraphRanges(e.body);
  const a = inl.find(x => x.content === 'ANO-ZPATKY');
  return {
    paragraphIndex: a ? a.paragraphIndex : null,
    lineIndex: a ? a.lineIndex : null,
    poslednich: rozsahy.length,
    textOdstavce: a && rozsahy[a.paragraphIndex] ? rozsahy[a.paragraphIndex].text : null
  };
});
ok(soucet, zpatky.paragraphIndex === zpatky.poslednich - 1,
  'extractInlineAnnotations vrátí index posledního odstavce', zpatky);
ok(soucet, /Kanarek posledni\./.test(zpatky.textOdstavce || ''),
  'a ten odstavec je opravdu ten anotovaný', zpatky.textOdstavce);

nadpis('Transkluze a databázový include indexy neposouvají');
await nasypej(stranka, [
  { id: 'src', title: 'Vlozena', aspects: ['Note'], body: 'Vlozeny text.' },
  { id: 'e2', title: 'S transkluzi', aspects: ['Note'],
    body: 'Prvni.\n\n{{include:Vlozena}}\n\nDruhy.\n\n{{include:Vlozena}}\n\nTreti.' }
]);
await stranka.evaluate(() => {
  state.view = 'detail'; state.detailId = 'e2'; state.detailMode = 'read';
  state.annotationMode = true; render();
});
await stranka.waitForTimeout(500);
const trans = await stranka.evaluate(() => {
  const e = findEntity('e2');
  const be = document.getElementById('body-rendered');
  const ankry = Array.from(be.querySelectorAll('[data-paragraph-index]'));
  return {
    rozsahu: extractBodyParagraphRanges(e.body).length,
    ankru: ankry.length,
    prazdnychP: Array.from(be.children).filter(el => el.tagName.toLowerCase() === 'p' && !(el.textContent || '').replace(/\+ Anotace/g, '').trim()).length,
    indexTretiho: (() => {
      const el = ankry.find(x => (x.textContent || '').replace(/\+ Anotace/g, '').trim() === 'Treti.');
      return el ? Number(el.getAttribute('data-paragraph-index')) : null;
    })()
  };
});
ok(soucet, trans.prazdnychP === 0, 'transkluze nevyrábí prázdné <p>', trans);
ok(soucet, trans.rozsahu === trans.ankru, 's transkluzí sedí počet odstavců i anchorů', trans);
ok(soucet, trans.indexTretiho === 4, 'odstavec za dvěma transkluzemi má index 4, ne posunutý', trans);
const transAnot = await stranka.evaluate(async () => {
  const be = document.getElementById('body-rendered');
  const el = Array.from(be.querySelectorAll('[data-paragraph-index]'))
    .find(x => (x.textContent || '').replace(/\+ Anotace/g, '').trim() === 'Treti.');
  el.querySelector('button.paragraph-anno-add-btn').click();
  await new Promise(z => setTimeout(z, 200));
  document.getElementById('anno-content').value = 'ANO-ZA-TRANSKLUZI';
  document.getElementById('anno-save').click();
  await new Promise(z => setTimeout(z, 300));
  return findEntity('e2').body;
});
ok(soucet, /^Treti\. \(>ANO-ZA-TRANSKLUZI\)$/m.test(transAnot),
  'anotace za transkluzí skončila u „Treti.", ne o dva odstavce dřív', transAnot);

nadpis('Export a tisk anotaci nevynesou');
const cisty = await stranka.evaluate(() => {
  const e = findEntity('e2');
  return expandMarkdownIncludes(e.body, { markIncluded: false, entity: e, stripAnnotations: true });
});
ok(soucet, cisty.indexOf('(>') < 0 && cisty.indexOf('ANO-ZA-TRANSKLUZI') < 0,
  'očištěný text neobsahuje ani anotaci, ani zbytek závorek', cisty.slice(0, 200));

await prohlizec.close();
process.exit(uzavri(soucet));
