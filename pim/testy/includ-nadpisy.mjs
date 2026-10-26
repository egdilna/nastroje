// SROVNÁNÍ ÚROVNÍ NADPISŮ PŘI INCLUDU.
//
// Vložená entita se má chovat jako podúroveň toho místa, kam se vkládá: její
// nejvyšší nadpis dostane úroveň o jednu hlubší, než je nejbližší nadpis nad
// includem, a ostatní si proti němu udrží rozestupy. Posun se počítá z toho, co
// ve vložené entitě opravdu je — z nadpisů 4 a 5 pod základem 3 vyjdou 3 a 4.
//
// Hlídají se tři věci: obě cesty includu (render na obrazovku i rozbalení do
// Markdownu pro export a push) musí dát stejnou strukturu, zdrojová těla entit
// se nesmí změnit (srovnání je zobrazovací, ne přepis dat) a bloky kódu zůstanou
// nedotčené.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Úrovně nadpisů při includu');
const { prohlizec, stranka } = await otevriAplikaci(s);

// Těla si schováme, aby na konci šlo ověřit, že se jich render ani rozbalení
// nedotklo. Unikátní značky v textu jsou kanárci — kdyby je někdo přepsal, bude
// to vidět.
const TELA = {
  hluboka: '#### Jen čtyřka\n\nKANAREK-HLUBOKA\n\n##### A pětka\n\nDalší text.',
  normalni: '# Nejvyšší v části\n\nKANAREK-NORMALNI\n\n## Nižší v části\n\nText.',
  bezNadpisu: 'KANAREK-BEZ-NADPISU, jen odstavec.',
  sKodem: '## Nadpis v části\n\n```\n# tohle je komentář v kódu\n## a tohle taky\n```\n\n### Hlubší',
  vnorujici: '## Vnořující nahoře\n\nKANAREK-VNORUJICI\n\n{{include:Část normální}}',
  sestka: '# Jedna\n\n## Dvě\n\n### Tři\n\n#### Čtyři\n\n##### Pět\n\n###### Šest'
};

await stranka.evaluate((t) => {
  db.entities = [
    newEntity({ id: 'hluboka', title: 'Část hluboká', aspects: ['Note'], body: t.hluboka }),
    newEntity({ id: 'normalni', title: 'Část normální', aspects: ['Note'], body: t.normalni }),
    newEntity({ id: 'bezn', title: 'Část bez nadpisů', aspects: ['Note'], body: t.bezNadpisu }),
    newEntity({ id: 'skodem', title: 'Část s kódem', aspects: ['Note'], body: t.sKodem }),
    newEntity({ id: 'vnorujici', title: 'Vnořující', aspects: ['Note'], body: t.vnorujici }),
    newEntity({ id: 'sestka', title: 'Část šestka', aspects: ['Note'], body: t.sestka }),
    newEntity({ id: 'kanarek', title: 'KANÁREK mimo hru', aspects: ['Note'], body: 'KANAREK-MIMO' })
  ];
  state.view = 'dashboard'; render();
}, TELA);
await stranka.waitForTimeout(400);

// Vrátí úrovně nadpisů vyrenderovaného textu jako „3:Název".
async function urovneHtml(telo) {
  return await stranka.evaluate((t) => {
    const html = renderMarkdown(t, { ctx: { depth: 0, includeStack: new Set() } });
    const d = document.createElement('div');
    d.innerHTML = html;
    return Array.from(d.querySelectorAll('h1,h2,h3,h4,h5,h6'))
      .map(h => h.tagName.slice(1) + ':' + h.textContent.trim());
  }, telo);
}

// Totéž z cesty rozbalení do Markdownu — ta jde do exportu, tisku a pushe na GitHub.
async function urovneMd(telo) {
  return await stranka.evaluate((t) => {
    const md = expandMarkdownIncludes(t, { markIncluded: false });
    const out = [];
    let vKodu = false;
    md.split('\n').forEach(r => {
      if (/^\s*```/.test(r)) { vKodu = !vKodu; return; }
      if (vKodu) return;
      const m = r.match(/^(#{1,6})\s+(.*)$/);
      if (m) out.push(m[1].length + ':' + m[2].trim());
    });
    return out;
  }, telo);
}

// Obě cesty musí dát tutéž strukturu — jinak vypadá export jinak než obrazovka.
async function obeCesty(soucet, telo, ocekavane, popis) {
  const html = await urovneHtml(telo);
  const md = await urovneMd(telo);
  ok(soucet, html.join(' | ') === ocekavane.join(' | '), popis + ' (render)', html);
  ok(soucet, md.join(' | ') === ocekavane.join(' | '), popis + ' (rozbalení do Markdownu)', md);
}

nadpis('Základ dá nejbližší nadpis nad includem');
await obeCesty(s, '# Hlavní\n\n## Kapitola\n\n{{include:Část normální}}',
  ['1:Hlavní', '2:Kapitola', '3:Nejvyšší v části', '4:Nižší v části'],
  'pod nadpisem 2 začne vložené na 3 a rozestup si drží');
await obeCesty(s, '# Hlavní\n\n{{include:Část normální}}',
  ['1:Hlavní', '2:Nejvyšší v části', '3:Nižší v části'],
  'pod nadpisem 1 začne na 2');
await obeCesty(s, '# H\n\n## K\n\n### Podkapitola\n\n{{include:Část normální}}',
  ['1:H', '2:K', '3:Podkapitola', '4:Nejvyšší v části', '5:Nižší v části'],
  'rozhoduje nejbližší nadpis, ne ten nejvyšší');

nadpis('Posun se počítá z toho, co ve vložené entitě opravdu je');
await obeCesty(s, '# Hlavní\n\n## Kapitola\n\n{{include:Část hluboká}}',
  ['1:Hlavní', '2:Kapitola', '3:Jen čtyřka', '4:A pětka'],
  'z nadpisů 4 a 5 vyjdou pod základem 3 nadpisy 3 a 4');
await obeCesty(s, '# Hlavní\n\n{{include:Část hluboká}}',
  ['1:Hlavní', '2:Jen čtyřka', '3:A pětka'],
  'tytéž nadpisy 4 a 5 pod základem 2 dají 2 a 3');

nadpis('Bez nadpisu nad includem se neposouvá nic');
await obeCesty(s, 'Jen odstavec bez nadpisu.\n\n{{include:Část hluboká}}',
  ['4:Jen čtyřka', '5:A pětka'],
  'vložená entita si nechá vlastní úrovně');

nadpis('Dva includy pod jedním nadpisem začnou oba stejně');
await obeCesty(s, '## Kapitola\n\n{{include:Část normální}}\n\n{{include:Část hluboká}}',
  ['2:Kapitola', '3:Nejvyšší v části', '4:Nižší v části', '3:Jen čtyřka', '4:A pětka'],
  'druhý include se nezanoří pod nadpisy toho prvního');

nadpis('Hostitelské nadpisy si drží svou úroveň');
await obeCesty(s, '## Kapitola\n\n{{include:Část hluboká}}\n\n## Druhá kapitola',
  ['2:Kapitola', '3:Jen čtyřka', '4:A pětka', '2:Druhá kapitola'],
  'nadpis za includem zůstává tam, kde ho autor napsal');

nadpis('Vnoření se skládá');
await obeCesty(s, '# Hlavní\n\n## Kapitola\n\n{{include:Vnořující}}',
  ['1:Hlavní', '2:Kapitola', '3:Vnořující nahoře', '4:Nejvyšší v části', '5:Nižší v části'],
  'include v includu pokračuje o úroveň hlouběji');

nadpis('Zaražení na šestce — hlubší nadpis HTML nemá');
await obeCesty(s, '# H\n\n## K\n\n### P\n\n{{include:Část šestka}}',
  ['1:H', '2:K', '3:P', '4:Jedna', '5:Dvě', '6:Tři', '6:Čtyři', '6:Pět', '6:Šest'],
  'co by přeteklo za 6, slije se do 6');

nadpis('Blok kódu se nepřepisuje');
const sKodem = await urovneHtml('## Kapitola\n\n{{include:Část s kódem}}');
ok(s, sKodem.join(' | ') === '2:Kapitola | 3:Nadpis v části | 4:Hlubší',
  '„#" uvnitř ohradníků se nebere jako nadpis', sKodem);
ok(s, await stranka.evaluate(() => {
  const html = renderMarkdown('## Kapitola\n\n{{include:Část s kódem}}', { ctx: { depth: 0, includeStack: new Set() } });
  const m = html.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);
  return !!m && m[1].includes('# tohle je komentář v kódu') && m[1].includes('## a tohle taky');
}), 'a obsah bloku kódu zůstal přesně jak byl');
ok(s, (await urovneMd('## Kapitola\n\n{{include:Část s kódem}}')).join(' | ')
  === '2:Kapitola | 3:Nadpis v části | 4:Hlubší',
  'totéž platí při rozbalení do Markdownu');
ok(s, (await stranka.evaluate(() =>
  expandMarkdownIncludes('## K\n\n{{include:Část s kódem}}', { markIncluded: false })))
  .includes('# tohle je komentář v kódu'),
  'a křížky v kódu přežijí i rozbalení');

nadpis('Entita bez nadpisů projde beze změny');
const bezN = await stranka.evaluate(() =>
  renderMarkdown('## Kapitola\n\n{{include:Část bez nadpisů}}', { ctx: { depth: 0, includeStack: new Set() } }));
ok(s, bezN.includes('KANAREK-BEZ-NADPISU'), 'text se vložil celý');
ok(s, (await urovneHtml('## Kapitola\n\n{{include:Část bez nadpisů}}')).join(' | ') === '2:Kapitola',
  'a žádný nadpis odnikud nevznikl');

nadpis('Kanárci: srovnání je zobrazovací, zdrojová těla se nemění');
const telaPo = await stranka.evaluate(() => {
  const z = {};
  db.entities.forEach(e => { z[e.id] = e.body; });
  return z;
});
ok(s, telaPo.hluboka === TELA.hluboka && telaPo.normalni === TELA.normalni,
  'těla vkládaných entit jsou bajt za bajtem původní');
ok(s, telaPo.skodem === TELA.sKodem && telaPo.vnorujici === TELA.vnorujici,
  'včetně té s blokem kódu a té vnořující');
ok(s, telaPo.bezn === TELA.bezNadpisu && telaPo.sestka === TELA.sestka,
  'i zbytku vkládaných entit');
ok(s, telaPo.kanarek === 'KANAREK-MIMO', 'entita mimo hru zůstala nedotčená');

nadpis('Pomocné funkce samy o sobě');
const pom = await stranka.evaluate(() => ({
  min4: nejvyssiUrovenNadpisu('#### a\n\n##### b'),
  minZadny: nejvyssiUrovenNadpisu('jen text'),
  minVKodu: nejvyssiUrovenNadpisu('```\n# v kódu\n```'),
  posun: posunNadpisuProInclude(3, '#### a\n\n##### b'),
  posunBezZakladu: posunNadpisuProInclude(0, '#### a'),
  posunBezNadpisu: posunNadpisuProInclude(3, 'jen text'),
  prepis: posunNadpisuVTextu('#### a\n\n##### b', -1),
  prepisNula: posunNadpisuVTextu('#### a', 0),
  zaklad: zakladUrovneProMisto('# A\n\n## B\n\nTEXT', 12),
  zakladBez: zakladUrovneProMisto('jen text', 5)
}));
ok(s, pom.min4 === 4 && pom.minZadny === null, 'nejvyssiUrovenNadpisu: 4, resp. null', pom);
ok(s, pom.minVKodu === null, 'nadpis v bloku kódu se nepočítá', pom.minVKodu);
ok(s, pom.posun === -1 && pom.posunBezZakladu === 0 && pom.posunBezNadpisu === 0,
  'posunNadpisuProInclude umí i posun nahoru a nulu', pom);
ok(s, pom.prepis === '### a\n\n#### b' && pom.prepisNula === '#### a',
  'posunNadpisuVTextu přepíše křížky, nula je no-op', pom);
ok(s, pom.zaklad === 3 && pom.zakladBez === 0,
  'zakladUrovneProMisto bere nejbližší nadpis nad pozicí', pom);

await prohlizec.close();
process.exit(uzavri(s));
