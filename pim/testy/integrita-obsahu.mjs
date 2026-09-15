// INTEGRITA OBSAHU — hlavní pojistka proti tichému přepsání textu.
//
// Proč existuje: v aplikaci se stalo, že nástroj otevřený nad výřezem textu
// (editor sekce) uložil ten výřez do celého těla entity a zbytek beze slova zmizel.
// Tenhle test jde po celé té třídě chyb systematicky: každá entita má v každé sekci
// vlastní „kanárka" a po KAŽDÉ operaci se ověřuje, že kanárci, kterých se operace
// neměla dotknout, pořád žijí. Když někdo v budoucnu napíše `entity.body = vyrez`,
// spadne to tady.
//
// Druhá pojistka: „Zrušit" nesmí změnit ani bajt. Třetí: žádná chyba na stránce.
import {
  novySoucet, ok, nadpis, otevriAplikaci, nasypej, telo, atribut, hodnotaPole,
  otevriDetail, zapniEditaciSekci, otevriSekci, odpovidejNaPotvrzeni, uzavri
} from './lib.mjs';

const s = novySoucet('Integrita obsahu');
const { prohlizec, stranka } = await otevriAplikaci(s);

const TELO = [
  '# Sekce A', '', 'Kanarek-A. Text s {++revizi-A++} uvnitr.', '',
  '- [x] Hotovy-A', '- [ ] Nehotovy-A', '',
  '## Sekce B', '', 'Kanarek-B.', '',
  '| sloupec | hodnota |', '|---|---|', '| radek | 1 |', '',
  '## Sekce C', '', 'Kanarek-C.', '', '- polozka C1', '- polozka C2', '',
  '## Sekce D', '', 'Kanarek-D na konci.'
].join('\n');

const KANARCI = ['Kanarek-A', 'Kanarek-B', 'Kanarek-C', 'Kanarek-D'];

async function priprav(rezim = 'read', sekce = null) {
  await nasypej(stranka, [
    { id: 'e1', title: 'Kanarkova entita', aspects: ['Project'], body: TELO,
      attributes: { goal: 'Kanarek-ATTR. Text s {++revizi-ATTR++}.' } }
  ]);
  await otevriDetail(stranka, 'e1', rezim);
  if (sekce !== null) { await zapniEditaciSekci(stranka); await otevriSekci(stranka, 'e1', sekce); }
}

// Jádro testu: po operaci musí žít všichni kanárci kromě těch vyjmenovaných.
async function kanarciZiji(popis, smiChybet = []) {
  const t = (await telo(stranka, 'e1')) || '';
  const mrtvi = KANARCI.filter(k => !t.includes(k) && !smiChybet.includes(k));
  ok(s, mrtvi.length === 0, popis, mrtvi.length ? { mrtvi, telo: t.slice(0, 200) } : undefined);
}

async function teloBezeZmeny(popis) {
  const t = await telo(stranka, 'e1');
  ok(s, t === TELO, popis, t === TELO ? undefined : { ted: (t || '').slice(0, 160) });
}

// ============================================================
nadpis('EDITOR SEKCE — nástroje nesmí přepsat tělo');
// ============================================================

// 1) Revize: přijmout vše a vrátit se
await priprav('read', 0);
ok(s, await stranka.evaluate(() => !!document.getElementById('sec-edit-ta')), 'editor sekce se otevřel');
await stranka.click('.section-edit-wrapper button.md-revize');
await stranka.waitForTimeout(600);
await stranka.evaluate(() => [...document.querySelectorAll('#cmr-doc button[data-cm-act="accept"]')].forEach(b => b.click()));
await stranka.waitForTimeout(400);
await teloBezeZmeny('revize samy o sobě tělo nemění');
await stranka.click('#cmr-back');
await stranka.waitForTimeout(800);
ok(s, await stranka.evaluate(() => !!state.sectionEditMode && !!document.getElementById('sec-edit-ta')),
  'po „Zpět na úpravy" jsme zpátky v editoru sekce');
ok(s, !(await hodnotaPole(stranka, '#sec-edit-ta')).includes('{++'), 'přijatá revize je v poli sekce');
await teloBezeZmeny('a do těla se zatím nic nezapsalo');
await stranka.click('#sec-edit-save');
await stranka.waitForTimeout(900);
await kanarciZiji('po uložení sekce žijí všichni kanárci');
const poRevizi = await telo(stranka, 'e1');
ok(s, !poRevizi.includes('{++') && poRevizi.includes('revizi-A'), 'přijatá revize je v těle');

// 2) Revize: návrat bez uložení
await priprav('read', 0);
await stranka.click('.section-edit-wrapper button.md-revize');
await stranka.waitForTimeout(600);
await stranka.evaluate(() => [...document.querySelectorAll('#cmr-doc button[data-cm-act="accept"]')].forEach(b => b.click()));
await stranka.waitForTimeout(300);
await stranka.evaluate(() => closeCmReview(false));
await stranka.waitForTimeout(800);
await teloBezeZmeny('návrat z revizí bez uložení tělo nezmění');
ok(s, (await hodnotaPole(stranka, '#sec-edit-ta') || '').includes('{++'), 'a sekce se otevře s původním zdrojem');

// 3) Korektor
await priprav('read', 1);
await stranka.evaluate(() => openSpellCheck(findEntity('e1'), 'sec-edit-ta', 'body', 'sekce'));
await stranka.waitForTimeout(700);
ok(s, await stranka.evaluate(() => !!state.spellCheck), 'korektor se nad sekcí otevřel');
await stranka.evaluate(() => closeSpellCheck(true));
await stranka.waitForTimeout(800);
await teloBezeZmeny('korektor nad sekcí tělo sám nepřepíše');
ok(s, await stranka.evaluate(() => !!document.getElementById('sec-edit-ta')), 'a vrátí nás do editoru sekce');

// 4) Lint se v sekci vůbec nenabízí
await priprav('read', 2);
ok(s, await stranka.evaluate(() => !document.querySelector('.section-edit-wrapper button.md-lint')),
  'Lint není v editoru sekce nabízený (nad výřezem nedává smysl)');
// a i kdyby ho něco zavolalo přímo, tělo nesmí přepsat
await stranka.evaluate(() => openMdLint(findEntity('e1'), 'sec-edit-ta', 'body', 'sekce'));
await stranka.waitForTimeout(700);
if (await stranka.evaluate(() => !!document.getElementById('lint-save'))) {
  await stranka.click('#lint-save');
  await stranka.waitForTimeout(800);
  await teloBezeZmeny('ani přímé volání lintu nad sekcí tělo nepřepíše');
} else {
  ok(s, true, 'lint nad sekcí se ani neotevře');
}

// 5) Zrušení editoru sekce
await priprav('read', 1);
await stranka.evaluate(() => { const t = document.getElementById('sec-edit-ta'); t.value = 'ZNICENO'; t.dispatchEvent(new Event('input', { bubbles: true })); });
await stranka.click('#sec-edit-cancel');
await stranka.waitForTimeout(700);
await teloBezeZmeny('„Zrušit" v editoru sekce nezmění ani bajt');

// 6) Uložení sekce mění JEN tu sekci
await priprav('read', 2);
await stranka.evaluate(() => { const t = document.getElementById('sec-edit-ta');
  t.value = '## Sekce C\n\nKanarek-C prepsany.'; t.dispatchEvent(new Event('input', { bubbles: true })); });
await stranka.click('#sec-edit-save');
await stranka.waitForTimeout(900);
const poC = await telo(stranka, 'e1');
ok(s, poC.includes('Kanarek-A') && poC.includes('Kanarek-B') && poC.includes('Kanarek-D'),
  'uložení sekce C nechalo sekce A, B i D na pokoji', poC.slice(0, 200));
ok(s, poC.includes('Kanarek-C prepsany') && !poC.includes('polozka C1'),
  'a sekci C opravdu přepsalo');

// ============================================================
nadpis('EDITOR SEKCE — Smazat hotové úkoly');
// ============================================================
await priprav('read', 0);
const tlacitkoSmazat = await stranka.evaluate(() => {
  const b = document.querySelector('.section-edit-wrapper button.md-del-done-tasks');
  return b ? b.textContent : null;
});
ok(s, !!tlacitkoSmazat && /\(1\)/.test(tlacitkoSmazat), 'tlačítko hlásí správný počet hotových úkolů v sekci', tlacitkoSmazat);

// storno v potvrzení nesmí nic smazat
await odpovidejNaPotvrzeni(stranka, false);
await stranka.click('.section-edit-wrapper button.md-del-done-tasks');
await stranka.waitForTimeout(500);
ok(s, (await hodnotaPole(stranka, '#sec-edit-ta') || '').includes('[x] Hotovy-A'),
  'odmítnutí potvrzení hotové úkoly nesmaže');

// potvrzení smaže
await odpovidejNaPotvrzeni(stranka, true);
await stranka.click('.section-edit-wrapper button.md-del-done-tasks');
await stranka.waitForTimeout(500);
const poSmazani = await hodnotaPole(stranka, '#sec-edit-ta') || '';
ok(s, !poSmazani.includes('[x] Hotovy-A') && poSmazani.includes('Nehotovy-A'),
  'po potvrzení zmizí hotový a nehotový zůstane');
ok(s, await stranka.evaluate(() => !document.querySelector('.section-edit-wrapper button.md-del-done-tasks')),
  'a tlačítko zmizí, protože už není co mazat (lišta se přepočítá)');
await teloBezeZmeny('smazání hotových v sekci samo o sobě tělo nemění');

// ============================================================
nadpis('CELÉ TĚLO — nástroje ukládají tam, kam mají');
// ============================================================
await priprav('edit');
await stranka.evaluate(() => openCmReview(findEntity('e1'), 'd-body', 'body', 'Tělo entity'));
await stranka.waitForTimeout(600);
await stranka.evaluate(() => [...document.querySelectorAll('#cmr-doc button[data-cm-act="accept"]')].forEach(b => b.click()));
await stranka.waitForTimeout(300);
await stranka.click('#cmr-back');
await stranka.waitForTimeout(800);
const dBody = await hodnotaPole(stranka, '#d-body');
ok(s, dBody && !dBody.includes('{++'), 'revize nad celým tělem se vrátí do d-body');
ok(s, dBody && KANARCI.every(k => dBody.includes(k)), 'a všichni kanárci jsou v poli');
ok(s, await stranka.evaluate(() => state.detailMode === 'edit' && !state.sectionEditMode),
  'nespustí se přitom editace sekcí');

// Lint nad celým tělem ukládat smí
await priprav('edit');
await stranka.evaluate(() => openMdLint(findEntity('e1'), 'd-body', 'body', 'Tělo entity'));
await stranka.waitForTimeout(700);
ok(s, await stranka.evaluate(() => !!document.getElementById('lint-save')), 'lint nad celým tělem se otevře');
await stranka.evaluate(() => { state.mdLint.workingText = state.mdLint.workingText + '\n\nKanarek-E pridany.'; render(); });
await stranka.waitForTimeout(400);
await stranka.click('#lint-save');
await stranka.waitForTimeout(800);
await kanarciZiji('lint nad celým tělem nikoho nezabil');
ok(s, (await telo(stranka, 'e1')).includes('Kanarek-E pridany'), 'a uložil, co měl');

// Lint zrušení
await priprav('edit');
await stranka.evaluate(() => openMdLint(findEntity('e1'), 'd-body', 'body', 'Tělo entity'));
await stranka.waitForTimeout(600);
await stranka.evaluate(() => { state.mdLint.workingText = 'ZNICENO'; render(); });
await stranka.waitForTimeout(300);
await stranka.click('#lint-cancel');
await stranka.waitForTimeout(700);
await teloBezeZmeny('zrušení lintu tělo nezmění');

// ============================================================
nadpis('MARKDOWNOVÝ ATRIBUT — nesmí přepsat tělo a naopak');
// ============================================================
await priprav('edit');
const poleAtributu = await stranka.evaluate(() => {
  const ta = [...document.querySelectorAll('textarea')].find(t => (t.value || '').includes('Kanarek-ATTR'));
  return ta ? ta.id : null;
});
if (poleAtributu) {
  await stranka.evaluate((id) => openCmReview(findEntity('e1'), id, 'goal', 'Cíl'), poleAtributu);
  await stranka.waitForTimeout(600);
  await stranka.evaluate(() => [...document.querySelectorAll('#cmr-doc button[data-cm-act="accept"]')].forEach(b => b.click()));
  await stranka.waitForTimeout(300);
  await stranka.click('#cmr-back');
  await stranka.waitForTimeout(800);
  await kanarciZiji('revize nad atributem nesáhla na tělo');
  ok(s, (await telo(stranka, 'e1')).includes('{++revizi-A++}'), 'tělo si nechalo vlastní revizi');
} else {
  ok(s, false, 'nenašel jsem textareu markdownového atributu');
}

// ============================================================
nadpis('OPAKOVÁNÍ — stejná operace dvakrát po sobě');
// ============================================================
// Regresní past: stav zapamatovaný z prvního průchodu nesmí rozbít druhý.
await priprav('read', 0);
for (let i = 0; i < 2; i++) {
  await stranka.click('.section-edit-wrapper button.md-revize');
  await stranka.waitForTimeout(600);
  await stranka.click('#cmr-back');
  await stranka.waitForTimeout(700);
}
ok(s, await stranka.evaluate(() => !!document.getElementById('sec-edit-ta')),
  'dvě kola revizí po sobě a editor sekce pořád stojí');
await teloBezeZmeny('a tělo je beze změny');

// Přepnutí na jinou entitu uprostřed nesmí nechat viset stav sekce
await priprav('read', 1);
await stranka.evaluate(() => {
  db.entities.push(newEntity({ id: 'e2', title: 'Druha', aspects: ['Note'], body: '# Jina\n\nJiny text.' }));
  setView('detail', { detailId: 'e2' });
});
await stranka.waitForTimeout(700);
ok(s, await stranka.evaluate(() => state._secEditIdx == null && !state.sectionEditMode),
  'odchod na jinou entitu zahodí rozdělanou sekci');
await stranka.evaluate(() => setView('detail', { detailId: 'e1' }));
await stranka.waitForTimeout(600);
await teloBezeZmeny('a původní entita je nedotčená');

await prohlizec.close();
process.exit(uzavri(s));
