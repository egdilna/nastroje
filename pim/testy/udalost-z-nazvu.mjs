// Pravidlo úkol / událost při rychlém zakládání z názvu:
//   jen den               → Úkol s termínem
//   den + začátek času    → Událost, konec = začátek + 1 h
//   den + rozsah časů     → Událost s tím rozsahem
//
// Plus jeden parser dat: dny v 1. i 4. pádě, s předložkou „v"/„ve" i bez ní.
// „ve středu ráno" dřív tiše dávalo DNEŠEK — neurčitá část dne nastavila čas
// a parser doplnil datum na dnešek, protože den nerozpoznal. Proto je tu na to
// vlastní kontrola.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, uzavri } from './lib.mjs';

const soucet = novySoucet('Událost z názvu');
const { prohlizec, stranka } = await otevriAplikaci(soucet);

// Pevný referenční den, ať testy nezávisí na tom, kdy se spustí.
const dnes = await stranka.evaluate(() => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  return { iso: d.toISOString().slice(0, 10), dow: d.getDay() };
});
const poDnech = (n) => stranka.evaluate((n) => {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}, n);
const kDni = (dow) => { let diff = dow - dnes.dow; if (diff <= 0) diff += 7; return diff; };

const rozpoznej = (text) => stranka.evaluate((t) => natlangParseDateInText(t), text);

nadpis('Parser: dny v obou pádech, s předložkou i bez');
const utery = await poDnech(kDni(2));
const streda = await poDnech(kDni(3));
const sobota = await poDnech(kDni(6));
for (const [vstup, ocek] of [
  ['porada úterý', utery], ['porada v úterý', utery],
  ['porada středa', streda], ['porada ve středu', streda], ['porada v středu', streda],
  ['porada sobota', sobota], ['porada v sobotu', sobota]
]) {
  const p = await rozpoznej(vstup);
  ok(soucet, p && p.datum === ocek && p.cleanedDatum === 'porada',
    '„' + vstup + '" → ' + ocek + ' a čistý název', p);
}

nadpis('Předložka se vyřízne spolu s datem');
for (const [vstup, ocekName] of [
  ['porada v úterý v 10:00', 'porada'],
  ['odeslat fakturu do 30.6.', 'odeslat fakturu']
]) {
  const p = await rozpoznej(vstup);
  ok(soucet, p && p.cleaned === ocekName,
    '„' + vstup + '" nenechá v názvu viset předložku', p && p.cleaned);
}

nadpis('Neurčitá část dne není začátek času');
const p1 = await rozpoznej('schůzka ve středu ráno');
ok(soucet, p1 && p1.datum === streda, '„ve středu ráno" je STŘEDA, ne dnešek (dřív tiše dávalo dnešek)', p1);
ok(soucet, p1 && p1.cas === null && p1.casNepresny === true, '„ráno" se nebere jako začátek času', p1);
ok(soucet, p1 && p1.cleaned === 'schůzka ráno',
  'a z názvu se nevyřízne, protože se nikam neukládá', p1 && p1.cleaned);

nadpis('Parser: časy a rozsahy');
const kontrolaCasu = async (vstup, cas, konec) => {
  const p = await rozpoznej(vstup);
  ok(soucet, p && p.cas === cas && p.casKonec === konec,
    '„' + vstup + '" → ' + cas + (konec ? '–' + konec : ''), p);
};
await kontrolaCasu('porada úterý 10:00', '10:00', null);
await kontrolaCasu('porada úterý 10:00-12:00', '10:00', '12:00');
await kontrolaCasu('porada úterý 10:00 – 12:00', '10:00', '12:00');
await kontrolaCasu('porada úterý od 10 do 12', '10:00', '12:00');
await kontrolaCasu('porada úterý 10-12', '10:00', '12:00');
await kontrolaCasu('porada 10h', '10:00', null);

nadpis('Parser nesmí vidět čas tam, kde není');
for (const vstup of ['koupit 2 kg mouky', 'verze 2.0 release', 'release 2-3', 'napsat kapitolu']) {
  const p = await rozpoznej(vstup);
  ok(soucet, p === null, '„' + vstup + '" nic nerozpozná', p);
}

nadpis('Jen den → úkol s termínem');
await nasypej(stranka, []);
const vytvor = (text) => stranka.evaluate(async (t) => {
  const r = createQuickTaskFromText({ rawTitle: t });
  await new Promise(z => setTimeout(z, 100));
  const e = r.entity;
  return { aspekty: (e.aspects || []).join(','), title: e.title, attr: e.attributes, jeUdalost: r.jeUdalost };
}, text);

let v = await vytvor('zavolat Petrovi v úterý');
ok(soucet, v.aspekty === 'Task', 'jen den → Úkol', v);
ok(soucet, v.attr.deadline === utery && !v.attr.start, 'má termín a žádný začátek', v.attr);
ok(soucet, v.title === 'zavolat Petrovi', 'název je bez data', v.title);

nadpis('Den + začátek času → událost na hodinu');
v = await vytvor('porada úterý 10:00');
ok(soucet, v.aspekty === 'Event' && v.jeUdalost === true, 'den + čas → Událost', v);
ok(soucet, v.attr.start === utery + 'T10:00', 'začátek sedí', v.attr);
ok(soucet, v.attr.end === utery + 'T11:00', 'konec je o hodinu dál', v.attr);
ok(soucet, !v.attr.deadline && !v.attr.status, 'událost nemá termín ani stav úkolu', v.attr);
ok(soucet, v.title === 'porada', 'název je bez data i času', v.title);

nadpis('Den + rozsah → událost přesně na ten rozsah');
v = await vytvor('workshop úterý 10:00-12:30');
ok(soucet, v.aspekty === 'Event', 'rozsah → Událost', v);
ok(soucet, v.attr.start === utery + 'T10:00' && v.attr.end === utery + 'T12:30',
  'začátek i konec podle zadaného rozsahu', v.attr);

nadpis('Čas bez dne znamená dnešek');
v = await vytvor('porada 14:00');
ok(soucet, v.aspekty === 'Event' && v.attr.start === dnes.iso + 'T14:00',
  'samotný čas = dnes', v.attr);

nadpis('Přes půlnoc');
v = await vytvor('noční směna úterý 23:30');
ok(soucet, v.attr.start === utery + 'T23:30', 'začátek 23:30', v.attr);
const utery1 = await poDnech(kDni(2) + 1);
ok(soucet, v.attr.end === utery1 + 'T00:30', 'konec přetéká na další den, ne na 00:30 téhož dne', v.attr);

nadpis('Neurčitá část dne zůstává úkolem');
v = await vytvor('schůzka ve středu ráno');
ok(soucet, v.aspekty === 'Task', '„ráno" událost nedělá', v);
ok(soucet, v.attr.deadline === streda, 'ale termín je správně středa', v.attr);
ok(soucet, v.title === 'schůzka ráno', 'a „ráno" zůstane v názvu', v.title);

nadpis('Bez data vzniká úkol jako dřív');
v = await vytvor('napsat kapitolu');
ok(soucet, v.aspekty === 'Task' && !v.attr.deadline && v.attr.status === 'todo',
  'text bez data → obyčejný úkol', v);

nadpis('Termín úkolu zůstává datum, čas se z názvu nevyřízne');
const pt = await stranka.evaluate(() => parseTaskDateFromTitle('porada úterý 10:00'));
ok(soucet, pt && pt.deadline === await Promise.resolve(utery), 'termín je datum bez času', pt);
ok(soucet, pt && pt.cleanedTitle === 'porada 10:00',
  'čas zůstane v názvu, protože se do termínu neukládá', pt);

nadpis('Událost založená u projektu dostane vazbu i tagy');
await nasypej(stranka, [
  { id: 'pa', title: 'Projekt A', aspects: ['Project'], tags: ['projektovy'] }
]);
const vProjektu = await stranka.evaluate(async () => {
  const r = createQuickTaskFromText({ rawTitle: 'porada úterý 9:00', projectIds: ['pa'], tags: ['projektovy'] });
  await new Promise(z => setTimeout(z, 100));
  return { aspekty: (r.entity.aspects || []).join(','), tags: (r.entity.tags || []).join(','),
    vazby: (r.entity.links || []).map(l => l.type + '→' + l.to).join(',') };
});
ok(soucet, vProjektu.aspekty === 'Event', 'i u projektu platí totéž pravidlo', vProjektu);
ok(soucet, vProjektu.vazby === 'partOf→pa', 'událost je součástí projektu', vProjektu);
ok(soucet, vProjektu.tags === 'projektovy', 'a má vybrané tagy', vProjektu);

nadpis('Dny v týdnu ve 2. pádě a s předložkami do/od/na/k');
// „do pátku" je u termínů nejčastější tvar vůbec a dřív se nerozpoznal: úkol
// zůstal bez termínu a s časem v názvu se termín tiše posadil na DNEŠEK.
const patek = await poDnech(kDni(5));
const pondeli = await poDnech(kDni(1));
const ctvrtek = await poDnech(kDni(4));
for (const [vstup, ocekDatum, ocekNazev] of [
  ['Udělat do pátku', patek, 'Udělat'],
  ['Udělat do patku', patek, 'Udělat'],
  ['Udělat od pátku', patek, 'Udělat'],
  ['Udělat na pátek', patek, 'Udělat'],
  ['Udělat k pátku', patek, 'Udělat'],
  ['Udělat nejpozději v pátek', patek, 'Udělat'],
  ['Udělat do pondělka', pondeli, 'Udělat'],
  ['Udělat do pondělí', pondeli, 'Udělat'],
  ['Udělat do čtvrtka', ctvrtek, 'Udělat'],
  ['Udělat do středy', await poDnech(kDni(3)), 'Udělat'],
  ['Udělat do soboty', await poDnech(kDni(6)), 'Udělat'],
  ['Udělat do neděle', await poDnech(kDni(0)), 'Udělat']
]) {
  const p = await rozpoznej(vstup);
  ok(soucet, p && p.datum === ocekDatum && p.cleanedDatum === ocekNazev,
    '„' + vstup + '" → ' + ocekDatum + ', název „' + ocekNazev + '"', p);
}

nadpis('Předložka se vyřezává spolu s datem, v názvu nic nevisí');
for (const vstup of ['Udělat do pátku', 'Udělat na pátek', 'Udělat do zítřka', 'Udělat za týden']) {
  const p = await rozpoznej(vstup);
  ok(soucet, p && !/\s(do|na|od|k|ke|za)$/.test(p.cleanedDatum),
    '„' + vstup + '" nenechá v názvu viset předložku → „' + (p && p.cleanedDatum) + '"', p);
}

nadpis('Relativní termíny ve 2. pádě a po týdnech');
for (const [vstup, ocek] of [
  ['Udělat do zítřka', await poDnech(1)],
  ['Udělat do pozítřka', await poDnech(2)],
  ['Udělat za týden', await poDnech(7)],
  ['Udělat za 2 týdny', await poDnech(14)],
  ['Udělat za 3 dny', await poDnech(3)]
]) {
  const p = await rozpoznej(vstup);
  ok(soucet, p && p.datum === ocek, '„' + vstup + '" → ' + ocek, p);
}

nadpis('Do konce týdne a do konce měsíce');
{
  const pKonecM = await rozpoznej('Zaplatit do konce měsíce');
  const posledni = await stranka.evaluate(() => {
    const d = new Date(); const k = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return k.getFullYear() + '-' + String(k.getMonth() + 1).padStart(2, '0') + '-' + String(k.getDate()).padStart(2, '0');
  });
  ok(soucet, pKonecM && pKonecM.datum === posledni && pKonecM.cleanedDatum === 'Zaplatit',
    '„do konce měsíce" → poslední den měsíce (' + posledni + ')', pKonecM);
  const pKonecT = await rozpoznej('Odeslat do konce týdne');
  const ocekPatek = (dnes.dow >= 1 && dnes.dow <= 5)
    ? await poDnech(5 - dnes.dow)
    : await poDnech(kDni(5));
  ok(soucet, pKonecT && pKonecT.datum === ocekPatek,
    '„do konce týdne" → pátek (' + ocekPatek + ')', pKonecT);
}

nadpis('Datum se jménem měsíce');
for (const [vstup, ocekMesDen] of [
  ['Udělat 1. listopadu 2026', '2026-11-01'],
  ['Udělat 15. března 2027', '2027-03-15'],
  ['Udělat do 3. června 2027', '2027-06-03'],
  ['Udělat 24. prosince 2026', '2026-12-24'],
  ['Udělat 1. července 2027', '2027-07-01'],
  ['Udělat 1. června 2027', '2027-06-01'],
  ['Udělat 5. zari 2027', '2027-09-05']
]) {
  const p = await rozpoznej(vstup);
  ok(soucet, p && p.datum === ocekMesDen && p.cleanedDatum === 'Udělat',
    '„' + vstup + '" → ' + ocekMesDen, p);
}
{
  // Bez roku se bere nejbližší budoucí výskyt, stejně jako u „30.6."
  const p = await rozpoznej('Udělat 1. října');
  ok(soucet, p && /-10-01$/.test(p.datum) && p.datum >= dnes.iso,
    '„1. října" bez roku padne do budoucnosti → ' + (p && p.datum), p);
}

nadpis('Čas: holá hodina jen s předložkou');
for (const [vstup, ocekCas] of [
  ['Porada v 9', '09:00'], ['Porada ve 14', '14:00'], ['Porada od 9', '09:00'],
  ['Porada v 14.30', '14:30'], ['Porada ve 9:30', '09:30'], ['Porada 9h', '09:00']
]) {
  const p = await rozpoznej(vstup);
  ok(soucet, p && p.cas === ocekCas, '„' + vstup + '" → čas ' + ocekCas, p);
}
nadpis('Čas se nesmí hádat z pouhého čísla v názvu');
for (const vstup of ['Kapitola 10 dopsat', 'Objednat 3 ks papíru', 'Verze 2-3 dokumentace',
                     'Revize smlouvy 2024', 'Rozpočet na rok 2026', 'Projekt Horizont 2030',
                     'Dopsat v 1. kapitole', 'Úkol bez data']) {
  const p = await rozpoznej(vstup);
  ok(soucet, p === null, '„' + vstup + '" není datum ani čas', p);
}

nadpis('Den a čas spolu: termín nesmí spadnout na dnešek');
{
  const p = await rozpoznej('Udělat do pátku 10:00');
  ok(soucet, p && p.datum === patek && p.cas === '10:00',
    '„Udělat do pátku 10:00" → ' + patek + ' 10:00, ne dnešek', p);
  const p2 = await rozpoznej('Sejít se v pondělí v 9');
  ok(soucet, p2 && p2.datum === pondeli && p2.cas === '09:00',
    '„Sejít se v pondělí v 9" → ' + pondeli + ' 09:00', p2);
}

nadpis('Entity, kterých se to netýká, zůstávají beze změny');
const kanarek = await stranka.evaluate(() => {
  const p = findEntity('pa');
  return { tags: (p.tags || []).join(','), aspekty: (p.aspects || []).join(','), attr: JSON.stringify(p.attributes || {}) };
});
ok(soucet, kanarek.aspekty === 'Project' && kanarek.tags === 'projektovy',
  'projekt samotný je nedotčený (kanárek)', kanarek);

await prohlizec.close();
process.exit(uzavri(soucet));
