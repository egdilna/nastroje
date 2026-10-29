// PŘÍZNAK A STAV ROVNOU V TABULCE PLÁNU.
//
// V editoru WBS tabulky se se dvěma věcmi pracuje pořád: s příznakovým emoji
// na začátku názvu úkolu a se stavem. Obojí se dřív dalo změnit jen dialogem
// „Upravit úkol", což je na jedno kliknutí zbytečně dlouhá cesta.
//
// Hlídá se: tlačítko příznaku před názvem (přidat / změnit / odebrat), že se
// emoji v řádku neukazuje dvakrát, select stavu (u rodiče zamčený, protože se
// jeho stav počítá z podúkolů), vrácení fokusu po překreslení, že režim čtení
// zůstal beze změny — a kanárci na okolní data.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const s = novySoucet('Příznak a stav v tabulce plánu');
const { prohlizec, stranka } = await otevriAplikaci(s);

async function pripravDb() {
  await stranka.evaluate(() => {
    db.flagEmojis = ['🔴', '⚠️', '⭐'];
    const ukol = (id, title, level, status) => ({
      id: id, title: title, level: level, start: '2026-01-01', duration: 1,
      end: '2026-01-01', status: status, description: '', predecessorId: null,
      collapsed: false, linkedEntities: []
    });
    db.entities = [
      newEntity({ id: 'pl', title: 'Plán stavby', aspects: ['Plan'], attributes: { tasks: [
        ukol('t1', 'Etapa A', 0, 'Nezahájeno'),
        ukol('t2', 'Zajistit smlouvu', 1, 'Nezahájeno'),
        ukol('t3', '⚠️ Už s příznakem', 1, 'Nezahájeno'),
        ukol('t4', 'KANÁREK-ÚKOL', 0, 'Splněno')
      ] } }),
      newEntity({ id: 'kan', title: 'KANÁREK-POZNÁMKA', aspects: ['Note'], body: 'KANAREK-BODY 🔴' })
    ];
    state.planEdit = { entityId: 'pl' };
    state.view = 'detail'; state.detailId = 'pl';
    render();
  });
  await stranka.waitForTimeout(400);
}
const kanarci = () => stranka.evaluate(() => {
  const t = planGetTasks(findEntity('pl')).find(x => x.id === 't4');
  return findEntity('kan').body + '||' + t.title + '|' + t.status;
});
const KANARCI = 'KANAREK-BODY 🔴||KANÁREK-ÚKOL|Splněno';

const radky = () => stranka.evaluate(() => [...document.querySelectorAll('tr.plan-row')].map(tr => {
  const btn = tr.querySelector('button[data-plan-priznak]');
  const sel = tr.querySelector('select[data-plan-status]');
  return {
    wbs: tr.querySelector('.plan-wbs').textContent,
    text: tr.querySelector('.plan-title').textContent.trim(),
    btn: btn ? btn.textContent : null,
    aria: btn ? btn.getAttribute('aria-label') : null,
    stav: sel ? sel.value : null,
    zamceny: sel ? sel.disabled : null
  };
}));

await pripravDb();

nadpis('Tlačítko příznaku je před názvem a emoji je v řádku jen jednou');
let r = await radky();
ok(s, r.length === 4, 'editor vypsal všechny úkoly', r.length);
ok(s, r[1].btn === '🏳️' && /Zajistit smlouvu/.test(r[1].text) && r[1].text.indexOf('⚠') < 0,
  'úkol bez příznaku má na tlačítku prázdnou vlaječku', r[1]);
ok(s, r[1].aria === 'Zajistit smlouvu – bez příznaku, přidat',
  'a přístupný název začíná názvem úkolu, ne značkou', r[1].aria);
ok(s, r[2].btn === '⚠️',
  'u úkolu s příznakem je na tlačítku jeho emoji', r[2]);
ok(s, (r[2].text.match(/⚠/g) || []).length === 1,
  'emoji je v řádku **jednou** — z názvu se vyjme a ukáže na tlačítku', r[2].text);
ok(s, r[2].aria === 'Už s příznakem – příznak ⚠️, změnit nebo odebrat',
  'přístupný název říká, co tlačítko udělá', r[2].aria);
ok(s, await stranka.evaluate(() => {
  const t = planGetTasks(findEntity('pl')).find(x => x.id === 't3');
  return t.title === '⚠️ Už s příznakem';
}), 'do dat se při vykreslení nesáhlo — příznak zůstal v názvu');

nadpis('Přidání příznaku u úkolu, který ho nemá');
await stranka.click('button[data-plan-priznak="1"]');
await stranka.waitForTimeout(200);
const dlg = await stranka.evaluate(() => {
  const d = document.querySelector('dialog.flag-change-dialog');
  if (!d) return null;
  return {
    otevren: !!d.open,
    titul: d.querySelector('h2').textContent,
    popis: d.querySelector('p') ? d.querySelector('p').textContent : '',
    volby: [...d.querySelectorAll('.flag-change-pick')].map(b => b.textContent),
    maOdebrat: !!d.querySelector('#flag-pick-off'),
    fokusVDialogu: d.contains(document.activeElement)
  };
});
ok(s, dlg && dlg.otevren, 'tlačítko otevřelo výběr příznaku', dlg);
ok(s, dlg && dlg.titul === 'Přidat příznak úkolu', 'titulek odpovídá tomu, že příznak zatím není', dlg);
ok(s, dlg && dlg.volby.join('') === '🔴⚠️⭐',
  'nabídka je celý seznam z db.flagEmojis, v jeho pořadí', dlg && dlg.volby);
ok(s, dlg && dlg.maOdebrat === false,
  '„Bez příznaku" se nenabízí, když žádný příznak není', dlg);
ok(s, dlg && dlg.fokusVDialogu, 'fokus je po otevření v dialogu', dlg);
ok(s, dlg && /Zajistit smlouvu/.test(dlg.popis), 'dialog říká, do kterého názvu se zapíše', dlg && dlg.popis);

await stranka.click('dialog.flag-change-dialog .flag-change-pick[data-em="🔴"]');
await stranka.waitForTimeout(300);
const poPridani = await stranka.evaluate(() => ({
  nazvy: planGetTasks(findEntity('pl')).map(t => t.title),
  fokus: document.activeElement ? document.activeElement.getAttribute('data-plan-priznak') : null,
  dialogZbyl: !!document.querySelector('dialog.flag-change-dialog')
}));
ok(s, poPridani.nazvy[1] === '🔴 Zajistit smlouvu',
  'emoji se zapsalo na začátek názvu, mezerou oddělené', poPridani.nazvy);
ok(s, poPridani.nazvy[2] === '⚠️ Už s příznakem' && poPridani.nazvy[0] === 'Etapa A',
  'ostatní názvy se nezměnily', poPridani.nazvy);
ok(s, poPridani.fokus === '1',
  'po překreslení se fokus vrátil na totéž tlačítko — jinak spadne na <body>', poPridani);
ok(s, !poPridani.dialogZbyl, 'dialog se zavřel a odstranil z DOM');
r = await radky();
ok(s, r[1].btn === '🔴' && (r[1].text.match(/🔴/g) || []).length === 1,
  'řádek teď ukazuje příznak na tlačítku a jen jednou', r[1]);

nadpis('Změna a odebrání u úkolu, který příznak má');
await stranka.click('button[data-plan-priznak="2"]');
await stranka.waitForTimeout(200);
const dlg2 = await stranka.evaluate(() => {
  const d = document.querySelector('dialog.flag-change-dialog');
  return {
    titul: d.querySelector('h2').textContent,
    maOdebrat: !!d.querySelector('#flag-pick-off'),
    stisknute: [...d.querySelectorAll('.flag-change-pick')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent),
    volby: [...d.querySelectorAll('.flag-change-pick')].map(b => b.textContent)
  };
});
ok(s, dlg2.titul === 'Změnit příznak úkolu', 'titulek odpovídá tomu, že příznak už je', dlg2);
ok(s, dlg2.maOdebrat, 'a nabízí se „Bez příznaku"', dlg2);
ok(s, dlg2.stisknute.join('') === '⚠️',
  'nastavený příznak je v nabídce označený (aria-pressed), ne vynechaný', dlg2);
await stranka.click('dialog.flag-change-dialog .flag-change-pick[data-em="⭐"]');
await stranka.waitForTimeout(300);
ok(s, (await stranka.evaluate(() => planGetTasks(findEntity('pl'))[2].title)) === '⭐ Už s příznakem',
  'výběr jiného emoji starý příznak nahradil, nepřidal se druhý',
  await stranka.evaluate(() => planGetTasks(findEntity('pl'))[2].title));

await stranka.click('button[data-plan-priznak="2"]');
await stranka.waitForTimeout(200);
await stranka.click('dialog.flag-change-dialog #flag-pick-off');
await stranka.waitForTimeout(300);
ok(s, (await stranka.evaluate(() => planGetTasks(findEntity('pl'))[2].title)) === 'Už s příznakem',
  '„Bez příznaku" odebral emoji i mezeru za ním',
  await stranka.evaluate(() => planGetTasks(findEntity('pl'))[2].title));

nadpis('Zrušení nic nezmění');
const predZrusenim = await stranka.evaluate(() => planGetTasks(findEntity('pl')).map(t => t.title).join('|'));
await stranka.click('button[data-plan-priznak="1"]');
await stranka.waitForTimeout(200);
await stranka.click('dialog.flag-change-dialog #flag-pick-cancel');
await stranka.waitForTimeout(200);
ok(s, (await stranka.evaluate(() => planGetTasks(findEntity('pl')).map(t => t.title).join('|'))) === predZrusenim,
  'Zrušit nechá názvy, jak byly');
ok(s, (await stranka.evaluate(() => document.activeElement ? document.activeElement.getAttribute('data-plan-priznak') : null)) === '1',
  'a fokus se vrátí na tlačítko, ze kterého se dialog otevřel');

nadpis('Select stavu: jeden zdroj nabídky, u rodiče zamčený');
const stavy = await stranka.evaluate(() => {
  const sel = document.querySelector('select[data-plan-status="1"]');
  return {
    volby: [...sel.options].map(o => o.value),
    zdroj: PLAN_STATUSES.slice(),
    rodicZamceny: document.querySelector('select[data-plan-status="0"]').disabled,
    rodicTitle: document.querySelector('select[data-plan-status="0"]').title,
    potomekZamceny: sel.disabled
  };
});
ok(s, stavy.volby.join('|') === stavy.zdroj.join('|'),
  'nabídka je přesně PLAN_STATUSES — žádná druhá kopie seznamu', stavy);
ok(s, stavy.rodicZamceny && !stavy.potomekZamceny,
  'u rodiče je select zamčený, u listu ne', stavy);
ok(s, /podúkol/.test(stavy.rodicTitle),
  'a je u něj napsané proč — stav rodiče se počítá z podúkolů', stavy.rodicTitle);

await stranka.selectOption('select[data-plan-status="1"]', 'Probíhá');
await stranka.waitForTimeout(300);
const poStavu = await stranka.evaluate(() => ({
  stavy: planGetTasks(findEntity('pl')).map(t => t.status),
  fokus: document.activeElement ? document.activeElement.getAttribute('data-plan-status') : null,
  trida: document.querySelector('select[data-plan-status="1"]').className,
  tridaRodice: document.querySelector('select[data-plan-status="0"]').className,
  souhrn: document.querySelector('.cr-stats').textContent
}));
ok(s, poStavu.stavy[1] === 'Probíhá', 'stav úkolu se uložil', poStavu.stavy);
ok(s, poStavu.stavy[0] === 'Probíhá',
  'a rodič se přepočítal hned, ne až při příštím překreslení', poStavu.stavy);
ok(s, /plan-st-probiha/.test(poStavu.trida) && /plan-st-probiha/.test(poStavu.tridaRodice),
  'barva selectu odpovídá stavu (tytéž třídy jako chip)', poStavu);
ok(s, poStavu.fokus === '1',
  'fokus zůstal na selectu, se kterým uživatel pracoval', poStavu);
ok(s, /4 úkolů, 1 splněno/.test(poStavu.souhrn),
  'souhrn nad tabulkou se překreslil', poStavu.souhrn);

nadpis('Neznámý stav ze starších dat se nepřepíše tím, že není v nabídce');
await stranka.evaluate(() => {
  planGetTasks(findEntity('pl'))[1].status = 'Vlastní stav';
  render();
});
await stranka.waitForTimeout(250);
const neznamy = await stranka.evaluate(() => {
  const sel = document.querySelector('select[data-plan-status="1"]');
  return { hodnota: sel.value, volby: [...sel.options].map(o => o.value) };
});
ok(s, neznamy.hodnota === 'Vlastní stav' && neznamy.volby.indexOf('Vlastní stav') >= 0,
  'neznámý stav je v nabídce navíc a zůstává vybraný', neznamy);
await stranka.evaluate(() => { planGetTasks(findEntity('pl'))[1].status = 'Probíhá'; render(); });
await stranka.waitForTimeout(200);

nadpis('Režim čtení zůstal beze změny');
const cteni = await stranka.evaluate(() => {
  state.planEdit = null; render();
  return {
    selecty: document.querySelectorAll('select[data-plan-status]').length,
    tlacitka: document.querySelectorAll('button[data-plan-priznak]').length,
    chipy: document.querySelectorAll('.plan-status-chip').length,
    nazvy: [...document.querySelectorAll('tr.plan-row .plan-title')].map(td => td.textContent.trim())
  };
});
ok(s, cteni.selecty === 0 && cteni.tlacitka === 0,
  'v detailu entity (čtení) žádné editační prvky nepřibyly', cteni);
ok(s, cteni.chipy === 4, 'stav se tam pořád ukazuje jako chip', cteni);
ok(s, cteni.nazvy.some(n => /🔴 Zajistit smlouvu/.test(n)),
  'příznak je vidět v názvu, protože v něm je zapsaný', cteni.nazvy);

nadpis('Bez definovaných příznaků není co nabízet');
await stranka.evaluate(() => {
  db.flagEmojis = [];
  state.planEdit = { entityId: 'pl' };
  render();
});
await stranka.waitForTimeout(250);
const bezPriznaku = await stranka.evaluate(() => ({
  tlacitka: document.querySelectorAll('button[data-plan-priznak]').length,
  selecty: document.querySelectorAll('select[data-plan-status]').length,
  nazev: document.querySelectorAll('tr.plan-row .plan-title')[1].textContent.trim()
}));
ok(s, bezPriznaku.tlacitka === 0,
  'tlačítko příznaku se nevykreslí, dokud nejsou emoji v Nastavení', bezPriznaku);
ok(s, bezPriznaku.selecty === 4, 'select stavu tím ale nezmizí', bezPriznaku);
ok(s, bezPriznaku.nazev === '🔴 Zajistit smlouvu',
  'a název se vypíše celý, včetně emoji, které už příznakem není', bezPriznaku);

nadpis('Funkce samy o sobě');
const fn = await stranka.evaluate(() => {
  const sez = ['🔴', '⚠️', '⭐'];
  const naj = (x) => { const r = planPriznakNazvu(x, sez); return r ? r.emoji + '|' + r.delka : null; };
  return {
    bez: naj('Zajistit smlouvu'),
    sMezerou: naj('🔴 Zajistit'),
    bezMezery: naj('🔴Zajistit'),
    // VS16 navíc v názvu proti seznamu i naopak
    vsVNazvu: naj('⭐️ Hvězda'),
    vsVSeznamu: naj('⚠ Pozor'),
    uprostred: naj('Něco 🔴 uprostřed'),
    delsiSekvence: naj('⭐‍🔥 slitek'),
    prazdne: naj(''),
    nullVstup: planPriznakNazvu(null, sez),
    pridej: planNazevSPriznakem('Zajistit', '🔴', sez),
    zmen: planNazevSPriznakem('🔴 Zajistit', '⭐', sez),
    odeber: planNazevSPriznakem('🔴 Zajistit', '', sez),
    odeberBezMezery: planNazevSPriznakem('🔴Zajistit', '', sez),
    odeberNic: planNazevSPriznakem('Zajistit', '', sez)
  };
});
ok(s, fn.bez === null && fn.uprostred === null,
  'příznak se poznává jen na začátku názvu, ne uprostřed', fn);
ok(s, fn.sMezerou === '🔴|3' && fn.bezMezery === '🔴|2',
  'délka se počítá podle názvu, včetně mezery za emoji', fn);
ok(s, fn.vsVNazvu === '⭐|3' && fn.vsVSeznamu === '⚠️|2',
  'VS16 navíc na jedné straně nerozhodí ani shodu, ani délku', fn);
ok(s, fn.delsiSekvence === null,
  'delší emoji sekvence (ZWJ) není ten příznak, kterým začíná', fn);
ok(s, fn.prazdne === null && fn.nullVstup === null,
  'prázdný název ani null funkci nerozhodí', fn);
ok(s, fn.pridej === '🔴 Zajistit' && fn.zmen === '⭐ Zajistit',
  'přidání i změna dají jeden příznak a mezeru', fn);
ok(s, fn.odeber === 'Zajistit' && fn.odeberBezMezery === 'Zajistit' && fn.odeberNic === 'Zajistit',
  'odebrání nechá čistý název, ať tam příznak byl jakkoli', fn);

nadpis('Příznak v úkolu plánu vidí i pohled Příznaky');
// Příznak nastavený v tabulce plánu je příznak jako každý jiný — pohled, jehož
// jediná práce je „kde mám příznaky", o něm musí vědět. Úkoly plánu se přitom
// adresují **id úkolu**, ne řádkem a sloupcem jako tělo entity, protože se
// jejich pořadí v plánu posouvá.
await pripravDb();
await stranka.evaluate(() => {
  planGetTasks(findEntity('pl'))[1].title = '🔴 Zajistit smlouvu';
  state.planEdit = null;
  setView('detail', { detailId: 'pl', detailMode: 'read' });
});
await stranka.waitForTimeout(450);
const sekce = await stranka.evaluate(() => {
  const sec = document.getElementById('entity-flags-section');
  if (!sec) return null;
  const btn = sec.querySelector('.flag-change-btn');
  return {
    summary: sec.querySelector('summary').textContent,
    polozka: sec.querySelector('.flag-item').textContent.replace(/\s+/g, ' ').trim(),
    taskId: btn ? btn.dataset.flagTask : null,
    src: btn ? btn.dataset.flagSrc : null
  };
});
ok(s, sekce !== null, 'detail plánu má sekci Příznaky', sekce);
ok(s, sekce && /Příznaky \(2\)/.test(sekce.summary),
  'a počítá oba výskyty v úkolech plánu (🔴 i ⚠️)', sekce);
ok(s, sekce && /Úkol plánu 1\.1/.test(sekce.polozka),
  'výskyt je popsaný svým číslem WBS, ne jako „odstavec"', sekce && sekce.polozka);
ok(s, sekce && sekce.src === 'plan' && sekce.taskId === 't2',
  'tlačítka nesou id úkolu — pořadí v plánu se posouvá, id ne', sekce);

const prehled = await stranka.evaluate(() => {
  setView('flags');
  return document.getElementById('main').textContent.replace(/\s+/g, ' ');
});
ok(s, /Plán stavby/.test(prehled),
  'pohled Příznaky plán vypisuje — dřív o příznacích v úkolech nevěděl', prehled.slice(0, 220));
ok(s, /KANÁREK-POZNÁMKA/.test(prehled),
  'a entity s příznakem v těle v něm zůstaly', prehled.slice(0, 220));

await stranka.evaluate(() => setView('detail', { detailId: 'pl', detailMode: 'read' }));
await stranka.waitForTimeout(400);
await stranka.click('#entity-flags-section .flag-change-btn');
await stranka.waitForTimeout(250);
await stranka.click('dialog.flag-change-dialog .flag-change-pick[data-em="⭐"]');
await stranka.waitForTimeout(400);
ok(s, (await stranka.evaluate(() => planGetTasks(findEntity('pl'))[1].title)) === '⭐ Zajistit smlouvu',
  '🔄 v sekci Příznaky změní emoji i v názvu úkolu plánu',
  await stranka.evaluate(() => planGetTasks(findEntity('pl'))[1].title));
// Tlačítko se vybírá podle id úkolu, ne „první v seznamu": skupiny jsou řazené
// podle db.flagEmojis, takže po změně emoji je první skupinou jiný úkol. Na tom
// se v téhle sadě jednou uklouzlo.
await stranka.click('#entity-flags-section .flag-remove-btn[data-flag-task="t2"]');
await stranka.waitForTimeout(400);
const poOdebrani = await stranka.evaluate(() => ({
  nazvy: planGetTasks(findEntity('pl')).map(t => t.title),
  summary: document.querySelector('#entity-flags-section summary')
    ? document.querySelector('#entity-flags-section summary').textContent : null
}));
ok(s, poOdebrani.nazvy[1] === 'Zajistit smlouvu',
  '✕ ho odtamtud odebere, i s mezerou', poOdebrani);
ok(s, poOdebrani.nazvy[2] === '⚠️ Už s příznakem',
  'a druhého úkolu s příznakem se to nedotklo (kanárek)', poOdebrani);
ok(s, poOdebrani.summary !== null && /Příznaky \(1\)/.test(poOdebrani.summary),
  'v sekci zbyl právě ten jeden', poOdebrani);

nadpis('Kanárci');
ok(s, (await kanarci()) === KANARCI,
  'úkol mimo hru i poznámka s emoji v těle zůstaly nedotčené', await kanarci());

await prohlizec.close();
process.exit(uzavri(s));
