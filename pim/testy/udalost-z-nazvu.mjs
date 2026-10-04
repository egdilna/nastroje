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

nadpis('Entity, kterých se to netýká, zůstávají beze změny');
const kanarek = await stranka.evaluate(() => {
  const p = findEntity('pa');
  return { tags: (p.tags || []).join(','), aspekty: (p.aspects || []).join(','), attr: JSON.stringify(p.attributes || {}) };
});
ok(soucet, kanarek.aspekty === 'Project' && kanarek.tags === 'projektovy',
  'projekt samotný je nedotčený (kanárek)', kanarek);

await prohlizec.close();
process.exit(uzavri(soucet));
