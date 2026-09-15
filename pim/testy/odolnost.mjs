// ODOLNOST — schválně ošklivý obsah a vlastnost „otevřít a uložit beze změny".
//
// Nejtvrdší kontrola, jakou na editor sekce jde pustit: otevřít sekci, nic v ní
// nezměnit, uložit — a ověřit, že se v těle neztratil ani znak. Když rozdělování
// sekcí někde ujede (kódový blok, který vypadá jako nadpis; dva stejné nadpisy;
// nadpis v citaci), projeví se to přesně takhle: uloží se přes cizí kus textu.
import {
  novySoucet, ok, nadpis, otevriAplikaci, nasypej, telo,
  otevriDetail, zapniEditaciSekci, otevriSekci, uzavri
} from './lib.mjs';

const s = novySoucet('Odolnost');
const { prohlizec, stranka } = await otevriAplikaci(s);

// Každý případ má v každé sekci unikátní kanárky; ztráta kteréhokoli = chyba.
const PRIPADY = [
  { nazev: 'kódový blok, který vypadá jako nadpisy',
    telo: '# Prava sekce\n\nKan-1.\n\n```\n## Falesny nadpis v kodu\nKan-KOD\n```\n\n## Druha prava\n\nKan-2.' },
  { nazev: 'dva stejné nadpisy',
    telo: '# Stejny\n\nKan-PRVNI.\n\n# Stejny\n\nKan-DRUHY.\n\n# Jiny\n\nKan-TRETI.' },
  { nazev: 'nadpis v citaci',
    telo: '# Sekce\n\nKan-A.\n\n> ## Nadpis v citaci\n> Kan-CITACE\n\n## Dalsi\n\nKan-B.' },
  { nazev: 'prázdná sekce uprostřed',
    telo: '# Prvni\n\nKan-1.\n\n## Prazdna\n\n## Treti\n\nKan-3.' },
  { nazev: 'text před prvním nadpisem',
    telo: 'Kan-PRED nadpisem.\n\n# Prvni\n\nKan-1.\n\n## Druha\n\nKan-2.' },
  { nazev: 'nadpisy všech úrovní',
    telo: '# H1\n\nKan-1.\n\n## H2\n\nKan-2.\n\n### H3\n\nKan-3.\n\n#### H4\n\nKan-4.\n\n##### H5\n\nKan-5.\n\n###### H6\n\nKan-6.' },
  { nazev: 'anotace a placeholdery v nadpisu',
    telo: '# Nadpis (>anotace v nadpisu)\n\nKan-1.\n\n## Druha ((atribut))\n\nKan-2.' },
  { nazev: 'wiki odkazy a include',
    telo: '# Prvni\n\nKan-1 s [[Jina entita]].\n\n## Druha\n\nKan-2 s {{include:Jina entita}}.' },
  { nazev: 'CriticMarkup napříč sekcemi',
    telo: '# Prvni\n\nKan-1 {++vlozeno++}.\n\n## Druha\n\nKan-2 {--smazano--} a {~~stare~>nove~~}.' },
  { nazev: 'tabulka a seznam v jedné sekci',
    telo: '# Prvni\n\nKan-1.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n- x\n- y\n\n## Druha\n\nKan-2.' },
  { nazev: 'velmi dlouhý řádek',
    telo: '# Prvni\n\nKan-1 ' + 'dlouhy '.repeat(400) + 'konec.\n\n## Druha\n\nKan-2.' },
  { nazev: 'diakritika a emoji',
    telo: '# Příliš žluťoučký kůň 🐴\n\nKan-1 ěščřžýáíé.\n\n## Druhá 🎯\n\nKan-2 ÚŮŇŤĎ.' },
  { nazev: 'zaškrtnuté úkoly ve víc sekcích',
    telo: '# Prvni\n\nKan-1.\n\n- [x] hotovy A\n- [ ] nehotovy A\n\n## Druha\n\nKan-2.\n\n- [x] hotovy B\n- [ ] nehotovy B' }
];

function kanarci(text) {
  return (text.match(/Kan-[A-ZÁ-Ž0-9]+/g) || []).sort();
}

for (const pripad of PRIPADY) {
  nadpis(pripad.nazev);
  const ocekavani = kanarci(pripad.telo);

  // kolik sekcí aplikace v textu vidí
  const pocetSekci = await stranka.evaluate((t) => extractSectionsFlat(t).length, pripad.telo);

  let vsePrezilo = true;
  let detail = null;
  for (let i = 0; i < pocetSekci; i++) {
    await nasypej(stranka, [{ id: 'o1', title: 'Odolnost', aspects: ['Note'], body: pripad.telo }]);
    await otevriDetail(stranka, 'o1', 'read');
    await zapniEditaciSekci(stranka);
    await otevriSekci(stranka, 'o1', i);
    const otevren = await stranka.evaluate(() => !!document.getElementById('sec-edit-ta'));
    if (!otevren) continue;   // sekce bez odpovídajícího nadpisu v HTML – nic neukládáme
    await stranka.click('#sec-edit-save');
    await stranka.waitForTimeout(500);
    const po = (await telo(stranka, 'o1')) || '';
    const chybi = ocekavani.filter(k => !po.includes(k));
    if (chybi.length) {
      vsePrezilo = false;
      detail = { sekce: i, chybi, telo: po.slice(0, 220) };
      break;
    }
  }
  ok(s, vsePrezilo,
    'uložení každé z ' + pocetSekci + ' sekcí beze změny nic neztratí', detail || undefined);
}

// ============================================================
nadpis('Sekce beze změny — kolik textu se uložením posune');
// ============================================================
// Uložení sekce normalizuje prázdné řádky. To je v pořádku, ale nesmí to nic ubrat:
// porovnáváme text po odstranění bílých znaků.
const TELO_N = '# A\n\nKan-1.\n\n\n\n## B\n\nKan-2.\n\n## C\n\nKan-3.\n';
await nasypej(stranka, [{ id: 'n1', title: 'Normalizace', aspects: ['Note'], body: TELO_N }]);
await otevriDetail(stranka, 'n1', 'read');
await zapniEditaciSekci(stranka);
await otevriSekci(stranka, 'n1', 1);
await stranka.click('#sec-edit-save');
await stranka.waitForTimeout(600);
const poN = await telo(stranka, 'n1');
const bezBilych = (t) => (t || '').replace(/\s+/g, '');
ok(s, bezBilych(poN) === bezBilych(TELO_N),
  'uložení beze změny nezmění nic než prázdné řádky', { pred: TELO_N, po: poN });

// ============================================================
nadpis('Prázdné a degenerované tělo');
// ============================================================
for (const [popis, t] of [['prázdné tělo', ''], ['jen mezery', '   \n  \n'],
                          ['jen nadpis', '# Samotny nadpis'], ['bez nadpisu', 'Kan-1 jen text.']]) {
  await nasypej(stranka, [{ id: 'p1', title: 'Degenerovane', aspects: ['Note'], body: t }]);
  await otevriDetail(stranka, 'p1', 'read');
  await zapniEditaciSekci(stranka);
  const spadlo = s.chyby.length;
  await otevriSekci(stranka, 'p1', 0);
  await stranka.waitForTimeout(300);
  ok(s, s.chyby.length === spadlo, popis + ' — editaci sekcí nerozhodí');
}

// ============================================================
nadpis('Windows konce řádků');
// ============================================================
const TELO_CRLF = '# Prvni\r\n\r\nKan-1.\r\n\r\n## Druha\r\n\r\nKan-2.';
// Takhle přijdou data z importu / GitHubu – aplikace je má srovnat na '\n'.
await stranka.evaluate((telo) => {
  db.entities = [newEntity({ id: 'w1', title: 'CRLF', aspects: ['Note'], body: telo })];
  normalizujKonceRadkuVDb();
  state.view = 'dashboard'; render();
}, TELO_CRLF);
await stranka.waitForTimeout(400);
ok(s, !((await telo(stranka, 'w1')) || '').includes('\r'), 'normalizace srovná konce řádků');
await otevriDetail(stranka, 'w1', 'read');
await zapniEditaciSekci(stranka);
await otevriSekci(stranka, 'w1', 0);
if (await stranka.evaluate(() => !!document.getElementById('sec-edit-ta'))) {
  await stranka.click('#sec-edit-save');
  await stranka.waitForTimeout(600);
  const poW = (await telo(stranka, 'w1')) || '';
  ok(s, poW.includes('Kan-1') && poW.includes('Kan-2'), 'CRLF tělo přežije uložení sekce', poW.slice(0, 120));
  ok(s, poW.includes('# Prvni') && poW.includes('## Druha'), 'a nadpisy zůstaly nadpisy', poW.slice(0, 120));
} else {
  ok(s, false, 'sekce se v CRLF těle vůbec neotevřela');
}

await prohlizec.close();
process.exit(uzavri(s));
