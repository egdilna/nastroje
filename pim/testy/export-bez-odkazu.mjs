// INTERNÍ ODKAZY NEPATŘÍ DO VÝSTUPU, KTERÝ JDE MIMO PIM.
//
// `[[Entita]]` je mimo aplikaci nesmyslný zápis a `<a href="#" data-entity="…">`
// je ve Wordu nebo v mailu mrtvý odkaz, který musí příjemce ručně odklikat.
// DOCX je bez odkazů odjakživa — ostatní výstupy se tím teď řídí taky.
//
// Hlídají se tři věci: odkaz zmizí, **text zůstane celý** (včetně typu entity
// v závorce a obsahu status chipu) a cizí odkazy se toho netýkají — externí
// `http` i poznámky pod čarou u příjemce fungují a musí zůstat. A na obrazovce
// se nesmí změnit nic.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Export bez interních odkazů');
const { prohlizec, stranka } = await otevriAplikaci(s);

const TELO = [
  'Odkaz na [[Cílová entita]] a s aliasem [[Cílová entita|jiný popisek]].',
  '',
  'Podle id [[id:cil]] a číslem #42, stav {{status:Cílová entita}}.',
  '',
  'Externí [EGdílny](https://example.org) a poznámka[^1] musí zůstat.',
  '',
  '```',
  'Ukázka zápisu [[Cílová entita]] v bloku kódu',
  '```',
  '',
  'KANAREK-TELO',
  '',
  '[^1]: text poznámky'
].join('\n');

await stranka.evaluate((telo) => {
  db.entities = [
    newEntity({ id: 'cil', title: 'Cílová entita', aspects: ['Project'], numericId: 42,
      attributes: { status: 'active' } }),
    newEntity({ id: 'hl', title: 'Hlavní', aspects: ['Note'], numericId: 7, body: telo }),
    newEntity({ id: 'kan', title: 'KANÁREK mimo hru', aspects: ['Note'], body: 'KANAREK-MIMO [[Cílová entita]]' })
  ];
  state.view = 'dashboard'; render();
}, TELO);
await stranka.waitForTimeout(400);

// Spočítá odkazy v HTML podle druhu.
const pocty = (telo) => stranka.evaluate((t) => {
  const h = t;
  return {
    interni: (h.match(/<a[^>]*(data-entity=|data-create-name=|class="[^"]*wiki-link)/g) || []).length,
    externi: (h.match(/href="https/g) || []).length,
    poznamky: (h.match(/href="#fn/g) || []).length
  };
}, telo);

const vystupy = await stranka.evaluate(() => {
  const e = findEntity('hl');
  const sel = { body: true, title: true };
  const model = buildEntityExportModel(e, sel);
  const mdExport = odstranInterniOdkazyZMarkdownu(renderEntityAsMarkdown(model));
  const telo = odstranInterniOdkazyZMarkdownu(
    expandMarkdownIncludes(e.body, { markIncluded: false, entity: e }));
  return {
    mdExport: mdExport,
    mdTelo: telo,
    htmlExport: odstranInterniOdkazyZHtml(renderMarkdown(mdExport)),
    htmlTelo: odstranInterniOdkazyZHtml(renderMarkdown(telo)),
    tisk: odstranInterniOdkazyZHtml(renderEntityAsHtmlForPrint(model)),
    naObrazovce: renderMarkdown(e.body)
  };
});

nadpis('Markdown: zápis [[…]] zmizí, text zůstane');
ok(s, vystupy.mdExport.indexOf('[[') < 0 || /v bloku kódu/.test(vystupy.mdExport),
  'v exportu nezůstal žádný wiki zápis mimo blok kódu');
ok(s, /Odkaz na Cílová entita a s aliasem jiný popisek\./.test(vystupy.mdExport),
  'bez aliasu zůstane název, s aliasem alias', vystupy.mdExport.slice(0, 200));
ok(s, /Podle id Cílová entita/.test(vystupy.mdExport),
  'odkaz podle id se nahradí názvem entity, ne identifikátorem', vystupy.mdExport.slice(0, 300));
ok(s, /#42/.test(vystupy.mdExport),
  'číslo entity zůstává — je to text, ne odkaz');
ok(s, /Projekt/.test(vystupy.mdExport),
  'obsah status chipu zůstává i s typem entity');
ok(s, /\[EGdílny\]\(https:\/\/example\.org\)/.test(vystupy.mdExport),
  'externí odkaz se nijak nemění');
ok(s, /\[\[Cílová entita\]\] v bloku kódu/.test(vystupy.mdExport),
  'v bloku kódu zůstává zápis nedotčený — je to ukázka, ne odkaz');
ok(s, /KANAREK-TELO/.test(vystupy.mdTelo) && /KANAREK-TELO/.test(vystupy.mdExport),
  'kanárek v těle přežil obě cesty');

nadpis('HTML: interní odkazy nikde, cizí všude');
for (const [jmeno, html] of [['formátovaný export', vystupy.htmlExport],
                             ['formátovaná kopie těla', vystupy.htmlTelo],
                             ['tisk / PDF', vystupy.tisk]]) {
  const p = await pocty(html);
  ok(s, p.interni === 0, jmeno + ': žádný interní odkaz', p);
  ok(s, p.externi === 1, jmeno + ': externí odkaz zůstal', p);
  ok(s, p.poznamky >= 1, jmeno + ': odkazy na poznámku pod čarou zůstaly (ve výstupu fungují)', p);
}
ok(s, /Cílová entita/.test(vystupy.htmlTelo) && /jiný popisek/.test(vystupy.htmlTelo),
  'text odkazů v HTML zůstal');
ok(s, /Projekt/.test(vystupy.htmlTelo),
  'a typ entity v závorce taky — ten je mimo <a>, takže se ho to netýká');

nadpis('Na obrazovce se nemění nic');
const naObrazovce = await pocty(vystupy.naObrazovce);
ok(s, naObrazovce.interni >= 4,
  'render pro aplikaci má interní odkazy dál — tam jsou k navigaci', naObrazovce);

nadpis('DOCX se chová stejně — podle něj se to řídilo');
// Pozor na to, co se měří: `[[` v DOCX **je**, ale jen uvnitř bloku kódu, kde tam
// patří. Hledá se proto po odstavcích, ne v celém dokumentu — první verze téhle
// kontroly hlásila chybu, která žádná nebyla.
const docx = await stranka.evaluate(() => {
  const model = buildEntityExportModel(findEntity('hl'), { body: true, title: true });
  const paras = [], rels = [];
  renderMarkdownBlocksToDocx(model.body, paras, rels, {});
  const texty = paras.map(x => String(x));
  const prozaSZapisem = texty.filter(t => t.includes('[[') && !t.includes('v bloku kódu')).length;
  const kodMaZapis = texty.some(t => t.includes('[[') && t.includes('v bloku kódu'));
  const celek = texty.join(' ');
  return { prozaSZapisem, kodMaZapis, maNazev: celek.includes('Cílová entita'), maAlias: celek.includes('jiný popisek') };
});
ok(s, docx.prozaSZapisem === 0,
  'DOCX nemá zápis [[…]] v textu — stejně jako ostatní výstupy teď', docx);
ok(s, docx.maNazev && docx.maAlias,
  'a text odkazů v něm zůstává (název i alias)', docx);
ok(s, docx.kodMaZapis,
  'v bloku kódu ho DOCX nechává taky — ukázka zápisu se nepřepisuje', docx);

nadpis('Funkce samy o sobě');
const fn = await stranka.evaluate(() => ({
  bezAliasu: odstranInterniOdkazyZMarkdownu('a [[Cílová entita]] b'),
  sAliasem: odstranInterniOdkazyZMarkdownu('a [[Cílová entita|jinak]] b'),
  podleId: odstranInterniOdkazyZMarkdownu('a [[id:cil]] b'),
  neznameId: odstranInterniOdkazyZMarkdownu('a [[id:neexistuje]] b'),
  bezOdkazu: odstranInterniOdkazyZMarkdownu('text bez odkazu'),
  prazdne: odstranInterniOdkazyZMarkdownu(''),
  nullVstup: odstranInterniOdkazyZMarkdownu(null),
  htmlInterni: odstranInterniOdkazyZHtml('<a href="#" data-entity="x">Text</a>'),
  htmlTrida: odstranInterniOdkazyZHtml('<a href="#" class="wiki-link broken" data-create-name="N">Nová</a>'),
  htmlExterni: odstranInterniOdkazyZHtml('<a href="https://x.cz" target="_blank">X</a>'),
  htmlPoznamka: odstranInterniOdkazyZHtml('<a href="#fn-1">1</a>'),
  htmlDvaZaSebou: odstranInterniOdkazyZHtml('<a href="#" data-entity="a">A</a> a <a href="https://b.cz">B</a>')
}));
ok(s, fn.bezAliasu === 'a Cílová entita b' && fn.sAliasem === 'a jinak b',
  'bez aliasu název, s aliasem alias', fn);
ok(s, fn.podleId === 'a Cílová entita b' && fn.neznameId === 'a neexistuje b',
  'podle id se dohledá název; u neznámého zůstane aspoň identifikátor', fn);
ok(s, fn.bezOdkazu === 'text bez odkazu' && fn.prazdne === '' && fn.nullVstup === '',
  'text bez odkazů, prázdný vstup ani null funkci nerozhodí', fn);
ok(s, fn.htmlInterni === 'Text' && fn.htmlTrida === 'Nová',
  'HTML: interní odkaz se rozbalí na svůj text (i rozbitý wiki odkaz)', fn);
ok(s, fn.htmlExterni === '<a href="https://x.cz" target="_blank">X</a>' &&
     fn.htmlPoznamka === '<a href="#fn-1">1</a>',
  'HTML: externí odkaz a poznámka pod čarou zůstávají celé', fn);
ok(s, fn.htmlDvaZaSebou === 'A a <a href="https://b.cz">B</a>',
  'dva odkazy za sebou se rozliší — nenasytná shoda nespolkne oba', fn.htmlDvaZaSebou);

nadpis('Kanárek: zdrojová data se nemění');
ok(s, await stranka.evaluate(() =>
  findEntity('hl').body.indexOf('[[Cílová entita]]') >= 0 &&
  findEntity('kan').body === 'KANAREK-MIMO [[Cílová entita]]'),
  'těla entit zůstala se svými odkazy — odebírá se jen ve výstupu');

await prohlizec.close();
process.exit(uzavri(s));
