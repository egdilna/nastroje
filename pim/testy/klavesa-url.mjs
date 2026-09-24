// KLÁVESA „o" V DETAILU — otevře jediný vyplněný URL atribut.
//
// Chová se jako kliknutí na ten odkaz. Když URL atributů je víc nebo žádný,
// nic se neotevře a uživatel se hláškou dozví proč.
import { novySoucet, ok, nadpis, otevriAplikaci, nasypej, otevriDetail, uzavri } from './lib.mjs';

const s = novySoucet('Klávesa o — otevřít URL');
const { prohlizec, stranka } = await otevriAplikaci(s);

// window.open odchytíme, ať test nic doopravdy neotevírá
const sledujOtevirani = () => stranka.evaluate(() => {
  window.__otevrene = [];
  if (!window.__puvodniOpen) window.__puvodniOpen = window.open;
  window.open = (u, cil, vlastnosti) => { window.__otevrene.push({ url: u, cil, vlastnosti }); return null; };
});
const otevrene = () => stranka.evaluate(() => window.__otevrene || []);
const hlaska = () => stranka.evaluate(() => (document.querySelector('.toast') || {}).textContent || '');

await nasypej(stranka, [
  // Záložka má jediné url pole
  { id: 'u1', title: 'Jedna adresa', aspects: ['Bookmark'], attributes: { url: 'https://priklad.cz/clanek' } },
  // Organizace má web; navíc prázdné pole se nepočítá
  { id: 'u2', title: 'Firma', aspects: ['Organization'], attributes: { website: 'https://firma.cz', legal_name: 'Firma a.s.' } },
  { id: 'u3', title: 'Bez adresy', aspects: ['Note'], body: 'jen text' },
  { id: 'u4', title: 'Prazdne url', aspects: ['Bookmark'], attributes: { url: '   ' } },
  { id: 'u5', title: 'Odkaz v textu', aspects: ['Note'], body: 'https://v-tele.cz nepočítá se' }
]);

nadpis('Jediný URL atribut');
await sledujOtevirani();
await otevriDetail(stranka, 'u1', 'read');
await stranka.keyboard.press('o');
await stranka.waitForTimeout(400);
let o = await otevrene();
ok(s, o.length === 1, 'klávesa o něco otevřela', o);
ok(s, o[0] && o[0].url === 'https://priklad.cz/clanek', 'a je to ta správná adresa', o);
ok(s, o[0] && o[0].cil === '_blank', 'otevírá se v novém okně', o);
ok(s, o[0] && /noopener/.test(o[0].vlastnosti || ''), 'a s noopener', o);
ok(s, /Otevřeno/.test(await hlaska()), 'hláška to potvrdí', await hlaska());

nadpis('Jiné pole typu url (Organizace → Web)');
await sledujOtevirani();
await otevriDetail(stranka, 'u2', 'read');
await stranka.keyboard.press('o');
await stranka.waitForTimeout(400);
o = await otevrene();
ok(s, o.length === 1 && o[0].url === 'https://firma.cz', 'najde i pole s jiným klíčem', o);

nadpis('Entita bez URL atributu');
await sledujOtevirani();
await otevriDetail(stranka, 'u3', 'read');
await stranka.keyboard.press('o');
await stranka.waitForTimeout(400);
ok(s, (await otevrene()).length === 0, 'nic se neotevře');
ok(s, /nemá vyplněný žádný atribut typu URL/.test(await hlaska()), 'a hláška řekne proč', await hlaska());

nadpis('Prázdná hodnota se nepočítá');
await sledujOtevirani();
await otevriDetail(stranka, 'u4', 'read');
await stranka.keyboard.press('o');
await stranka.waitForTimeout(400);
ok(s, (await otevrene()).length === 0, 'samé mezery se neberou jako adresa');
ok(s, /nemá vyplněný žádný/.test(await hlaska()), 'a chová se jako by pole nebylo', await hlaska());

nadpis('URL jen v textu se nepočítá');
await sledujOtevirani();
await otevriDetail(stranka, 'u5', 'read');
await stranka.keyboard.press('o');
await stranka.waitForTimeout(400);
ok(s, (await otevrene()).length === 0, 'odkaz v obsahu není atribut typu url');

nadpis('Víc URL atributů — nehádá se');
await stranka.evaluate(() => {
  db.customAspects = [{ key: 'dvojity', label: 'Dvojitý', fields: [
    { key: 'url_a', label: 'První adresa', type: 'url' },
    { key: 'url_b', label: 'Druhá adresa', type: 'url' }
  ] }];
  db.entities.push(newEntity({ id: 'u6', title: 'Dve adresy', aspects: ['dvojity'],
    attributes: { url_a: 'https://prvni.cz', url_b: 'https://druha.cz' } }));
});
await sledujOtevirani();
await otevriDetail(stranka, 'u6', 'read');
await stranka.keyboard.press('o');
await stranka.waitForTimeout(400);
ok(s, (await otevrene()).length === 0, 'při dvou adresách se nic neotevře');
ok(s, /2 vyplněných URL/.test(await hlaska()), 'hláška řekne kolik jich je', await hlaska());

nadpis('Mimo detail klávesa nic nedělá');
await sledujOtevirani();
await stranka.evaluate(() => { state.view = 'all'; state.filter = { aspect:'', tag:'', text:'', status:'', attrFilters: [] }; render(); });
await stranka.waitForTimeout(400);
await stranka.keyboard.press('o');
await stranka.waitForTimeout(300);
ok(s, (await otevrene()).length === 0, 'v seznamu entit se nic neotevře');

nadpis('V editačním poli se klávesa jen napíše');
await sledujOtevirani();
await otevriDetail(stranka, 'u1', 'edit');
await stranka.waitForTimeout(400);
const poleTitulek = await stranka.evaluate(() => !!document.getElementById('d-title'));
if (poleTitulek) {
  await stranka.click('#d-title');
  await stranka.keyboard.press('o');
  await stranka.waitForTimeout(300);
  ok(s, (await otevrene()).length === 0, 'psaní v poli neotevírá odkazy');
  ok(s, /o$/.test(await stranka.evaluate(() => document.getElementById('d-title').value)),
    'a písmeno se normálně napsalo',
    await stranka.evaluate(() => document.getElementById('d-title').value));
} else {
  ok(s, false, 'edit mód nemá pole názvu');
}

await prohlizec.close();
process.exit(uzavri(s));
