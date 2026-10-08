// Rozpoznání termínu z názvu VŠEMI cestami, kterými jde entitu založit.
//
// Parser sám byl v pořádku, ale některé cesty ho vůbec nevolaly: „+ Nová entita"
// u projektu i u schůzky vytvořila Úkol a termín v názvu nechala být. Tahle sada
// projde každou cestu zvlášť, protože chyba byla právě v tom, že se jedno místo
// opravilo a druhé ne.
import { novySoucet, ok, nadpis, otevriAplikaci, uzavri } from './lib.mjs';

const soucet = novySoucet('Termín z názvu všemi cestami');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

const NAZEV = 'Něco udělat úterý';
const CISTY = 'Něco udělat';
const utery = await stranka.evaluate(() => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  let diff = 2 - d.getDay(); if (diff <= 0) diff += 7;
  d.setDate(d.getDate() + diff);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
});

// Spustí daný kód nad čistou databází a vrátí nově vzniklou entitu.
const cesta = (kod) => stranka.evaluate(async (kod) => {
  db.entities.length = 0;
  db.entities.push(newEntity({ id: 'pa', title: 'Projekt A', aspects: ['Project'] }));
  db.entities.push(newEntity({ id: 'dite', title: 'Část', aspects: ['Note'], links: [{ to: 'pa', type: 'partOf', note: '' }] }));
  db.entities.push(newEntity({ id: 'sch', title: 'Porada', aspects: ['Event'],
    attributes: { start: '2026-11-01T09:00' } }));
  try { await eval('(async()=>{' + kod + '})()'); } catch (e) { return { chyba: String(e.message) }; }
  await new Promise(z => setTimeout(z, 500));
  const n = db.entities.find(x => ['pa', 'dite', 'sch'].indexOf(x.id) < 0);
  if (!n) return { chyba: 'entita nevznikla' };
  return { title: n.title, aspekty: (n.aspects || []).join(','), attr: n.attributes || {} };
}, kod);

async function ukolemVznika(popis, kod) {
  const r = await cesta(kod);
  if (r.chyba) { ok(soucet, false, popis + ': ' + r.chyba); return; }
  ok(soucet, r.attr.deadline === utery,
    popis + ' — termín rozpoznán (' + utery + ')', r);
  ok(soucet, r.title === CISTY,
    popis + ' — datum vyříznuto z názvu', r.title);
}

const OTEVRI_PROJEKT = `setView('detail',{detailId:'pa',detailMode:'read'}); await new Promise(z=>setTimeout(z,700));`;
const OTEVRI_SCHUZKU = `setView('detail',{detailId:'sch',detailMode:'read'}); await new Promise(z=>setTimeout(z,700));
  Array.from(document.querySelectorAll('details')).forEach(d=>{const s=d.querySelector('summary'); if(s&&/Přidat úkol/.test(s.textContent)) d.open=true;});
  await new Promise(z=>setTimeout(z,300));`;

nadpis('Rychlé zakládání úkolu');
await ukolemVznika('Rychlý úkol (nástěnka i dialog)',
  `createQuickTaskFromText({ rawTitle: '${NAZEV}' });`);
await ukolemVznika('Projekt → + Nový úkol',
  OTEVRI_PROJEKT + `document.getElementById('proj-quick-task-title').value='${NAZEV}';
   document.getElementById('proj-quick-task-add').click();`);
await ukolemVznika('Schůzka → ✓ Nový úkol',
  OTEVRI_SCHUZKU + `document.getElementById('ev-new-task-title').value='${NAZEV}';
   document.getElementById('ev-add-new-task').click();`);

nadpis('+ Nová entita s ručně zvoleným aspektem Úkol');
await ukolemVznika('Projekt → + Nová entita (Úkol)',
  OTEVRI_PROJEKT + `document.getElementById('proj-quick-ent-title').value='${NAZEV}';
   document.getElementById('proj-quick-ent-aspect').value='Task';
   document.getElementById('proj-quick-ent-add').click();`);
await ukolemVznika('Schůzka → + Nová entita (Úkol)',
  OTEVRI_SCHUZKU + `document.getElementById('ev-new-ent-title').value='${NAZEV}';
   document.getElementById('ev-new-ent-aspect').value='Task';
   document.getElementById('ev-add-new-ent').click();`);

nadpis('Editace entity');
const vEditaci = await stranka.evaluate(async (nazev) => {
  db.entities.length = 0;
  const e = newEntity({ title: 'Starý název', aspects: ['Task'], attributes: { status: 'todo' } });
  db.entities.push(e);
  setView('detail', { detailId: e.id, detailMode: 'edit' });
  await new Promise(z => setTimeout(z, 700));
  const ti = document.getElementById('d-title');
  ti.value = nazev;
  ti.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(z => setTimeout(z, 600));
  const x = findEntity(e.id);
  return { title: x.title, deadline: (x.attributes || {}).deadline };
}, NAZEV);
ok(soucet, vEditaci.deadline === utery && vEditaci.title === CISTY,
  'změna názvu existujícího úkolu v editaci doplní termín', vEditaci);

nadpis('Aspekt Událost dostane začátek, ne termín');
let r = await cesta(OTEVRI_PROJEKT + `document.getElementById('proj-quick-ent-title').value='Porada úterý 10:00';
   document.getElementById('proj-quick-ent-aspect').value='Event';
   document.getElementById('proj-quick-ent-add').click();`);
ok(soucet, r.attr.start === utery + 'T10:00' && r.attr.end === utery + 'T11:00',
  'Událost s časem → začátek i konec', r.attr);
ok(soucet, !r.attr.deadline && r.title === 'Porada', 'a žádný termín úkolu', r);
r = await cesta(OTEVRI_PROJEKT + `document.getElementById('proj-quick-ent-title').value='Porada úterý';
   document.getElementById('proj-quick-ent-aspect').value='Event';
   document.getElementById('proj-quick-ent-add').click();`);
ok(soucet, r.attr.start === utery + 'T00:00' && r.title === 'Porada',
  'Událost bez času → aspoň den v začátku', r);

nadpis('Aspekt bez pole na datum si název nechá');
r = await cesta(OTEVRI_PROJEKT + `document.getElementById('proj-quick-ent-title').value='${NAZEV}';
   document.getElementById('proj-quick-ent-aspect').value='Note';
   document.getElementById('proj-quick-ent-add').click();`);
ok(soucet, r.title === NAZEV && !r.attr.deadline && !r.attr.start,
  'u Poznámky se datum z názvu nevyřízne — nebylo by kam ho uložit', r);

nadpis('Úkol s časem si čas nechá v názvu');
r = await cesta(OTEVRI_PROJEKT + `document.getElementById('proj-quick-ent-title').value='Porada úterý 10:00';
   document.getElementById('proj-quick-ent-aspect').value='Task';
   document.getElementById('proj-quick-ent-add').click();`);
ok(soucet, r.attr.deadline === utery && r.title === 'Porada 10:00',
  'termín je typu datum, takže čas zůstane v názvu a neztratí se', r);

nadpis('Prázdný projekt nabízí rychlé přidání');
const prazdny = await stranka.evaluate(async () => {
  db.entities.length = 0;
  db.entities.push(newEntity({ id: 'pz', title: 'Prázdný projekt', aspects: ['Project'] }));
  setView('detail', { detailId: 'pz', detailMode: 'read' });
  await new Promise(z => setTimeout(z, 700));
  const je = !!document.getElementById('proj-quick-task-add');
  if (!je) return { formular: false };
  document.getElementById('proj-quick-task-title').value = 'Něco udělat úterý';
  document.getElementById('proj-quick-task-add').click();
  await new Promise(z => setTimeout(z, 600));
  const n = db.entities.find(x => x.id !== 'pz');
  return { formular: true, title: n ? n.title : null, deadline: n ? (n.attributes || {}).deadline : null,
    vazba: n ? (n.links || []).map(l => l.type + '→' + l.to).join(',') : null };
});
ok(soucet, prazdny.formular === true,
  'i prázdný projekt má formulář „+ Nový úkol" (dřív se vůbec nevykreslil)', prazdny);
ok(soucet, prazdny.deadline === utery && prazdny.title === 'Něco udělat',
  'a termín z názvu v něm funguje taky', prazdny);
ok(soucet, prazdny.vazba === 'partOf→pz', 'úkol se připojil k projektu', prazdny);

nadpis('+ Nová entita (globální tlačítko): všemi třemi cestami z editace');
// Tlačítko „+ Nová entita" otevře prázdný editor a název se píše do něj, takže
// datum z názvu může doplnit jedině ukončení editace. Dřív mělo tlačítko Hotovo
// vlastní kopii pravidla, která uměla jen Úkol a deadline — událost s časem
// v názvu („Porada úterý 10:00") projela bez začátku a konce, a Escape ani
// klávesa U nedoplnily nic.
const patek = await stranka.evaluate(() => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  let diff = 5 - d.getDay(); if (diff <= 0) diff += 7;
  d.setDate(d.getDate() + diff);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
});
const utery1000 = utery + 'T10:00';
const utery1100 = utery + 'T11:00';

// Založí entitu přes skutečné tlačítko, nastaví název i aspekt v editoru
// a odejde zvolenou cestou.
const novaEntitaPres = (nazev, aspekt, odchod) => stranka.evaluate(async ({ nazev, aspekt, odchod }) => {
  db.entities.length = 0;
  db.entities.push(newEntity({ id: 'kan', title: 'KANÁREK', aspects: ['Note'], body: 'TELO-KANARKA' }));
  state.view = 'dashboard'; render();
  await new Promise(z => setTimeout(z, 200));
  document.getElementById('btn-new-entity').click();
  await new Promise(z => setTimeout(z, 500));
  const t = document.getElementById('d-title');
  if (!t) return { chyba: 'editor názvu se neotevřel' };
  t.value = nazev; t.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(z => setTimeout(z, 200));
  const cb = [...document.querySelectorAll('#d-aspects input[type="checkbox"]')].find(x => x.value === aspekt);
  if (!cb) return { chyba: 'zaškrtávátko aspektu ' + aspekt + ' nenalezeno' };
  cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(z => setTimeout(z, 400));
  if (odchod === 'hotovo') {
    const b = document.getElementById('btn-done');
    if (!b) return { chyba: 'btn-done chybí' };
    b.click();
  } else if (odchod === 'escape') {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  } else if (odchod === 'u') {
    const ta = document.getElementById('d-body'); if (ta) ta.blur();
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'u', bubbles: true }));
  }
  await new Promise(z => setTimeout(z, 700));
  const n = db.entities.find(x => x.id !== 'kan');
  if (!n) return { chyba: 'entita nevznikla' };
  const kan = findEntity('kan');
  return { title: n.title, aspekty: (n.aspects || []).join(','), attr: n.attributes || {},
    rezim: state.detailMode, kanarek: kan ? kan.title + '|' + kan.body : '(kanárek zmizel)' };
}, { nazev, aspekt, odchod });

for (const odchod of ['hotovo', 'escape', 'u']) {
  const u = await novaEntitaPres(NAZEV, 'Task', odchod);
  if (u.chyba) { ok(soucet, false, '+ Nová entita (' + odchod + ', úkol): ' + u.chyba); }
  else {
    ok(soucet, u.attr.deadline === utery && u.title === CISTY,
      '+ Nová entita → Úkol, odchod ' + odchod + ' → termín ' + utery + ' a čistý název', u);
    ok(soucet, u.rezim === 'read', '  a editace skončila (read mód)', u.rezim);
    ok(soucet, u.kanarek === 'KANÁREK|TELO-KANARKA', '  kanárek: cizí entita nedotčená', u.kanarek);
  }
  const ev = await novaEntitaPres('Porada úterý 10:00', 'Event', odchod);
  if (ev.chyba) { ok(soucet, false, '+ Nová entita (' + odchod + ', událost): ' + ev.chyba); }
  else {
    ok(soucet, ev.attr.start === utery1000 && ev.attr.end === utery1100,
      '+ Nová entita → Událost, odchod ' + odchod + ' → ' + utery1000 + '–11:00', ev);
    ok(soucet, ev.title === 'Porada', '  a z názvu zmizel den i čas', ev.title);
  }
}

nadpis('+ Nová entita s aspektem, který termín nemá, název nemění');
{
  const pozn = await novaEntitaPres('Zápis z porady 5.6.2025', 'Note', 'hotovo');
  ok(soucet, pozn.title === 'Zápis z porady 5.6.2025' && !pozn.attr.deadline && !pozn.attr.start,
    'Poznámka si název nechá celý a nic se jí nedoplní', pozn);
}

nadpis('Entita, která termín už má, se při další editaci nemění');
{
  const r2 = await stranka.evaluate(async () => {
    db.entities.length = 0;
    db.entities.push(newEntity({ id: 'hotovy', title: 'Odeslat fakturu 30.6.', aspects: ['Task'],
      attributes: { deadline: '2026-12-01' } }));
    setView('detail', { detailId: 'hotovy', detailMode: 'edit' });
    await new Promise(z => setTimeout(z, 500));
    const b = document.getElementById('btn-done'); if (b) b.click();
    await new Promise(z => setTimeout(z, 600));
    const e = findEntity('hotovy');
    return { title: e.title, deadline: e.attributes.deadline };
  });
  ok(soucet, r2.title === 'Odeslat fakturu 30.6.' && r2.deadline === '2026-12-01',
    'název ani termín se nepřepsaly (doplňuje se jen do prázdného pole)', r2);
}

nadpis('→ Entita z markdown úkolu');
// Povýšení md úkolu na entitu vyrábí vždycky Úkol, takže termín v textu úkolu
// patří do pole. Odkaz vkládaný zpátky do textu musí mířit na UKLIZENÝ název,
// jinak by ukazoval na entitu, která se tak nejmenuje.
{
  const r3 = await stranka.evaluate(async () => {
    db.entities.length = 0;
    db.entities.push(newEntity({ id: 'h', title: 'Hostitel', aspects: ['Note'],
      body: 'KANAREK-ZACATEK\n\n- [ ] zavolat Petrovi do pátku\n\nKANAREK-KONEC' }));
    setView('detail', { detailId: 'h', detailMode: 'read' });
    await new Promise(z => setTimeout(z, 700));
    const btn = document.querySelector('.task-convert-btn');
    if (!btn) return { chyba: 'tlačítko → Entita nenalezeno' };
    btn.click();
    await new Promise(z => setTimeout(z, 700));
    const n = db.entities.find(x => x.id !== 'h');
    const host = findEntity('h');
    if (!n) return { chyba: 'entita nevznikla' };
    return { title: n.title, aspekty: (n.aspects || []).join(','), attr: n.attributes || {},
      odkaz: (host.body.match(/\[\[[^\]]+\]\]/) || [])[0],
      kanarky: host.body.includes('KANAREK-ZACATEK') && host.body.includes('KANAREK-KONEC') };
  });
  if (r3.chyba) ok(soucet, false, '→ Entita: ' + r3.chyba);
  else {
    ok(soucet, r3.attr.deadline === patek && r3.title === 'zavolat Petrovi',
      '→ Entita z md úkolu doplní termín (' + patek + ') a uklidí název', r3);
    ok(soucet, r3.odkaz === '[[zavolat Petrovi]]',
      '  wiki odkaz v textu míří na uklizený název', r3.odkaz);
    ok(soucet, r3.kanarky === true, '  kanárci: zbytek textu hostitele je celý', r3.kanarky);
  }
}

nadpis('Entita z vybraného textu podle zvoleného aspektu');
{
  const r4 = await stranka.evaluate(async () => {
    db.entities.length = 0;
    db.entities.push(newEntity({ id: 'z', title: 'Zdroj', aspects: ['Note'],
      body: 'odeslat fakturu do pátku\nKANAREK-ZDROJ' }));
    setView('detail', { detailId: 'z', detailMode: 'edit' });
    await new Promise(z => setTimeout(z, 700));
    const ta = document.getElementById('d-body');
    if (!ta) return { chyba: 'editor těla nenalezen' };
    const txt = 'odeslat fakturu do pátku';
    const s = ta.value.indexOf(txt);
    doMdExtract(ta, findEntity('z'), s, s + txt.length, txt);
    await new Promise(z => setTimeout(z, 400));
    const asp = document.getElementById('extract-aspect');
    if (!asp) return { chyba: 'select aspektu v dialogu chybí' };
    asp.value = 'Task';
    document.getElementById('extract-create').click();
    await new Promise(z => setTimeout(z, 600));
    const n = db.entities.find(x => x.id !== 'z');
    if (!n) return { chyba: 'entita nevznikla' };
    const pole = document.getElementById('d-body');
    return { title: n.title, aspekty: (n.aspects || []).join(','), attr: n.attributes || {},
      odkaz: (pole.value.match(/\[\[[^\]]+\]\]/) || [])[0],
      kanarek: pole.value.includes('KANAREK-ZDROJ') };
  });
  if (r4.chyba) ok(soucet, false, 'Entita z výběru: ' + r4.chyba);
  else {
    ok(soucet, r4.attr.deadline === patek && r4.title === 'odeslat fakturu',
      'entita z výběru s aspektem Úkol dostane termín ' + patek, r4);
    ok(soucet, r4.odkaz === '[[odeslat fakturu]]',
      '  vložený odkaz míří na uklizený název', r4.odkaz);
    ok(soucet, r4.kanarek === true, '  kanárek: zbytek textu zůstal', r4.kanarek);
  }
}

nadpis('Vytvořit související entitu');
{
  const r5 = await stranka.evaluate(async () => {
    db.entities.length = 0;
    db.entities.push(newEntity({ id: 's', title: 'Středisko', aspects: ['Note'] }));
    setView('detail', { detailId: 's', detailMode: 'read' });
    await new Promise(z => setTimeout(z, 600));
    openCreateRelatedDialog(findEntity('s'));
    await new Promise(z => setTimeout(z, 500));
    const ni = document.getElementById('rel-name');
    if (!ni) return { chyba: 'rel-name chybí' };
    ni.value = 'Porada úterý 10:00';
    const asp = document.getElementById('rel-aspect');
    asp.value = 'Event'; asp.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(z => setTimeout(z, 200));
    document.getElementById('rel-create').click();
    await new Promise(z => setTimeout(z, 600));
    const n = db.entities.find(x => x.id !== 's');
    if (!n) return { chyba: 'entita nevznikla' };
    const zdroj = findEntity('s');
    return { title: n.title, aspekty: (n.aspects || []).join(','), attr: n.attributes || {},
      kanarek: zdroj.title + '|' + (zdroj.aspects || []).join(',') };
  });
  if (r5.chyba) ok(soucet, false, 'Vytvořit související: ' + r5.chyba);
  else {
    ok(soucet, r5.attr.start === utery1000 && r5.attr.end === utery1100 && r5.title === 'Porada',
      'související entita s aspektem Událost dostane začátek i konec', r5);
    ok(soucet, r5.kanarek === 'Středisko|Note', '  kanárek: zdrojová entita nedotčená', r5.kanarek);
  }
}

nadpis('Entita ze šablony (název z {prompt:…})');
{
  const r6 = await stranka.evaluate(async () => {
    db.entities.length = 0;
    db.customTemplates = [{ id: 'tpl-x', name: 'Testovací úkol', description: '', aspects: ['Task'],
      title: '{prompt:Název úkolu}', body: '', attributes: {}, tags: [] }];
    const slib = instantiateTemplate(db.customTemplates[0]);
    await new Promise(z => setTimeout(z, 400));
    const inp = document.getElementById('dialog-prompt-input');
    if (!inp) return { chyba: 'prompt dialog se neotevřel' };
    inp.value = 'Dodělat prezentaci do pátku';
    document.getElementById('prompt-ok').click();
    const e = await slib;
    if (!e) return { chyba: 'šablona nevrátila entitu' };
    return { title: e.title, aspekty: (e.aspects || []).join(','), attr: e.attributes || {} };
  });
  if (r6.chyba) ok(soucet, false, 'Šablona: ' + r6.chyba);
  else ok(soucet, r6.attr.deadline === patek && r6.title === 'Dodělat prezentaci',
    'entita ze šablony s aspektem Úkol dostane termín ' + patek, r6);
}

nadpis('Šablona, která termín nastavuje sama, si ho udrží');
{
  const r7 = await stranka.evaluate(async () => {
    db.entities.length = 0;
    db.customTemplates = [{ id: 'tpl-y', name: 'Úkol na dnes', description: '', aspects: ['Task'],
      title: '{prompt:Název}', body: '', attributes: { deadline: '{today}' }, tags: [] }];
    const slib = instantiateTemplate(db.customTemplates[0]);
    await new Promise(z => setTimeout(z, 400));
    const inp = document.getElementById('dialog-prompt-input');
    if (!inp) return { chyba: 'prompt dialog se neotevřel' };
    inp.value = 'Něco udělat do pátku';
    document.getElementById('prompt-ok').click();
    const e = await slib;
    if (!e) return { chyba: 'šablona nevrátila entitu' };
    return { title: e.title, deadline: (e.attributes || {}).deadline, dnes: todayIso() };
  });
  if (r7.chyba) ok(soucet, false, 'Šablona s termínem: ' + r7.chyba);
  else ok(soucet, r7.deadline === r7.dnes && r7.title === 'Něco udělat do pátku',
    'termín ze šablony má přednost a název se nemění (zapisuje se jen do prázdna)', r7);
}

nadpis('Zachycení do Inboxu zůstává bez parsování');
r = await cesta(`const ta=document.getElementById('quick-text'); ta.value='${NAZEV}';
   (document.getElementById('quick-save')||document.querySelector('#dialog-quick button.primary')).click();`);
ok(soucet, r.title === NAZEV && r.aspekty === 'Note',
  'Poznámka v Inboxu si název nechá celý — nemá kam datum uložit', r);

await prohlizec.close();
process.exit(uzavri(soucet));
