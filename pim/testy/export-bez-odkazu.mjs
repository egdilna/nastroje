// WIKI ODKAZ VE VÝSTUPU: TUČNÝ NÁZEV A ASPEKTY KURZÍVOU.
//
// `[[Entita]]` je mimo aplikaci nesmyslný zápis a `<a href="#" data-entity="…">`
// je ve Wordu nebo v mailu mrtvý odkaz, který musí příjemce ručně odklikat.
// Odkaz proto ve výstupu není — místo něj tučný název entity a za ním aspekty
// v závorce kurzívou, oddělené čárkou. A je to tak ve **všech formátech**:
// MD, formátovaná kopie, tisk/PDF i DOCX (ten aspekty dřív neměl vůbec).
//
// Hlídá se pět věcí: podoba (tučně + kurzíva), že je ve všech čtyřech formátech
// stejná, že odkaz zmizel, že cizí odkazy (externí `http`, poznámky pod čarou)
// zůstaly — a že se na obrazovce nezměnilo nic.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Wiki odkazy ve výstupu');
const { prohlizec, stranka } = await otevriAplikaci(s);

const TELO = [
  'Odkaz na [[Cílová entita]] a s aliasem [[Cílová entita|jiný popisek]].',
  '',
  'Podle id [[id:cil]] a číslem #42, stav {{status:Cílová entita}}.',
  '',
  'Osoba [[Jan Novák]] a rozbitý odkaz [[Neexistuje]].',
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
    newEntity({ id: 'cil', title: 'Cílová entita', aspects: ['Project', 'Task'], numericId: 42,
      attributes: { status: 'active' } }),
    newEntity({ id: 'os', title: 'Jan Novák', aspects: ['Person'], numericId: 9 }),
    newEntity({ id: 'hl', title: 'Hlavní', aspects: ['Note'], numericId: 7, body: telo,
      comments: [{ id: 'k1', author: 'Já', content: 'Komentář s [[Cílová entita]].',
        created_at: '2026-01-01T10:00:00Z' }] }),
    newEntity({ id: 'kan', title: 'KANÁREK mimo hru', aspects: ['Note'], body: 'KANAREK-MIMO [[Cílová entita]]' })
  ];
  state.view = 'dashboard'; render();
}, TELO);
await stranka.waitForTimeout(400);

// Spočítá odkazy v HTML podle druhu.
const pocty = (telo) => stranka.evaluate((h) => ({
  interni: (h.match(/<a[^>]*(data-entity=|data-create-name=|class="[^"]*wiki-link)/g) || []).length,
  externi: (h.match(/href="https/g) || []).length,
  poznamky: (h.match(/href="#fn/g) || []).length
}), telo);

const vystupy = await stranka.evaluate(() => {
  const e = findEntity('hl');
  const sel = { body: true, title: true, comments: true };
  const md = prepisWikiOdkazyVMarkdownu(renderEntityAsMarkdown(buildEntityExportModel(e, sel)));
  const telo = prepisWikiOdkazyVMarkdownu(
    expandMarkdownIncludes(e.body, { markIncluded: false, entity: e }));
  const tiskModel = ocistiExportniModel(buildEntityExportModel(e, sel), { prostyTextKomentaru: true });
  return {
    md: md,
    mdTelo: telo,
    htmlExport: odstranInterniOdkazyZHtml(renderMarkdown(md)),
    htmlTelo: odstranInterniOdkazyZHtml(renderMarkdown(telo)),
    tisk: odstranInterniOdkazyZHtml(renderEntityAsHtmlForPrint(tiskModel)),
    naObrazovce: renderMarkdown(e.body)
  };
});

nadpis('Markdown: tučný název, aspekty kurzívou v závorce');
ok(s, /Odkaz na \*\*Cílová entita\*\* \(\*Projekt, Úkol\*\)/.test(vystupy.md),
  'název tučně, aspekty kurzívou a čárkou oddělené', vystupy.md.slice(0, 400));
ok(s, /s aliasem \*\*jiný popisek\*\* \(\*Projekt, Úkol\*\)/.test(vystupy.md),
  'alias je popiskem, aspekty se berou z cílové entity');
ok(s, /Podle id \*\*Cílová entita\*\* \(\*Projekt, Úkol\*\)/.test(vystupy.md),
  'odkaz podle id se dohledá na název, ne na identifikátor', vystupy.md.slice(0, 600));
ok(s, /Osoba \*\*Jan Novák\*\* \(\*Osoba\*\)/.test(vystupy.md),
  'jeden aspekt = jedna položka v závorce, bez čárky');
ok(s, /rozbitý odkaz \*\*Neexistuje\*\*\./.test(vystupy.md),
  'rozbitý odkaz zůstane tučný, ale závorka nevzniká — není z čeho', vystupy.md.slice(0, 700));
ok(s, /#42/.test(vystupy.md), 'číslo entity zůstává — je to text, ne odkaz');
ok(s, /Projekt/.test(vystupy.md), 'obsah status chipu zůstává');
ok(s, /\[EGdílny\]\(https:\/\/example\.org\)/.test(vystupy.md),
  'externí odkaz se nijak nemění');
ok(s, /\[\[Cílová entita\]\] v bloku kódu/.test(vystupy.md),
  'v bloku kódu zůstává zápis nedotčený — je to ukázka, ne odkaz');
ok(s, vystupy.md.replace(/\[\[Cílová entita\]\] v bloku kódu/, '').indexOf('[[') < 0,
  'mimo blok kódu nezůstal žádný wiki zápis');
ok(s, /Komentář s \*\*Cílová entita\*\* \(\*Projekt, Úkol\*\)/.test(vystupy.md),
  'platí to i v komentářích, které jdou do exportu');
ok(s, /KANAREK-TELO/.test(vystupy.mdTelo) && /KANAREK-TELO/.test(vystupy.md),
  'kanárek v těle přežil obě cesty');

nadpis('HTML: <strong> a <em>, interní odkazy nikde, cizí všude');
for (const [jmeno, html] of [['formátovaný export', vystupy.htmlExport],
                             ['formátovaná kopie těla', vystupy.htmlTelo],
                             ['tisk / PDF', vystupy.tisk]]) {
  const p = await pocty(html);
  ok(s, p.interni === 0, jmeno + ': žádný interní odkaz', p);
  ok(s, p.externi === 1, jmeno + ': externí odkaz zůstal', p);
  ok(s, p.poznamky >= 1, jmeno + ': odkazy na poznámku pod čarou zůstaly (ve výstupu fungují)', p);
  ok(s, /<strong>Cílová entita<\/strong> \(<em>Projekt, Úkol<\/em>\)/.test(html),
    jmeno + ': název v <strong>, aspekty v <em>', html.slice(0, 300));
}
ok(s, /<strong>jiný popisek<\/strong>/.test(vystupy.htmlTelo),
  'alias se v HTML vysází taky tučně');

nadpis('Tisk: komentáře se escapují, takže v nich závorka jde bez hvězdiček');
ok(s, /Komentář s Cílová entita \(Projekt, Úkol\)\./.test(vystupy.tisk),
  'v tiskovém komentáři není vidět markdown', (vystupy.tisk.match(/Komentář s[^<]*/) || [''])[0]);
ok(s, vystupy.tisk.indexOf('Komentář s **') < 0,
  'a hvězdičky se do něj tedy nedostaly');

nadpis('DOCX: tučný běh a kurzívní běh, teď i s aspekty');
// Pozor na to, co se měří: `[[` v DOCX **je**, ale jen uvnitř bloku kódu, kde tam
// patří. Hledá se proto po odstavcích, ne v celém dokumentu — první verze téhle
// kontroly hlásila chybu, která žádná nebyla.
const docx = await stranka.evaluate(() => {
  const model = ocistiExportniModel(
    buildEntityExportModel(findEntity('hl'), { body: true, title: true, comments: true }));
  const paras = [], rels = [];
  renderMarkdownBlocksToDocx(model.body, paras, rels, {});
  const texty = paras.map(x => String(x));
  const celek = texty.join(' ');
  return {
    prozaSZapisem: texty.filter(t => t.includes('[[') && !t.includes('v bloku kódu')).length,
    kodMaZapis: texty.some(t => t.includes('[[') && t.includes('v bloku kódu')),
    tucnyNazev: /<w:rPr><w:b\/><\/w:rPr><w:t xml:space="preserve">Cílová entita<\/w:t>/.test(celek),
    kurzivniAspekty: /<w:rPr><w:i\/><\/w:rPr><w:t xml:space="preserve">Projekt, Úkol<\/w:t>/.test(celek),
    tucnyAlias: /<w:rPr><w:b\/><\/w:rPr><w:t xml:space="preserve">jiný popisek<\/w:t>/.test(celek),
    zavorka: celek.includes('>) a s aliasem ')
  };
});
ok(s, docx.prozaSZapisem === 0,
  'DOCX nemá zápis [[…]] v textu', docx);
ok(s, docx.tucnyNazev, 'název entity je v DOCX tučný běh (<w:b/>)', docx);
ok(s, docx.kurzivniAspekty, 'aspekty jsou v DOCX kurzívní běh (<w:i/>) — dřív tam nebyly vůbec', docx);
ok(s, docx.tucnyAlias, 'alias se v DOCX vysází tučně stejně jako název', docx);
ok(s, docx.zavorka, 'závorky samy kurzívou nejsou — jen aspekty v nich', docx);
ok(s, docx.kodMaZapis,
  'v bloku kódu ho DOCX nechává taky — ukázka zápisu se nepřepisuje', docx);

nadpis('Na obrazovce se nemění nic');
const naObrazovce = await pocty(vystupy.naObrazovce);
ok(s, naObrazovce.interni >= 4,
  'render pro aplikaci má interní odkazy dál — tam jsou k navigaci', naObrazovce);
ok(s, /class="wiki-link" data-entity="cil"/.test(vystupy.naObrazovce) &&
     /wiki-aspects/.test(vystupy.naObrazovce),
  'a vypadá pořád stejně: odkaz plus šedivá závorka s aspekty vedle něj', naObrazovce);

nadpis('Funkce samy o sobě');
const fn = await stranka.evaluate(() => ({
  bezAliasu: prepisWikiOdkazyVMarkdownu('a [[Cílová entita]] b'),
  sAliasem: prepisWikiOdkazyVMarkdownu('a [[Cílová entita|jinak]] b'),
  podleId: prepisWikiOdkazyVMarkdownu('a [[id:cil]] b'),
  neznameId: prepisWikiOdkazyVMarkdownu('a [[id:neexistuje]] b'),
  prostyText: prepisWikiOdkazyVMarkdownu('a [[Cílová entita]] b', { prostyText: true }),
  bezOdkazu: prepisWikiOdkazyVMarkdownu('text bez odkazu'),
  prazdne: prepisWikiOdkazyVMarkdownu(''),
  nullVstup: prepisWikiOdkazyVMarkdownu(null),
  htmlInterni: odstranInterniOdkazyZHtml('<a href="#" data-entity="x">Text</a>'),
  htmlTrida: odstranInterniOdkazyZHtml('<a href="#" class="wiki-link broken" data-create-name="N">Nová</a>'),
  htmlExterni: odstranInterniOdkazyZHtml('<a href="https://x.cz" target="_blank">X</a>'),
  htmlPoznamka: odstranInterniOdkazyZHtml('<a href="#fn-1">1</a>'),
  htmlDvaZaSebou: odstranInterniOdkazyZHtml('<a href="#" data-entity="a">A</a> a <a href="https://b.cz">B</a>')
}));
ok(s, fn.bezAliasu === 'a **Cílová entita** (*Projekt, Úkol*) b' &&
     fn.sAliasem === 'a **jinak** (*Projekt, Úkol*) b',
  'bez aliasu název, s aliasem alias — aspekty vždy z cílové entity', fn);
ok(s, fn.podleId === 'a **Cílová entita** (*Projekt, Úkol*) b' &&
     fn.neznameId === 'a **neexistuje** b',
  'podle id se dohledá název i aspekty; u neznámého zůstane aspoň identifikátor', fn);
ok(s, fn.prostyText === 'a Cílová entita (Projekt, Úkol) b',
  'prostyText: tatáž informace, ale bez markdownu', fn);
ok(s, fn.bezOdkazu === 'text bez odkazu' && fn.prazdne === '' && fn.nullVstup === '',
  'text bez odkazů, prázdný vstup ani null funkci nerozhodí', fn);
ok(s, fn.htmlInterni === 'Text' && fn.htmlTrida === 'Nová',
  'HTML: interní odkaz se rozbalí na svůj text (i rozbitý wiki odkaz)', fn);
ok(s, fn.htmlExterni === '<a href="https://x.cz" target="_blank">X</a>' &&
     fn.htmlPoznamka === '<a href="#fn-1">1</a>',
  'HTML: externí odkaz a poznámka pod čarou zůstávají celé', fn);
ok(s, fn.htmlDvaZaSebou === 'A a <a href="https://b.cz">B</a>',
  'dva odkazy za sebou se rozliší — nenasytná shoda nespolkne oba', fn.htmlDvaZaSebou);

nadpis('Očištěný model je kopie — do dat se nesahá');
const kopie = await stranka.evaluate(() => {
  const puvodni = buildEntityExportModel(findEntity('hl'), { body: true, comments: true });
  const telo = puvodni.body;
  const ocisteny = ocistiExportniModel(puvodni);
  return {
    puvodniNedotcen: puvodni.body === telo && puvodni.body.indexOf('[[Cílová entita]]') >= 0,
    ocistenyJinyObjekt: ocisteny !== puvodni,
    komentarPuvodni: puvodni.comments[0].content,
    komentarOcisteny: ocisteny.comments[0].content,
    entitaNedotcena: findEntity('hl').body.indexOf('[[Cílová entita]]') >= 0
  };
});
ok(s, kopie.puvodniNedotcen && kopie.ocistenyJinyObjekt,
  'původní model zůstal se svými odkazy, očištěný je jiný objekt', kopie);
ok(s, kopie.komentarPuvodni.indexOf('[[') >= 0 && kopie.komentarOcisteny.indexOf('[[') < 0,
  'komentáře se kopírují taky, původní se nepřepsal', kopie);

nadpis('Kanárek: zdrojová data se nemění');
ok(s, await stranka.evaluate(() =>
  findEntity('hl').body.indexOf('[[Cílová entita]]') >= 0 &&
  findEntity('hl').comments[0].content === 'Komentář s [[Cílová entita]].' &&
  findEntity('kan').body === 'KANAREK-MIMO [[Cílová entita]]'),
  'těla i komentáře entit zůstaly se svými odkazy — přepisuje se jen ve výstupu');

await prohlizec.close();
process.exit(uzavri(s));
